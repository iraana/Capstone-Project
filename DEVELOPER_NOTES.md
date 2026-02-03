# Developer Notes


## What is this?


This is an **informal** place to write about changes, library choices, and what not.  Important stuff for us to know but not
important for the client and users.


## TODO


- Analytics
- AdminHome
- AboutPage
- PrivacyPolicyPage
- ToSPage
- NotAuthorizedPage
- Robust testing
- Remove .env and annihilate it from commit history somehow
- RLS on **all** database tables
- Mobile responsiveness, ensure there is a good UI/UX on mobile devices
- Accessibility standards (can navigate with keyboard, alt-text for images, etc.)


## Library Choices


- React Router for routing 
- TailwindCSS for easy styling 
- React Hook Form for simpler submitting
- React Query for fetching and caching 
- Zod for validation 
- vitest to run the tests in our project as we use Vite
- React Testing Library is used to test our components
- jsdom is used to create a testing browser which provides a realistic testing environment
- jest-dom provides custom Jest matchers. This means we have more intuitive assertions.
- user-event is used to simulate user input with stuff like ```await user.click(submitButton)```

- vite-plugin-pwa to turn the web app into a PWA. Users can install it like a desktop app and can bookmark it on mobile. Allows
us to optimize some features to work offline.


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


New addition to the standards for mobile UI/UX. Ensure that text changes sizes depending on device size. I'll provide an example
I have on some of my pages.


```html
<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">
```


Another small detail is that all tsx files must follow PascalCase. That means that a page that contains an item adding component 
would be `AddItemPage.tsx` and not `addItemPage.tsx` or `add_item_page.tsx` and so on. But, if you happen to add a .ts file it
would be camelCase so `helperStuff.ts` as an example.


Will also make it clear that the creation of types, interfaces, schemas, fetching, submitting, all happens in the .tsx file that
uses it. So we are not creating our types in a plain .ts file to be imported into a .tsx. However, there is a caveat to this.  
**IF** and only **IF** you are exporting your type, interface, schema, fetch, or submission to multiple .tsx files, then you can
put it in a .ts file to be imported.


Next, a convention I'll add for the sake of consistency. All styles must be TailwindCSS. React inline styles and vanilla CSS are
not used for this project. Now this is a convention that could be broken **IF** you can defend your reasoning. If you are not
using TailwindCSS just because, then it breaks the convention.


## Current Issues


- Mobile responsiveness


## Testing


(01/30/2026)


Obviously still working on just getting the actual functionality of the app completed right now. However, just
wanted to get a quick headstart on how to do testing in React. Still not confident with testing in React but our knowledge with
JUnit testing appears to be transferable, just new syntax to learn, that's all. In all likelihood there is good documentation for
all the testing libraries I installed. So where am I at right now for testing? Well, I got it set up and made a simple test on my
AddDish.tsx. I ran all the testing commands you can see below. So yeah, another thing we can add in for our presentation on 
Tuesday.


#### Testing Commands


- npm test (basic way to run tests)
- npm test -- --coverage (see test coverage)
- npm test -- --ui (testing in the browser)


#### JUnit Compared to Our Testing Stack


| JUnit | Our Stack |
|:---:|:---:|
| @Test | it() |
| @BeforeEach | beforeEach() |
| @AfterEach | afterEach() |
| @BeforeAll | beforeAll() |
| @AfterAll | afterAll() |
| assertEquals(expected, actual) | expect(actual).toBe(expected) |
| assertTrue(condition) | expect(condition).toBe(true) |
| assertThrows(Exception.class, () -> ...) | expect(() => ...).toThrow() |
| @Mock | vi.mock() |
| verify(mock).method() | expect(mock).toHaveBeenCalled() |


#### Things to Test


- Zod schemas
- Fetching/inserting functions
- Component behaviour 
- Authentication 
- Navigation 


## Questions for Stakeholders


- Can users order days in advance (make a order for Wednesday menu on a Monday)?
- Do they want peak hours on the app? (analytics)
- Would they like to have an Admin Chatroom? (trying to sneak in some Supabase Realtime)


## Misc