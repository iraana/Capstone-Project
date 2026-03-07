from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import logging
import requests

load_dotenv()

# Basic logging setup so descriptive error messages appear in server logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

url: str = f"https://vnnlrooakzcseeiqskxw.supabase.co"
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

logging.info("Checking required environment variables...")

if key:
    logging.info(f"SUPABASE_SERVICE_ROLE_KEY loaded successfully (length={len(key)})")
else:
    logging.error("SUPABASE_SERVICE_ROLE_KEY is missing!")

# If credentials are missing then crash
if not url or not key:
    # Provide a very descriptive error so it's obvious which environment variable is missing
    missing = []
    if not key:
        missing.append("SUPABASE_SERVICE_ROLE_KEY")
    raise ValueError(
        f"Missing Supabase credentials. The following environment variable(s) are not set: "
        f"{', '.join(missing)}. Make sure to set them (for example in a .env file or your deployment environment) "
        f"and restart the application."
    )

supabase: Client = create_client(url, key)

@app.route('/api/hello', methods=['GET'])
def hello_world():
    return 'Hello, world!', 200

def get_user_from_token():
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise PermissionError("Missing Authorization header")

    token = auth_header.split(" ")[1]

    response = requests.get(
        f"https://vnnlrooakzcseeiqskxw.supabase.co/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": key
        }
    )

    if response.status_code != 200:
        raise PermissionError("Invalid session token")

    return response.json()

def is_admin(user_id: str) -> bool:
    try:
        # Checks if the user is an admin
        response = supabase.table('profiles').select("role").eq("id", user_id).single().execute()
        # If the request to Supabase returned an error, log it and treat as non-admin
        resp_error = getattr(response, "error", None) or (response.get("error") if isinstance(response, dict) else None)
        if resp_error:
            logger.error(f"Database error while checking admin status for user '{user_id}': {resp_error}")
            return False

        # If the user is an admin, return true, otherwise return false
        if response.data and response.data.get('role') == 'ADMIN':
            return True
        # Log explicit non-admin result for easier debugging
        logger.info(f"User '{user_id}' is not an admin according to profiles.role (value: "
                    f"{response.data.get('role') if response.data else 'no profile found'}).")
    except Exception as e:
        # Log exception with a descriptive message and return False (not admin)
        logger.exception(f"Failed to determine admin status for user '{user_id}'. Reason: {e}")
        return False
    return False

