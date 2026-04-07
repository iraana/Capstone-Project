# Database 

![alt text](image.png)

## Database SQL




<details>
<summary><b>Database SQL</b></summary>

```

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Dishes (
  dish_id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  category USER-DEFINED NOT NULL,
  price numeric NOT NULL,
  dish_status boolean NOT NULL DEFAULT true,
  CONSTRAINT Dishes_pkey PRIMARY KEY (dish_id)
);
CREATE TABLE public.Gallery (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  caption text NOT NULL,
  image_url text NOT NULL,
  CONSTRAINT Gallery_pkey PRIMARY KEY (id)
);
CREATE TABLE public.MenuDayDishes (
  menu_day_dish_id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  dish_id smallint NOT NULL,
  menu_id smallint NOT NULL,
  stock smallint,
  CONSTRAINT MenuDayDishes_pkey PRIMARY KEY (menu_day_dish_id),
  CONSTRAINT MenuDayDishes_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.Dishes(dish_id),
  CONSTRAINT MenuDayDishes_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.MenuDays(menu_day_id)
);
CREATE TABLE public.MenuDays (
  menu_day_id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  date date NOT NULL DEFAULT now() UNIQUE,
  day USER-DEFINED NOT NULL,
  status boolean NOT NULL DEFAULT true,
  CONSTRAINT MenuDays_pkey PRIMARY KEY (menu_day_id)
);
CREATE TABLE public.OrderItems (
  order_item_id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id smallint NOT NULL,
  dish_id smallint NOT NULL,
  quantity smallint NOT NULL,
  subtotal numeric NOT NULL,
  CONSTRAINT OrderItems_pkey PRIMARY KEY (order_item_id),
  CONSTRAINT OrderItems_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.Orders(order_id),
  CONSTRAINT OrderItems_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.Dishes(dish_id)
);
CREATE TABLE public.Orders (
  order_id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  menu_id smallint NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::order_status,
  notes text,
  total numeric NOT NULL,
  order_number integer NOT NULL UNIQUE,
  is_showing boolean NOT NULL DEFAULT true,
  CONSTRAINT Orders_pkey PRIMARY KEY (order_id),
  CONSTRAINT Orders_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.MenuDays(menu_day_id),
  CONSTRAINT Orders_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.Reviews (
  review_id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  dish_id smallint NOT NULL,
  rating smallint NOT NULL,
  comment text,
  timestamp timestamp without time zone NOT NULL,
  CONSTRAINT Reviews_pkey PRIMARY KEY (review_id),
  CONSTRAINT Reviews_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.Dishes(dish_id),
  CONSTRAINT Reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text DEFAULT ''::text,
  email text DEFAULT ''::text,
  is_read boolean DEFAULT false,
  message text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  first_name text,
  last_name text NOT NULL,
  email text NOT NULL,
  role USER-DEFINED NOT NULL,
  is_banned boolean NOT NULL DEFAULT false,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
```

</details>

## Table Descriptions

<details>
<summary><b>Dishes</b></summary>

## Dishes

Purpose: Stores all currently and previously available food items.

Fields:

- dish_id
- name
- category
- price
- dish_status

Relationships:

  - Referenced in:

    - MenuDayDishes
    - OrderItems
    - Reviews

</details>

<details>
<summary><b>Gallery</b></summary>

## Gallery

Purpose: Stores image files for the Gallery.

Fields:

- id
- created_at
- caption
- image_url

</details>

<details>
<summary><b>MenuDayDishes</b></summary>

## MenuDayDishes

Purpose: Join table linking dishes to specific menus.

Fields:

- menu_day_dish_id
- dish_id → FK → Dishes
- menu_id → FK → MenuDays
- stock

Relatonships:

  - References:
    - Dishes
    - MenuDays

</details>

<details>
<summary><b>MenuDays</b></summary>

## MenuDays

Purpose: Stores the date of each created menu.

Fields:

- menu_day_id
- date
- day
- status

Relationships:

  - Referenced in:

    - MenuDayDishes
    - Orders

</details>

