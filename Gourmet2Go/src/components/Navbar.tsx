import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";

type Role = "NO_ACCESS" | "USER" | "ADMIN";

interface NavLinkType {
  name: string;
  path: string;
  roles?: Role[]; 
}

const getNavLinks = (): NavLinkType[] => [
  { name: "About", path: "/about" },
  { name: "Administration", path: "/admin", roles: ["ADMIN"] },
  { name: "Menu", path: "/" },
];

export const Navbar = () => {
  const { user, role, signOut } = useAuth();

  const navLinks = getNavLinks().filter((link) => {
    if (!link.roles) { 
        return true;       
    }

    if (!role) { 
        return false;            
    }

    return link.roles.includes(role);
  });

  const displayName =
    user?.user_metadata.first_name ||
    user?.user_metadata.last_name ||
    user?.email;

  return (
    <header className="fixed top-0 w-full h-12 px-8 shadow-sm shadow-neutral-500 h-[--navbar-height] flex items-center bg-primary text-white z-10">
      <nav className="flex justify-between items-center w-full">

        <NavLink to="/" className="font-bold text-lg">
          Gourmet2Go
        </NavLink>

        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className="text-secondary hover:underline"
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-white">
                Hi, {displayName}
              </span>
              <button
                onClick={signOut}
                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <NavLink
              to="/sign-in"
              className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
            >
              Sign In
            </NavLink>
          )}
        </div>

      </nav>
    </header>
  );
};