def delete_user_data(target_user_id: str):
    # Gets everything related to the user
    orders_response = None
    try:
        orders_response = supabase.table('Orders').select('order_id').eq('user_id', target_user_id).execute()
    except Exception as e:
        # If the query itself fails, raise a descriptive exception so caller knows what failed
        logger.exception(f"Failed to query Orders for user '{target_user_id}'. This prevented data cleanup. Reason: {e}")
        raise RuntimeError(
            f"Failed to query Orders for user '{target_user_id}' from the database. See server logs for details."
        )

    # Check if supabase returned an error object
    orders_error = getattr(orders_response, "error", None) or (orders_response.get("error") if isinstance(orders_response, dict) else None)
    if orders_error:
        logger.error(f"Supabase returned an error while fetching orders for user '{target_user_id}': {orders_error}")
        raise RuntimeError(
            f"Error fetching orders for user '{target_user_id}': {orders_error}"
        )

    # Deletes everything related to the user. Because of foreign key constraints, we have to delete from OrderItems first, then Orders, then profiles, and finally the user account itself
    
    if orders_response.data:
        order_ids = [o['order_id'] for o in orders_response.data if 'order_id' in o]
        
        if order_ids:
            try:
                # Delete order items that reference those orders first because of FK constraints
                delete_items_resp = supabase.table('OrderItems').delete().in_('order_id', order_ids).execute()
                delete_items_error = getattr(delete_items_resp, "error", None) or (delete_items_resp.get("error") if isinstance(delete_items_resp, dict) else None)
                if delete_items_error:
                    logger.error(f"Failed to delete OrderItems for order IDs {order_ids} for user '{target_user_id}': {delete_items_error}")
                    raise RuntimeError(f"Failed to delete OrderItems for user '{target_user_id}': {delete_items_error}")
            except Exception as e:
                logger.exception(f"Exception while deleting OrderItems for user '{target_user_id}' and orders {order_ids}: {e}")
                raise RuntimeError(f"Exception while deleting OrderItems for user '{target_user_id}'. See server logs.")

    # Delete Orders
    try:
        delete_orders_resp = supabase.table('Orders').delete().eq('user_id', target_user_id).execute()
        delete_orders_error = getattr(delete_orders_resp, "error", None) or (delete_orders_resp.get("error") if isinstance(delete_orders_resp, dict) else None)
        if delete_orders_error:
            logger.error(f"Failed to delete Orders for user '{target_user_id}': {delete_orders_error}")
            raise RuntimeError(f"Failed to delete Orders for user '{target_user_id}': {delete_orders_error}")
    except Exception as e:
        logger.exception(f"Exception while deleting Orders for user '{target_user_id}': {e}")
        raise RuntimeError(f"Exception while deleting Orders for user '{target_user_id}'. See server logs.")

    # Delete profiles row
    try:
        delete_profile_resp = supabase.table('profiles').delete().eq('id', target_user_id).execute()
        delete_profile_error = getattr(delete_profile_resp, "error", None) or (delete_profile_resp.get("error") if isinstance(delete_profile_resp, dict) else None)
        if delete_profile_error:
            logger.error(f"Failed to delete profile for user '{target_user_id}': {delete_profile_error}")
            raise RuntimeError(f"Failed to delete profile for user '{target_user_id}': {delete_profile_error}")
    except Exception as e:
        logger.exception(f"Exception while deleting profile for user '{target_user_id}': {e}")
        raise RuntimeError(f"Exception while deleting profile for user '{target_user_id}'. See server logs.")

    # Delete the user account itself from Supabase Auth (admin action)
    try:
        # This is a privileged operation; if it fails we surface a clear error
        supabase.auth.admin.delete_user(target_user_id)
    except Exception as e:
        # Do not expose internal stack traces to clients, but provide a clear message
        logger.exception(f"Failed to delete auth user '{target_user_id}' via Supabase admin API: {e}")
        raise RuntimeError(
            f"Failed to delete the Supabase auth user '{target_user_id}'. This is a critical cleanup step that failed. "
            f"Please check the Supabase service role key and the Supabase admin logs for more details."
        )

