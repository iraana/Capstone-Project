import importlib
import sys
from unittest.mock import MagicMock
import pytest
import runpy
import flask

MODULE_NAME = "index"

class DummyResponse:
    def __init__(self, data=None, error=None):
        self.data = data
        self.error = error

@pytest.fixture
def app_module(monkeypatch):
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")

    dummy_supabase = MagicMock(name="supabase_client")

    import supabase as supabase_pkg
    monkeypatch.setattr(supabase_pkg, "create_client", lambda url, key: dummy_supabase)

    if MODULE_NAME in sys.modules:
        del sys.modules[MODULE_NAME]

    mod = importlib.import_module(MODULE_NAME)

    mod.supabase = dummy_supabase
    return mod, dummy_supabase


@pytest.fixture
def client(app_module):
    mod, _ = app_module
    return mod.app.test_client()


def test_hello_world(client):
    resp = client.get("/api/hello")
    assert resp.status_code == 200
    assert resp.data.decode() == "Hello, world!"


def test_get_user_from_token_missing_header(app_module):
    mod, _ = app_module

    with mod.app.test_request_context("/api/admin/toggle-ban", method="POST"):
        with pytest.raises(PermissionError, match="Missing Authorization header"):
            mod.get_user_from_token()


def test_get_user_from_token_invalid_token(app_module, monkeypatch):
    mod, _ = app_module

    fake_requests = MagicMock()
    fake_requests.get.return_value.status_code = 401
    fake_requests.get.return_value.json.return_value = {"message": "invalid"}

    monkeypatch.setattr(mod, "requests", fake_requests)

    with mod.app.test_request_context(
            "/api/admin/toggle-ban",
            method="POST",
            headers={"Authorization": "Bearer bad-token"},
    ):
        with pytest.raises(PermissionError, match="Invalid session token"):
            mod.get_user_from_token()


def test_get_user_from_token_success(app_module, monkeypatch):
    mod, _ = app_module

    fake_requests = MagicMock()
    fake_requests.get.return_value.status_code = 200
    fake_requests.get.return_value.json.return_value = {"id": "user-123", "email": "a@b.com"}

    monkeypatch.setattr(mod, "requests", fake_requests)

    with mod.app.test_request_context(
            "/api/admin/toggle-ban",
            method="POST",
            headers={"Authorization": "Bearer good-token"},
    ):
        user = mod.get_user_from_token()

    assert user == {"id": "user-123", "email": "a@b.com"}
    fake_requests.get.assert_called_once()


def test_is_admin_true(app_module):
    mod, supabase_mock = app_module

    resp = DummyResponse(data={"role": "ADMIN"})
    supabase_mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = resp

    assert mod.is_admin("user-1") is True


def test_is_admin_false_when_not_admin(app_module):
    mod, supabase_mock = app_module

    resp = DummyResponse(data={"role": "USER"})
    supabase_mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = resp

    assert mod.is_admin("user-2") is False


def test_is_admin_false_on_supabase_error(app_module):
    mod, supabase_mock = app_module

    resp = DummyResponse(data=None, error="db error")
    supabase_mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = resp

    assert mod.is_admin("user-3") is False


def test_delete_user_data_happy_path(app_module):
    mod, supabase_mock = app_module

    orders_table = MagicMock(name="Orders_table")
    order_items_table = MagicMock(name="OrderItems_table")
    profiles_table = MagicMock(name="profiles_table")

    supabase_mock.table.side_effect = lambda table_name: {
        "Orders": orders_table,
        "OrderItems": order_items_table,
        "profiles": profiles_table,
    }[table_name]

    pending_resp = DummyResponse(data=[{"order_id": "o1"}, {"order_id": "o2"}])
    orders_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = pending_resp

    all_orders_resp = DummyResponse(data=[{"order_id": "o1"}, {"order_id": "o2"}])
    orders_table.select.return_value.eq.return_value.execute.return_value = all_orders_resp

    delete_items_resp = DummyResponse(data=[], error=None)
    order_items_table.delete.return_value.in_.return_value.execute.return_value = delete_items_resp

    delete_orders_resp = DummyResponse(data=[], error=None)
    orders_table.delete.return_value.eq.return_value.execute.return_value = delete_orders_resp

    delete_profile_resp = DummyResponse(data=[], error=None)
    profiles_table.delete.return_value.eq.return_value.execute.return_value = delete_profile_resp

    supabase_mock.auth.admin.delete_user.return_value = None

    mod.delete_user_data("user-123")

    assert supabase_mock.rpc.call_count == 2
    supabase_mock.auth.admin.delete_user.assert_called_once_with("user-123")


