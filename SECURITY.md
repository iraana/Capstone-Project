# Security

This document explains how the app is safe but also how to report security vulnerabilities if you find one.

## RLS Policies 

RLS policies are a database feature that restricts data access at the row level based on user roles. This stops a
malicious user from taking the anon key and doing CRUD operations at will. Our RLS policies follow the principle of least
privilege. If you want to see the raw SQL for each RLS policy <a href="https://github.com/iraana/Capstone-Project/blob/main/docs/DATABASE_SCHEMA.md">click here</a>.
Below is the reasoning behind the RLS policies for each table.

### Table: Dishes

- Admins can create dishes
- Admins can update dishes
- Anyone can read dishes

Only Admins can make dishes, and they can change them and soft delete them. No one can hard delete dishes. All users,
including unauthenticated users can see dishes. This is because we want the current menus available publicly. Having the
menus public gives people a chance to see if they like the menu items before signing up/signing in.

### Table: Gallery

- Admins can create gallery posts
- Admins can delete gallery posts
- Admins can update gallery posts
- Anyone can read gallery posts

Admins have full CRUD control over gallery posts and the posts can be seen publicly. This is because the gallery section
is designed to be an embedded social media page for **Gourmet2Go** (like Pinterest, Instagram, etc.)

### Table: MenuDayDishes

- Admins can create menu day dishes
- Admins can delete menu day dishes
- Admins can update menu day dishes
- Anyone can read menu day dishes

Admins have full CRUD control over the dishes for each menu day, and they can be viewed publicly.

### Table: MenuDays

- Admins can create menu days
- Admins can delete menu days
- Admins can update menu days
- Anyone can read menu days

Admins have full CRUD control over menus, and they can be viewed publicly.

### Table: OrderItems

- Admins can delete all order items
- Admins can read all order items
- Users can read their own order items

Admins can read all user order items, and they can delete them, but they cannot update them.

### Table: Orders

- Admins can delete all orders
- Admins can read all orders
- Admins can update all orders
- Users can read their own orders
- Users can soft delete their own order

Admins have full CRUD control over all orders. Users can see and soft delete their own order. Users cannot insert into
this table as the checkout is handled with an RPC (`place_order`).

### Table: Reviews

- Admins can delete all reviews
- Admins can view all reviews
- Users can leave reviews
- Users can view their own reviews

Admins have the ability to read all reviews and delete them as well. They cannot update them because we feel that
violates the integrity of a review. Deletion exists for reviews that are overly offensive or if the admins simply want
to remove them (for decluttering or maybe to save space in the database). All reviews can be downloaded as a CSV file
anyway. Then, Users can place a review, of course. They cannot delete them or edit them because that also violates
review integrity. If you can place a review and change it or take it back it kind of defeats the point. Users can also
read their own review but nothing for this exists in the UI.

### Table: contact_messages

- Admins can delete all contact messages
- Admins can read all contact messages
- Admins can update all contact messages
- Anyone can leave a contact message

Admins can read and delete all contact messages. They can also update to change `is_read` to true or false. It is also
public to leave a contact message. This is nice if someone has a question before signing up. However, if this API
endpoint gets abused, we'll have to remove it or make it only for authenticated users.

### Table: profiles

- Admins can delete all profiles
- Admins can read all profiles
- Admins can update all profiles
- Users can delete themselves
- Users can read their own profile
- Users can update their own profile

Admins have full CRUD control over all profiles. Users have full CRUD control over their own profile.

## Zod Schemas

Zod is used a client-side validator to ensure the data matches the schema. Zod is TypeScript first and infers a type
directly from the schema. It is often paired with React Hook Form in this project. Here is every Zod schema:

### profileSchema (MyAccountTab.tsx)

```ts
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});
```

### resetPasswordSchema (ResetPassword.tsx)

```ts
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
```

### signInSchema (SignIn.tsx)

```ts
const signInSchema = z.object({
  email: z
    .email("Invalid email address")
    .refine((email) => /^[0-9]{8}@saultcollege\.ca$/i.test(email), {
      message: "You must use your 8-digit Sault College email to sign in",
    }),
  password: z.string().min(1, "Password is required"),
});
```

### signUpSchema (SignUp.tsx)

```ts
const signUpSchema = z
  .object({
    email: z
    .email("Invalid email address")
    .refine((email) => /^[0-9]{8}@saultcollege\.ca$/i.test(email), {
      message: "You must use your 8-digit Sault College email to sign up",
    }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

    confirm_password: z.string(),

    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),

    accept_terms: z.literal(true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});
```

### contactSchema (Contact.tsx)

```ts
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Your message can be a maximum of 500 characters"),
});
```

### reviewSchema (Review.tsx)

```ts
const reviewSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
    comment: z.string().max(500, "Comment cannot exceed 500 characters").optional(),
});
```

### dishSchema (AddDish.tsx)

```ts
const dishSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .number("Price must be a number")
    .positive("Price must be positive")
    .refine((val) => Number((val * 100).toFixed(0)) === val * 100, "Max 2 decimal places"),
  category: z.enum(['Other', 'Soups', 'Salads', 'Sandwiches', 'Entrees', 'Desserts', 'Bowls']),
});
```

### menuSchema (AddMenu.tsx)

```ts
const menuSchema = z.object({
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date'
  ),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  dishes: z
    .array(
      z.object({
        dish_id: z.number().min(1, 'Dish is required'),
        stock: z.number().min(1, 'Stock is required'),
      })
    )
    .min(1, 'Please add at least one dish')
    .refine(
      (dishes) => new Set(dishes.map((d) => d.dish_id)).size === dishes.length,
      'Each dish can only be added once'
    ),
});
```

## XSS Mitigation

XSS (Cross-Site Scripting) occurs when an attacker injects malicious JavaScript into your application which executes in
another user's browser. React mitigates most XSS attacks out of the box. User generated content like order notes are
converted to text nodes by React instead of parsing them as HTML. If an attacker writes: 

```html
 <script>
   alert("you've been hacked");
 </script>
``` 

React renders that exact literal string and **does not** execute the script. Additionally, `dangerouslySetInnerHTML` is 
never used, ensuring no backdoors were opened for DOM-based XSS.

## CSRF Mitigation

CSRF (Cross-Site Request Forgery) occurs when a malicious website tricks a user's browser into making an unwanted
request to an application using the user's active session. We mitigate this by using Supabase Auth which relies on JWT
tokens instead of HTTP session cookies. The Supabase client stores this JWT in `localStorage` which makes CSRF attacks 
difficult as the attackers website cannot read the app's `localStorage`. Additionally, the Flask API refuses to perform 
an Admin action unless a valid bearer token is explicitly provided in the headers.

## Supported Versions

![GitHub Release](https://img.shields.io/github/v/release/iraana/Capstone-Project?style=flat&color=FFD700&logo=github&logoColor=white)
is the latest release. Security updates are only accepted for this release.

## Reporting a Vulnerability 

If you find a vulnerability in our project, do not make an issue or tell us publicly. Instead, email us at _.