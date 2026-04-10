# Flask API Endpoints

## Diagram

```mermaid
flowchart TD
    subgraph "Flask API Endpoints"
        direction TB

        Hello["<b>GET /api/hello</b><br/>Description: Simple test / health-check endpoint<br/>Authentication: None (public)<br/>Request: No body, no query params<br/>Success Response: 200 - 'Hello, world!'<br/>Errors: None"]
        
        ToggleBan["<b>POST /api/admin/toggle-ban</b><br/>escription: Ban or unban any user (sets 100-year ban or removes it)<br/>Authentication: Required - Bearer token of an ADMIN user<br/>Request Body (JSON):<br/>{<br/>  'userId': string,<br/>  'isBanned': boolean<br/>}<br/>Success: 200 { 'message': 'User ban status updated' }<br/>Errors:<br/>• 400 - Missing/invalid JSON or fields<br/>• 403 - Not an admin<br/>• 500 - Supabase error (logged)"]
        
        AdminDelete["<b>DELETE /api/admin/delete-user</b><br/>Description: Permanently delete user + ALL related data (admin only)<br/>Authentication: Required - Bearer token of an ADMIN user<br/>Request Body (JSON): { 'userId': string }<br/> Success: 200 { 'message': 'User and all related data deleted' }<br/>Errors:<br/>• 400 - Missing userId<br/>• 403 - Not an admin<br/>• 500 - Cleanup failure (see logs)"]
        
        SelfDelete["<b>DELETE /api/user/delete-account</b><br/>Description: Authenticated user deletes their own account + ALL data<br/>Authentication: Required - Valid Bearer token<br/>Request Body: None<br/>Success: 200 { 'message': 'Account deleted successfully' }<br/>Errors:<br/>• 401 - Invalid/expired token<br/>• 500 - Cleanup failure (see logs)"]
    end

    subgraph "Shared Internal Logic (not exposed)"
        direction TB
        AuthCheck["get_user_from_token()<br/>• Reads Authorization: Bearer &lt;token&gt;<br/>• Calls Supabase /auth/v1/user<br/>• Raises PermissionError on failure"]
        IsAdmin["is_admin(user_id)<br/>• Queries profiles table<br/>• Returns true ONLY if role == 'ADMIN'<br/>• Logs detailed failures"]
        Cleanup["delete_user_data(user_id)<br/>1. Cancel all PENDING orders via RPC 'cancel_pending_order'<br/>2. Delete OrderItems (by order_id)<br/>3. Delete Orders (by user_id)<br/>4. Delete profiles row<br/>5. Delete Supabase Auth user (admin API)<br/>• All steps are atomic with detailed error logging"]
    end

    %% Connections showing flow
    Hello -->|"Public - no auth"| AuthCheck
    ToggleBan --> AuthCheck
    ToggleBan --> IsAdmin
    AdminDelete --> AuthCheck
    AdminDelete --> IsAdmin
    AdminDelete --> Cleanup
    SelfDelete --> AuthCheck
    SelfDelete --> Cleanup

    classDef endpoint fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000;
    classDef internal fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000;
    class Hello,ToggleBan,AdminDelete,SelfDelete endpoint;
    class AuthCheck,IsAdmin,Cleanup internal;
```

## Table


| Method | Path                     | Auth Required          | Request Body                        | Common Errors | Notes |
| :---   | :---                     | :---                   | :---                                | :---          | :---     |
| GET    | /api/hello               | None                   | -                                   | -             | Test endpoint    |
| POST   | /api/admin/toggle-ban    | Admin Bearer token     | {"userId": "...", "isBanned": true} | 400, 403, 500 | Updates both Supabase Auth ban + profiles.is_banned     |
| DELETE | /api/admin/delete-user   | Admin Bearer token     | {"userId": "..."}                   | 400, 403, 500 | Full cascade delete (orders, items, profile, auth)    |
| DELETE | /api/user/delete-account | Any valid Bearer token | -                                   | 401, 500      | Same cleanup as admin delete (self-service)     |