def test_toggle_ban_forbidden_for_non_admin(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "user-1"})
    monkeypatch.setattr(mod, "is_admin", lambda user_id: False)

    resp = client.post(
        "/api/admin/toggle-ban",
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 403
    assert "admin" in resp.get_json()["error"].lower()


def test_toggle_ban_missing_json_body(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin-1"})
    monkeypatch.setattr(mod, "is_admin", lambda user_id: True)

    resp = client.post(
        "/api/admin/toggle-ban",
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 400
    assert resp.is_json
    assert "missing json body" in resp.get_json()["error"].lower()


def test_toggle_ban_success_ban(client, app_module, monkeypatch):
    mod, supabase_mock = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin-1"})
    monkeypatch.setattr(mod, "is_admin", lambda user_id: True)

    supabase_mock.auth.admin.update_user_by_id.return_value = None

    profiles_table = MagicMock(name="profiles_table")
    supabase_mock.table.side_effect = lambda table_name: profiles_table if table_name == "profiles" else MagicMock()

    update_resp = DummyResponse(data=[])
    profiles_table.update.return_value.eq.return_value.execute.return_value = update_resp

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"userId": "target-1", "isBanned": True},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 200
    assert resp.get_json() == {"message": "User ban status updated"}
    supabase_mock.auth.admin.update_user_by_id.assert_called_once_with("target-1", {"ban_duration": "876600h"})
    profiles_table.update.assert_called_once_with({"is_banned": True})


def test_admin_delete_user_success(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin-1"})
    monkeypatch.setattr(mod, "is_admin", lambda user_id: True)
    monkeypatch.setattr(mod, "delete_user_data", lambda user_id: None)

    resp = client.delete(
        "/api/admin/delete-user",
        json={"userId": "target-9"},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 200
    assert resp.get_json() == {"message": "User and all related data deleted"}


def test_delete_self_success(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "self-1"})
    monkeypatch.setattr(mod, "delete_user_data", lambda user_id: None)

    resp = client.delete(
        "/api/user/delete-account",
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 200
    assert resp.get_json() == {"message": "Account deleted successfully"}

def test_toggle_ban_supabase_failure(client, app_module, monkeypatch):
    mod, supabase_mock = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin-1"})
    monkeypatch.setattr(mod, "is_admin", lambda user_id: True)

    def fail(*args, **kwargs):
        raise Exception("Supabase error")

    supabase_mock.auth.admin.update_user_by_id.side_effect = fail

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"userId": "target-1", "isBanned": True},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 500
    assert "internal server error" in resp.get_json()["error"].lower()

def test_toggle_ban_profile_update_error(client, app_module, monkeypatch):
    mod, supabase_mock = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin-1"})
    monkeypatch.setattr(mod, "is_admin", lambda user_id: True)

    supabase_mock.auth.admin.update_user_by_id.return_value = None

    profiles_table = MagicMock()
    supabase_mock.table.side_effect = lambda name: profiles_table

    bad_resp = DummyResponse(data=None, error="update failed")
    profiles_table.update.return_value.eq.return_value.execute.return_value = bad_resp

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"userId": "target-1", "isBanned": True},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 500

def test_delete_user_data_orders_query_failure(app_module):
    mod, supabase_mock = app_module

    orders_table = MagicMock()

    def raise_error(*args, **kwargs):
        raise Exception("DB failure")

    orders_table.select.return_value.eq.return_value.execute.side_effect = raise_error

    supabase_mock.table.side_effect = lambda name: orders_table

    with pytest.raises(RuntimeError):
        mod.delete_user_data("user-123")

def test_delete_user_data_auth_delete_failure(app_module):
    mod, supabase_mock = app_module

    orders_table = MagicMock()
    profiles_table = MagicMock()
    order_items_table = MagicMock()

    supabase_mock.table.side_effect = lambda name: {
        "Orders": orders_table,
        "profiles": profiles_table,
        "OrderItems": order_items_table,
    }[name]

    orders_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])
    orders_table.select.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])

    orders_table.delete.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])
    profiles_table.delete.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])

    supabase_mock.auth.admin.delete_user.side_effect = Exception("auth fail")

    with pytest.raises(RuntimeError):
        mod.delete_user_data("user-123")


