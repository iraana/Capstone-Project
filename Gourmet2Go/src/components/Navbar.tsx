import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { cartStore } from "../store/cartStore"; 
import { ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Role = "NO_ACCESS" | "USER" | "ADMIN";

interface NavLinkType {
  name: string;
  path: string;
  roles?: Role[]; 
}

const getNavLinks = (): NavLinkType[] => [
  { name: "Administration", path: "/admin", roles: ["ADMIN"] },
  { name: "Menu", path: "/" },
  { name: "My Orders", path: "/my-orders", roles: ["USER", "ADMIN"]},
  { name: "Virtual Tour", path: "/virtualtour" }
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  
  const { items, toggleCart } = cartStore(); 
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const canAccessCart = user && (role === "USER" || role === "ADMIN");

  const [isBumped, setIsBumped] = useState(false);
  useEffect(() => {
    if (cartCount === 0) return;
    setIsBumped(true);
    const timer = setTimeout(() => setIsBumped(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const navLinks = getNavLinks().filter((link) => {
    if (!link.roles) return true;
    if (!role) return false;
    return link.roles.includes(role);
  });

  const displayName = user?.user_metadata.first_name || user?.user_metadata.last_name || user?.email?.split('@')[0];

  return (
    <header className="fixed top-0 w-full z-40 bg-primary backdrop-blur-md text-white shadow-lg shadow-blue-900/10 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-2xl tracking-tight group-hover:opacity-90 transition-opacity">
              Gourmet2Go
            </span>
          </NavLink>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `
                    text-sm font-medium transition-colors hover:text-secondary relative py-1
                    ${isActive ? "text-white" : "text-blue-100"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div 
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            
            {canAccessCart && (
              <button 
                onClick={toggleCart} 
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
                aria-label="Open Cart"
              >
                <ShoppingCart className="w-5 h-5 text-blue-100 group-hover:text-white transition-colors" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      key="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: isBumped ? 1.2 : 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            <div className="h-6 w-px bg-white/20"></div>

            <DarkModeToggle />

            <div className="h-6 w-px bg-white/20"></div>

            {user ? (
              <div className="flex items-center gap-4 pl-2">
                <span className="text-sm font-medium text-blue-100 hidden lg:block">Hi, {displayName}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500 text-white text-sm font-medium transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <NavLink
                to="/sign-in"
                className="px-5 py-2 rounded-lg bg-secondary hover:bg-green-500 text-white text-sm font-bold shadow-md shadow-amber-600/20 transition-all transform hover:-translate-y-0.5"
              >
                Sign In
              </NavLink>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            {canAccessCart && (
              <button onClick={toggleCart} className="relative text-white p-1">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none p-1"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#005585] overflow-hidden"
          >
            <ul className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors font-medium"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between px-4">
                <DarkModeToggle />
                {user ? (
                  <button onClick={signOut} className="text-red-300 font-medium">Sign Out</button>
                ) : (
                  <NavLink to="/sign-in" className="text-secondary font-bold">Sign In</NavLink>
                )}
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};