from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# If credentials are missing then crash
if not url or not key:
    raise ValueError("Missing Supabase credentials")

supabase: Client = create_client(url, key)

def get_user_from_token():
    # Gets the JWT token from the Authorization header 
    auth_header = request.headers.get('Authorization')
    # If there is no token, return None
    if not auth_header:
        return None
    
    try:
        # Removes the Bearer prefix to just get the token
        # Because the header will look like Bearer eyJjdsfnksdnf...
        token = auth_header.split(" ")[1]

        # Asks Supabase who this token belongs to 
        user_response = supabase.auth.get_user(token)

        # If invalid it returns None, otherwise it returns the user object
        if not user_response or not user_response.user:
            return None
        return user_response.user
    except Exception:
        return None

def is_admin(user_id):
    try:
        # Checks if the user is an admin
        response = supabase.table('profiles').select("role").eq("id", user_id).single().execute()
        # If the user is an admin, return true, otherwise return false
        if response.data and response.data.get('role') == 'ADMIN':
            return True
    except:
        return False
    return False

def delete_user_data(target_user_id):
    # Gets everything related to the user
    orders_response = supabase.table('Orders').select('order_id').eq('user_id', target_user_id).execute()

    # Deletes everything related to the user. Because of foreign key constraints, we have to delete from OrderItems first, then Orders, then profiles, and finally the user account itself
    
    if orders_response.data:
        order_ids = [o['order_id'] for o in orders_response.data]
        
        if order_ids:
            supabase.table('OrderItems').delete().in_('order_id', order_ids).execute()
            
    supabase.table('Orders').delete().eq('user_id', target_user_id).execute()

    supabase.table('profiles').delete().eq('id', target_user_id).execute()

    supabase.auth.admin.delete_user(target_user_id)

# API endpoint to ban or unban a user
@app.route('/api/admin/toggle-ban', methods=['POST'])
def toggle_ban():
    # Get the user from the JWT token
    user = get_user_from_token()
    # If the user is not an admin, return 403 Forbidden 
    if not user or not is_admin(user.id):
        return jsonify({"error": "Forbidden"}), 403

    # Read the request body
    data = request.json
    target_user_id = data.get('userId')
    should_ban = data.get('isBanned')

    try:
        # If should_ban is true, a 100 year ban is applied, else the ban is removed
        if should_ban:
            supabase.auth.admin.update_user_by_id(target_user_id, {"ban_duration": "876600h"})
        else:
            supabase.auth.admin.update_user_by_id(target_user_id, {"ban_duration": "none"})

        # Update the is_banned column in the profiles table
        supabase.table('profiles').update({"is_banned": should_ban}).eq("id", target_user_id).execute()
        return jsonify({"message": "User ban status updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to delete users
@app.route('/api/admin/delete-user', methods=['DELETE'])
def admin_delete_user():
    user = get_user_from_token()
    if not user or not is_admin(user.id):
        return jsonify({"error": "Forbidden"}), 403

    data = request.json
    target_user_id = data.get('userId')

    # Deletes the user using the delete_user_data helper function, throws an error if it fails
    try:
        delete_user_data(target_user_id)
        return jsonify({"message": "User and all related data deleted"}), 200
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({"error": str(e)}), 500

# API endpoint for users to delete themselves
@app.route('/api/user/delete-account', methods=['DELETE'])
def delete_self():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        delete_user_data(user.id)
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting account: {e}")
        return jsonify({"error": str(e)}), 500

# If this file is ran directly it will start the Flask dev server on port 5000 with debug mode on
if __name__ == '__main__':
    app.run(port=5000, debug=True)