<details>
<summary><b>OrderItems</b></summary>

## OrderItems

Purpose: Stores dishes that are associated with an order.

Fields:

- order_item_id
- order_id → FK → Orders
- dish_id → FK → Dishes
- quantity
- subtotal

Relatonships: 

  - References:
    
    - Dishes
    - Orders

</details>

<details>
<summary><b>Orders</b></summary>

## Orders

Purpose: Represents an order.

Fields:

- order_id 
- user_id → FK → profiles
- menu_id → FK → MenuDays
- timestamp 
- status 
- total 
- order_number 
- notes 
- is_showing 

Relatonships:

  - References:

    - profiles
    - MenuDays

</details>

<details>
<summary><b>profiles</b></summary>

## profiles

Purpose: Stores user data for authentication

Fields:

- id
- first_name
- last_name
- email
- role
- is_banned

</details>

<details>
<summary><b>Reviews</b></summary>

## Reviews

Purpose: Stores user reviews made for specific dishes.

Fields:

- review_id
- user_id → FK → profiles
- dish_id → FK → Dishes
- rating
- comment 
- timestamp 

Relationships:

  - References:
  
    - profiles
    - Dishes

</details>

<details>
<summary><b>contact_messages</b></summary>

## contact_messages

Purpose: Stores messages submitted through the contact form.

Fields:

- id
- name
- email
- is_read
- message
- created_at

</details>

## RLS Policies

<details>
<summary><b>Dishes</b></summary>

<details>
<summary>Admins can delete all contact messages</summary>

```
alter policy "Admins can delete all contact messages"
on "public"."contact_messages"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Admins can read all contact messages </summary>

```
alter policy "Admins can read all contact messages"
on "public"."contact_messages"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Admins can update all contact messages </summary>

```
alter policy "Admins can update all contact messages"
on "public"."contact_messages"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Anyone can leave a contact message </summary>

```
alter policy "Anyone can leave a contact message"
on "public"."contact_messages"
to public
with check (
  true
);
```
</details>

</details>

<details>
<summary><b>Gallery</b></summary>

<details>
<summary>Admins can create gallery posts </summary>

```
alter policy "Admins can create gallery posts"
on "public"."Gallery"
to authenticated
with check (
  is_admin()
);
```
</details>

<details>
<summary>Admins can delete gallery posts </summary>

```
alter policy "Admins can delete gallery posts"
on "public"."Gallery"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Admins can update gallery posts </summary>

```
alter policy "Admins can update gallery posts"
on "public"."Gallery"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Anyone can read gallery posts </summary>

```
alter policy "Anyone can read gallery posts"
on "public"."Gallery"
to public
using (
  true
);
```
</details>

</details>

<details>
<summary><b>MenuDayDishes</b></summary>

<details>
<summary>Admins can create menu day dishes </summary>

```
alter policy "Admins can create menu day dishes"
on "public"."MenuDayDishes"
to authenticated
with check (
  is_admin()
);
```

</details>

<details>
<summary>Admins can delete menu day dishes </summary>

```
alter policy "Admins can delete menu day dishes"
on "public"."MenuDayDishes"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Admins can update menu day dishes </summary>

```
alter policy "Admins can update menu day dishes"
on "public"."MenuDayDishes"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Anyone can read menu day dishes </summary>

```
alter policy "Anyone can read menu day dishes"
on "public"."MenuDayDishes"
to public
using (
  true
);
```
</details>

</details>

<details>
<summary><b>MenuDays</b></summary>

<details>
<summary>Admins can create menu days </summary>

```
alter policy "Admins can create menu days"
on "public"."MenuDays"
to authenticated
with check (
  is_admin()
);
```

</details>

<details>
<summary>Admins can delete menu days </summary>

```
alter policy "Admins can delete menu days"
on "public"."MenuDays"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Admins can update menu days </summary>