def test_toggle_ban_missing_user_id(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"isBanned": True},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 400


def test_toggle_ban_invalid_is_banned_type(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"userId": "123", "isBanned": "yes"},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 400

def test_delete_user_data_orderitems_error(app_module):
    mod, supabase_mock = app_module

    orders_table = MagicMock()
    order_items_table = MagicMock()
    profiles_table = MagicMock()

    supabase_mock.table.side_effect = lambda name: {
        "Orders": orders_table,
        "OrderItems": order_items_table,
        "profiles": profiles_table,
    }[name]

    orders_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])
    orders_table.select.return_value.eq.return_value.execute.return_value = DummyResponse(data=[{"order_id": "o1"}])

    bad_resp = DummyResponse(data=None, error="delete failed")
    order_items_table.delete.return_value.in_.return_value.execute.return_value = bad_resp

    with pytest.raises(RuntimeError):
        mod.delete_user_data("user-1")

def test_delete_user_data_orders_delete_error(app_module):
    mod, supabase_mock = app_module

    orders_table = MagicMock()
    profiles_table = MagicMock()
    order_items_table = MagicMock()

    supabase_mock.table.side_effect = lambda name: {
        "Orders": orders_table,
        "OrderItems": order_items_table,
        "profiles": profiles_table,
    }[name]

    orders_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])
    orders_table.select.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])

    bad_resp = DummyResponse(data=None, error="fail")
    orders_table.delete.return_value.eq.return_value.execute.return_value = bad_resp

    with pytest.raises(RuntimeError):
        mod.delete_user_data("user-1")

def test_delete_user_data_profile_delete_error(app_module):
    mod, supabase_mock = app_module

    orders_table = MagicMock()
    profiles_table = MagicMock()
    order_items_table = MagicMock()

    supabase_mock.table.side_effect = lambda name: {
        "Orders": orders_table,
        "OrderItems": order_items_table,
        "profiles": profiles_table,
    }[name]

    orders_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])
    orders_table.select.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])

    orders_table.delete.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])

    bad_resp = DummyResponse(data=None, error="fail")
    profiles_table.delete.return_value.eq.return_value.execute.return_value = bad_resp

    with pytest.raises(RuntimeError):
        mod.delete_user_data("user-1")

def test_toggle_ban_unban(client, app_module, monkeypatch):
    mod, supabase_mock = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    supabase_mock.auth.admin.update_user_by_id.return_value = None

    profiles_table = MagicMock()
    supabase_mock.table.side_effect = lambda name: profiles_table

    profiles_table.update.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"userId": "u1", "isBanned": False},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 200
    supabase_mock.auth.admin.update_user_by_id.assert_called_with("u1", {"ban_duration": "none"})