# API endpoint to ban or unban a user
@app.route('/api/admin/toggle-ban', methods=['POST'])
def toggle_ban():
    # Get the user from the JWT token
    user = get_user_from_token()
    
    # If the user is not an admin, return 403 Forbidden 
    if not user or not is_admin(user["id"]):
        # Be explicit about why access was denied
        message = (
            "Forbidden: You must be authenticated as an admin to perform this action. "
            "Ensure your Authorization header contains a valid Bearer token of an admin account."
        )
        logger.warning(f"Admin toggle-ban attempt denied. Reason: {message}")
        return jsonify({"error": message}), 403

    # Read the request body
    data = request.json
    if data is None:
        msg = "Bad Request: Missing JSON body. Expected a JSON payload with keys 'userId' and 'isBanned'."
        logger.warning(msg)
        return jsonify({"error": msg}), 400

    target_user_id = data.get('userId')
    should_ban = data.get('isBanned')

    # Validate inputs and return descriptive errors if something is wrong
    if not target_user_id:
        msg = "Bad Request: 'userId' is required in the request body and must be a non-empty string."
        logger.warning(msg)
        return jsonify({"error": msg}), 400
    if should_ban is None:
        msg = "Bad Request: 'isBanned' is required in the request body and must be a boolean indicating whether to ban (true) or unban (false)."
        logger.warning(msg)
        return jsonify({"error": msg}), 400
    if not isinstance(should_ban, bool):
        msg = "Bad Request: 'isBanned' must be a boolean (true or false)."
        logger.warning(msg)
        return jsonify({"error": msg}), 400

    try:
        # If should_ban is true, a 100 year ban is applied, else the ban is removed
        if should_ban:
            # Use a long ban duration string; this depends on Supabase accepting the format
            try:
                supabase.auth.admin.update_user_by_id(target_user_id, {"ban_duration": "876600h"})
            except Exception as e:
                logger.exception(f"Failed to apply ban_duration to user '{target_user_id}': {e}")
                raise RuntimeError(
                    f"Failed to apply ban to user '{target_user_id}'. The Supabase admin API returned an error. "
                    f"See server logs for details."
                )
        else:
            try:
                supabase.auth.admin.update_user_by_id(target_user_id, {"ban_duration": "none"})
            except Exception as e:
                logger.exception(f"Failed to remove ban_duration for user '{target_user_id}': {e}")
                raise RuntimeError(
                    f"Failed to remove ban for user '{target_user_id}'. The Supabase admin API returned an error. "
                    f"See server logs for details."
                )

        # Update the is_banned column in the profiles table
        update_resp = supabase.table('profiles').update({"is_banned": should_ban}).eq("id", target_user_id).execute()
        update_error = getattr(update_resp, "error", None) or (update_resp.get("error") if isinstance(update_resp, dict) else None)
        if update_error:
            logger.error(f"Failed to update profiles.is_banned for user '{target_user_id}': {update_error}")
            raise RuntimeError(f"Failed to update user profile's is_banned flag: {update_error}")

        return jsonify({"message": "User ban status updated"}), 200
    except Exception as e:
        # Print the error on the server and return a safe, descriptive message to the client
        logger.exception(f"BAN ERROR for target_user_id='{target_user_id}': {e}")
        return jsonify({
            "error": "Internal Server Error while updating ban status. "
                     "The server encountered an unexpected problem performing the ban operation. "
                     "Check server logs for more details."
        }), 500

# API endpoint to delete users
@app.route('/api/admin/delete-user', methods=['DELETE'])
def admin_delete_user():
    user = get_user_from_token()
    if not user or not is_admin(user["id"]):
        # Explain why the operation is forbidden
        message = (
            "Forbidden: You must be authenticated as an admin to delete users. "
            "Ensure your Authorization header contains a valid Bearer token from an admin account."
        )
        logger.warning(f"Admin delete-user attempt denied. Reason: {message}")
        return jsonify({"error": message}), 403

    data = request.json
    if data is None:
        msg = "Bad Request: Missing JSON body. Expected a JSON payload with key 'userId'."
        logger.warning(msg)
        return jsonify({"error": msg}), 400

    target_user_id = data.get('userId')
    if not target_user_id:
        msg = "Bad Request: 'userId' is required in the request body and must be a non-empty string."
        logger.warning(msg)
        return jsonify({"error": msg}), 400

    # Deletes the user using the delete_user_data helper function, throws an error if it fails
    try:
        delete_user_data(target_user_id)
        return jsonify({"message": "User and all related data deleted"}), 200
    except Exception as e:
        # Do not expose internal exception details to clients, but return a clear description
        logger.exception(f"Error deleting user '{target_user_id}': {e}")
        return jsonify({
            "error": "Failed to delete user and related data. This may be due to database constraints, network issues, "
                     "or insufficient permissions for the Supabase service role key. See server logs for details."
        }), 500

# API endpoint for users to delete themselves
@app.route('/api/user/delete-account', methods=['DELETE'])
def delete_self():
    user = get_user_from_token()
    if not user or not user["id"]:
        # More explicit unauthorized message
        msg = "Unauthorized: No valid authentication token provided, or token is expired/invalid."
        logger.warning(f"Delete-self attempt denied. Reason: {msg}")
        return jsonify({"error": msg}), 401

    try:
        delete_user_data(user["id"])
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        logger.exception(f"Error deleting account for user '{user.id}': {e}")
        return jsonify({
            "error": "Failed to delete account. The server encountered an error while removing your data. "
                     "If this persists, contact support with your account id. See server logs for details."
        }), 500

# If this file is ran directly it will start the Flask dev server on port 5000 with debug mode on
if __name__ == '__main__':
    # Run in debug mode only in development. This will print detailed stack traces to console.
    app.run(port=5000, debug=True)