```
alter policy "Admins can update menu days"
on "public"."MenuDays"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Anyone can read menu days </summary>

```
alter policy "Anyone can read menu days"
on "public"."MenuDays"
to public
using (
  true
);
```

</details>

</details>

<details>
<summary><b>OrderItems</b></summary>

<details>
<summary>Admins can delete all order items </summary>

```
alter policy "Admins can delete all order items"
on "public"."OrderItems"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Admins can read all order items </summary>

```
alter policy "Admins can read all order items"
on "public"."OrderItems"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Users can read their own order items </summary>

```
alter policy "Users can read their own order items"
on "public"."OrderItems"
to authenticated
using (
  (EXISTS ( SELECT 1
   FROM "Orders"
  WHERE (("Orders".order_id = "OrderItems".order_id) AND ("Orders".user_id = auth.uid()))))
);
```

</details>

</details>

<details>
<summary><b>Orders</b></summary>

<details>
<summary>Admins can delete all orders </summary>

```
alter policy "Admins can delete all orders"
on "public"."Orders"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Admins can read all orders </summary>

```
alter policy "Admins can read all orders"
on "public"."Orders"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Admins can update all orders </summary>

```
alter policy "Admins can update all orders"
on "public"."Orders"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Users can read their own orders </summary>

```
alter policy "Users can read their own orders"
on "public"."Orders"
to authenticated
using (
  (user_id = auth.uid())
);
```

</details>

<details>
<summary>Users can soft delete their own order </summary>

```
alter policy "Users can soft delete their own order"
on "public"."Orders"
to authenticated
using (
  (user_id = auth.uid())
);
```

</details>

</details>

<details>
<summary><b>profiles</b></summary>

<details>
<summary>Admins can delete all profiles </summary>

```
alter policy "Admins can delete all profiles"
on "public"."profiles"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Admins can read all profiles </summary>

```
alter policy "Admins can read all profiles"
on "public"."profiles"
to authenticated
using (
  is_admin()
);
```
</details>


<details>
<summary>Admins can update all profiles </summary>

```
alter policy "Admins can update all profiles"
on "public"."profiles"
to authenticated
using (

  is_admin()
);
```

</details>

<details>
<summary>Users can delete themselves </summary>

```
alter policy "Users can delete themselves"
on "public"."profiles"
to authenticated
using (
  (id = auth.uid())
);
```
</details>


<details>
<summary>Users can read their own profile </summary>

```
alter policy "Users can read their own profile"
on "public"."profiles"
to authenticated
using (
  (id = auth.uid())
);
```
</details>


<details>
<summary>Users can update their own profile </summary>

```
alter policy "Users can update their own profile"
on "public"."profiles"
to authenticated
using (
  (id = auth.uid())
);
```

</details>


</details>

<details>
<summary><b>Reviews</b></summary>

<details>
<summary>Admins can delete all reviews </summary>

```
alter policy "Admins can delete all reviews"
on "public"."Reviews"
to authenticated
using (
  is_admin()
);
```

</details>

<details>
<summary>Admins can view all reviews </summary>

```
alter policy "Admins can view all reviews"
on "public"."Reviews"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Users can leave reviews </summary>

```
alter policy "Users can leave reviews"
on "public"."Reviews"
to authenticated
with check (
  (user_id = auth.uid())
);
```
</details>

<details>
<summary>Users can view their own reviews </summary>

```
alter policy "Users can view their own reviews"
on "public"."Reviews"
to authenticated
using (
  (auth.uid() = user_id)
);
```
</details>


</details>

<details>
<summary><b>contact_messages</b></summary>

<details>
<summary>Admins can delete all contact messages </summary>

```
alter policy "Admins can delete all contact messages"
on "public"."contact_messages"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Admins can read all contact messages </summary>

```
alter policy "Admins can read all contact messages"
on "public"."contact_messages"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Admins can update all contact messages </summary>

```
alter policy "Admins can update all contact messages"
on "public"."contact_messages"
to authenticated
using (
  is_admin()
);
```
</details>

<details>
<summary>Anyone can leave a contact message </summary>

```
alter policy "Anyone can leave a contact message"
on "public"."contact_messages"
to public
with check (
  true
);
```
</details>

</details>