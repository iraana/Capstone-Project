# System Flows

## Checkout Process Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Checkout.tsx
    participant Store as Zustand (cartStore)
    participant DB as Supabase DB (RPC)
    participant Auth as Supabase Auth

    User->>UI: Clicks "Confirm Order"
    UI->>Store: Get cart items & total
    UI->>Auth: Check if user is logged in
    
    alt Cart empty or Not logged in
        UI-->>User: Abort / Do nothing
    else Valid Cart & Session
        UI->>DB: SELECT from Orders (Check existing order for menu)
        alt Order Exists
            DB-->>UI: Returns existing order_id
            UI-->>User: Show Error: "Already placed an order for this menu"
        else No Existing Order
            UI->>DB: Call RPC place_order(menu_id, items, notes)
            
            Note right of DB: BEGIN TRANSACTION
            DB->>DB: Verify menu date/time (Cutoff check)
            DB->>DB: Verify no active order (Race condition check)
            
            loop For each item
                DB->>DB: Lock row (FOR UPDATE)
                DB->>DB: Check stock >= requested quantity
            end
            
            alt Insufficient Stock / Cutoff Passed
                Note right of DB: ROLLBACK
                DB-->>UI: Throw Exception
                UI-->>User: Show Error Alert
            else Valid
                DB->>DB: Generate random order_number (8 digits)
                DB->>DB: INSERT into Orders (Status: PENDING)
                
                loop For each item
                    DB->>DB: Deduct stock in MenuDayDishes
                    DB->>DB: INSERT into OrderItems
                end
                
                Note right of DB: COMMIT
                DB-->>UI: Return new order_id
                UI->>Store: clearCart()
                UI->>User: Redirect to /successful-order
            end
        end
    end
```

## Admin Fulfill Order Process Flow

```mermaid
graph TD
    classDef ui fill:#00659B,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px;
    classDef db fill:#3ECF8E,stroke:#fff,stroke-width:2px,color:#111,rx:8px,ry:8px;
    classDef action fill:#f59e0b,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px;

    Start((Admin Logs In)) --> Choice{How to find order?}
    
    Choice -->|List View| Pending[PendingOrders.tsx]:::ui
    Choice -->|Scan QR| Scanner[AdminScanner.tsx]:::ui
    
    Scanner -->|Detects /admin/order/12345678| Beep[Play Beep Sound]
    Beep --> Details[OrderDetails.tsx]:::ui
    Pending -->|Admin clicks order| Details
    
    Details --> Review[Admin reviews items & notes]
    Review --> ClickComplete[Admin clicks 'Complete']:::action
    
    ClickComplete --> Mutate[React Query useMutation]
    Mutate --> Supabase[(Supabase DB: Orders Table)]:::db
    
    Supabase --> Trigger{protect_order_columns Trigger}
    Trigger -->|Check is_admin| Validate[Is User Admin?]
    Validate -->|No| Revert[Revert update silently]:::db
    Validate -->|Yes| Update[Update status to FULFILLED]:::db
    
    Update --> Success[Mutation onSuccess]
    Success --> Invalidate[Invalidate 'single_order' & 'pending_orders' Cache]
    Invalidate --> Refresh[UI automatically updates]:::ui
```

## Menu Creation Process Flow

```mermaid
graph TD
    classDef step fill:#00659B,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px;
    classDef db fill:#3ECF8E,stroke:#fff,stroke-width:2px,color:#111,rx:8px,ry:8px;

    A[Admin opens AddMenu.tsx]:::step --> B[Select Date]:::step
    B --> C[App fetches all active Dishes]:::db
    
    C --> D[Admin searches/paginates available dishes]:::step
    D --> E[Click 'Add to Menu']:::step
    E --> F[Set Stock Quantity]:::step
    F --> G{More dishes?}
    G -->|Yes| D
    G -->|No| H[Click 'Save Menu']:::step
    
    H --> I[Zod validates Date, Dishes array, & Stock limits]
    I -->|Valid| J[INSERT into MenuDays <br> date, day]:::db
    
    J --> K[Return menu_day_id]:::db
    K --> L[Map selected dishes to payload array]
    
    L --> M[INSERT array into MenuDayDishes <br> menu_id, dish_id, stock]:::db
    M --> N[Show Success Message & Reset Form]:::step