def test_admin_delete_user_failure(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    def fail(_):
        raise Exception("boom")

    monkeypatch.setattr(mod, "delete_user_data", fail)

    resp = client.delete(
        "/api/admin/delete-user",
        json={"userId": "u1"},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 500

def test_delete_self_failure(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "u1"})

    def fail(_):
        raise Exception("boom")

    monkeypatch.setattr(mod, "delete_user_data", fail)

    resp = client.delete(
        "/api/user/delete-account",
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 500

def test_get_user_from_token_bad_format(app_module):
    mod, _ = app_module

    with mod.app.test_request_context(
            headers={"Authorization": "InvalidTokenFormat"}
    ):
        with pytest.raises(PermissionError):
            mod.get_user_from_token()

def test_is_admin_exception(app_module):
    mod, supabase_mock = app_module

    def fail(*args, **kwargs):
        raise Exception("DB crash")

    supabase_mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.side_effect = fail

    assert mod.is_admin("user-1") is False

def test_delete_user_data_orders_error_object(app_module):
    mod, supabase_mock = app_module

    orders_table = MagicMock()
    supabase_mock.table.side_effect = lambda name: orders_table

    orders_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = DummyResponse(data=[])

    bad_resp = DummyResponse(data=None, error="bad query")
    orders_table.select.return_value.eq.return_value.execute.return_value = bad_resp

    with pytest.raises(RuntimeError):
        mod.delete_user_data("user-1")

def test_admin_delete_user_missing_json(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    resp = client.delete(
        "/api/admin/delete-user",
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 400

def test_admin_delete_user_missing_user_id(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    resp = client.delete(
        "/api/admin/delete-user",
        json={},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 400

def test_delete_self_unauthorized(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: None)

    resp = client.delete("/api/user/delete-account")

    assert resp.status_code == 401

def test_toggle_ban_missing_is_banned(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"userId": "123"},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 400

def test_toggle_ban_unban_failure(client, app_module, monkeypatch):
    mod, supabase_mock = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "admin"})
    monkeypatch.setattr(mod, "is_admin", lambda _: True)

    def fail(*args, **kwargs):
        raise Exception("fail")

    supabase_mock.auth.admin.update_user_by_id.side_effect = fail

    resp = client.post(
        "/api/admin/toggle-ban",
        json={"userId": "123", "isBanned": False},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 500

def test_admin_delete_user_forbidden_message(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "user"})
    monkeypatch.setattr(mod, "is_admin", lambda _: False)

    resp = client.delete(
        "/api/admin/delete-user",
        json={"userId": "123"},
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 403
    assert "must be authenticated as an admin" in resp.get_json()["error"].lower()

def test_delete_self_exception_logging(client, app_module, monkeypatch):
    mod, _ = app_module

    monkeypatch.setattr(mod, "get_user_from_token", lambda: {"id": "u1"})

    def fail(_):
        raise Exception("boom")

    monkeypatch.setattr(mod, "delete_user_data", fail)

    resp = client.delete(
        "/api/user/delete-account",
        headers={"Authorization": "Bearer token"},
    )

    assert resp.status_code == 500

def test_missing_env_vars(monkeypatch):
    monkeypatch.delenv("SUPABASE_SERVICE_ROLE_KEY", raising=False)

    import dotenv
    monkeypatch.setattr(dotenv, "load_dotenv", lambda *args, **kwargs: None)

    if MODULE_NAME in sys.modules:
        del sys.modules[MODULE_NAME]

    with pytest.raises(ValueError, match="Missing Supabase credentials"):
        importlib.import_module(MODULE_NAME)

def test_run_main(monkeypatch):
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "test-key")

    import supabase as supabase_pkg
    monkeypatch.setattr(supabase_pkg, "create_client", lambda url, key: MagicMock())

    mock_run = MagicMock()
    monkeypatch.setattr(flask.Flask, "run", mock_run)

    import dotenv
    monkeypatch.setattr(dotenv, "load_dotenv", lambda *args, **kwargs: None)

    runpy.run_module(MODULE_NAME, run_name="__main__")

    mock_run.assert_called_once_with(port=5000, debug=False)