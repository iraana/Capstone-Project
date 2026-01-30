# Developer Notes


## What is this?


This is an **informal** place to write about changes, library choices, and what not.  Important stuff for us to know but not
important for the client and users.


## Incomplete Components/Pages


1. Analytics
2. AdminHome
3. AboutPage
4. PrivacyPolicyPage
5. ToSPage


## Library Choices


- React Router for routing 
- TailwindCSS for easy styling 
- React Hook Form for simpler submitting
- React Query for fetching and caching 
- Zod for validation 


## Conventions 


Tanstack React Query is used when fetching from Supabase. It's almost always done in an isolated function that is just logic and doesn't know about React.


Example:


```ts 
const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
      
      if (error) {
        throw error;
      }
      
      return data.role as "NO_ACCESS" | "USER" | "ADMIN";
  };
  
  const { data: role, isLoading, isError } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: () => fetchUserRole(user!.id),
    enabled: !!user?.id, 
  });
```


Additionally, any time we are submitting, React Hook Form is used alongside Zod. These provide easy type safety, validation, and
submission logic. Good example of this is in AddDish.tsx.


Lastly, all logic and html rendering goes in **components** and those components get imported into a page. The page is then put
in the router. The path defined in the router goes on the Navbar or somewhere else when applicable. Additionally, make sure to
protect the routes that should be protected such as admin routes.


## Current Issues


- When refreshing in a protected route, the user is always sent back to home regardless of role. It still works but this is
annoying and not user friendly


## Misc