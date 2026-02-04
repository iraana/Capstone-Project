import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { DarkModeToggle } from "./DarkModeToggle";

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
  { name: "Virtual Tour", path: "/virtualtour" }
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="fixed top-0 w-full z-40 bg-primary text-white shadow-sm shadow-neutral-500">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <NavLink to="/" className="font-bold text-lg">
            Gourmet2Go
          </NavLink>

          <ul className="hidden md:flex items-center gap-8">
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

          <div className="hidden md:flex items-center gap-4">
            <DarkModeToggle />

            {user ? (
              <>
                <span className="text-sm">Hi, {displayName}</span>
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

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary/95">
          <ul className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className="block px-3 py-2 rounded text-white hover:bg-secondary hover:text-white"
                  onClick={() => setMenuOpen(false)} 
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            <DarkModeToggle />

            <li className="border-t border-white/20 mt-2 pt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1 rounded bg-blue-500 text-white text-sm block text-center"
                >
                  Sign In
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