```

## Flask JWT Token Data Flow

```mermaid
sequenceDiagram
    autonumber
    participant React as React Frontend
    participant Flask as Flask API (Vercel)
    participant Auth as Supabase Auth Server
    participant DB as Supabase PostgreSQL

    React->>Flask: DELETE /api/admin/delete-user <br/> Header: { Authorization: Bearer <JWT> } <br/> Body: { userId: target_id }
    
    Flask->>Auth: GET /auth/v1/user <br/> Header: { Authorization: Bearer <JWT>, apikey: ServiceKey }
    
    alt Invalid Token
        Auth-->>Flask: 401 Unauthorized
        Flask-->>React: 401 "Invalid session token"
    else Valid Token
        Auth-->>Flask: Returns User Object (Caller's ID)
        
        Flask->>DB: SELECT role FROM profiles WHERE id = Caller's ID
        DB-->>Flask: Returns { role: 'ADMIN' }
        
        alt Caller is NOT Admin
            Flask-->>React: 403 "Forbidden"
        else Caller IS Admin
            Flask->>DB: Call helper delete_user_data(target_id)
            Note over Flask,DB: Cascade Deletion Begins
            Flask->>DB: Delete pending orders (restores stock)
            Flask->>DB: DELETE FROM OrderItems WHERE order_id IN (...)
            Flask->>DB: DELETE FROM Orders WHERE user_id = target_id
            Flask->>DB: DELETE FROM profiles WHERE id = target_id
            
            Flask->>Auth: admin.delete_user(target_id)
            Auth-->>Flask: Success
            
            Flask-->>React: 200 OK "User and data deleted"
        end
    end
```

## Cart State Manager Data Flow

```mermaid 
graph TD
    classDef store fill:#f43f5e,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px;
    classDef check fill:#eab308,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px;
    classDef action fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px;

    Start((addItem called)) --> A{totalItems >= 5?}:::check
    
    A -->|Yes| Abort[Return: Max total items reached]:::store
    A -->|No| B{Item already in cart?}:::check
    
    B -->|No| C[Add new item to array <br> quantity: 1]:::action
    B -->|Yes| D[Calculate effectiveMax <br> MIN of 5 and maxStock]:::check
    
    D --> E{Current item qty <br> < effectiveMax?}:::check
    
    E -->|No| F[Return: Max quantity reached]:::store
    E -->|Yes| G[Increment item quantity by 1]:::action
    
    C --> H
    G --> H[Update Zustand State]:::store
    H --> I[Zustand Persist Middleware saves to localStorage]:::store
    I --> J[React Components Re-render]
```

## Add to Gallery Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant React as AddToGallery.tsx
    participant WASM as Rust WebAssembly (process_image)
    participant Storage as Supabase Storage
    participant DB as Supabase DB (Gallery Table)

    Admin->>React: Selects Image File (JPEG/PNG)
    Note over React: Checks if WASM is initialized
    React->>React: Converts File to ArrayBuffer (Uint8Array)
    
    React->>WASM: Pass raw byte array to process_image()
    Note right of WASM: Rust image processing begins
    WASM->>WASM: load_from_memory()
    WASM->>WASM: resize_to_fill(1280, 960, Lanczos3)
    WASM->>WASM: Encode to WebP format
    WASM-->>React: Returns optimized WebP byte array
    
    React->>React: Creates new File Object (image/webp)
    React-->>Admin: Displays image preview & file size
    
    Admin->>React: Enters Caption & Clicks "Create Post"
    
    React->>Storage: upload(filePath, WebP File)
    Storage-->>React: Success
    
    React->>Storage: getPublicUrl(filePath)
    Storage-->>React: Returns public URL
    
    React->>DB: INSERT INTO Gallery (caption, image_url, date)
    DB-->>React: Success
    
    React->>React: Invalidate React Query Cache & Reset Form
    React-->>Admin: Show Success Message
```