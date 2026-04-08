import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { cartStore } from "../store/cartStore"; 
import { ShoppingCart, Menu as MenuIcon, X, Settings, ChevronDown } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { AccountSettings } from "./account/AccountSettings"; 
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { useTranslation } from "react-i18next";

type Role = "NO_ACCESS" | "USER" | "ADMIN";

interface NavLinkType {
  name: string;
  path: string;
  roles?: Role[]; 
}

const getNavLinks = (t: (key: string) => string): NavLinkType[] => [
  { name: t("nav.admin"), path: "/admin", roles: ["ADMIN"] },
  { name: t("nav.gallery"), path: "/gallery"},
  { name: t("nav.menu"), path: "/" },
  { name: t("nav.myOrders"), path: "/my-orders", roles: ["USER", "ADMIN"]},
  { name: t("nav.review"), path: "/review", roles: ["USER", "ADMIN"]},
  { name: t("nav.virtualTour"), path: "/virtualtour", roles: ["USER"]},
];

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); 
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".lang-dropdown")) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const userId = user?.id;

  const { data: profile } = useQuery({
    queryKey: ["profile", "navbar", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();
      
      if (error) return null;
      return data;
    }
  });

  const displayName = profile?.first_name || profile?.last_name || user?.email?.split('@')[0];

  const navLinks = getNavLinks(t).filter((link) => {
    if (!link.roles) return true;
    if (!role) return false;
    return link.roles.includes(role);
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("appLanguage", lng);
    setLangDropdownOpen(false);
  };

  const isFrench = i18n.language?.startsWith("fr");

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-primary backdrop-blur-md text-white shadow-lg shadow-blue-900/10 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <NavLink to="/" className="flex items-center gap-2 group">
              <img src="/logo.svg" alt="Gourmet2Go Logo" className="w-12 h-12 object-contain" />
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

              {user && (
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                  aria-label={t("nav.accountSettings")}
                  title={t("nav.accountSettings")}
                >
                  <Settings className="w-5 h-5 text-blue-100 group-hover:text-white transition-colors" />
                </button>
              )}

              <div className="h-6 w-px bg-white/20"></div>

              {/* Desktop Language Switcher */}
              <div className="relative lang-dropdown">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded transition-colors"
                >
                  {isFrench ? "FR" : "ENG"}
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => changeLanguage('en')}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors ${!isFrench ? "font-bold" : ""}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => changeLanguage('fr')}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors ${isFrench ? "font-bold" : ""}`}
                      >
                        Français
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DarkModeToggle />

              <div className="h-6 w-px bg-white/20"></div>

              {user ? (
                <div className="flex items-center gap-4 pl-2">
                  <span className="text-sm font-medium text-blue-100 hidden lg:block">
                    {t("nav.hi", { name: displayName })}
                  </span>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500 text-white text-sm font-medium transition-all"
                  >
                    {t("nav.signOut")}
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/sign-in"
                  className="px-5 py-2 rounded-lg bg-secondary hover:bg-green-500 text-white text-sm font-bold shadow-md shadow-amber-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  {t("nav.signIn")}
                </NavLink>
              )}
            </div>

            {/* Mobile View Toggles */}
            <div className="md:hidden flex items-center gap-4">
              {canAccessCart && (
                <button onClick={toggleCart} className="relative text-white p-1" aria-label="Open Cart">
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
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Dropdown Menu */}
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
                
                {user && (
                  <li>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setSettingsOpen(true);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors font-medium flex items-center gap-2"
                    >
                      <Settings size={18} />
                      {t("nav.accountSettings")}
                    </button>
                  </li>
                )}

                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-4 px-4">
                  
                  {/* Mobile Language Dropdown */}
                  <div>
                    <label className="text-xs text-blue-100/70 uppercase tracking-wider mb-2 block font-medium">
                      {t("nav.language")}
                    </label>
                    <select
                      value={isFrench ? "fr" : "en"}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 outline-none appearance-none"
                    >
                      <option value="en" className="text-black">English</option>
                      <option value="fr" className="text-black">Français</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <DarkModeToggle />
                    {user ? (
                      <button onClick={signOut} className="text-red-300 font-medium">{t("nav.signOut")}</button>
                    ) : (
                      <NavLink to="/sign-in" className="text-secondary font-bold">{t("nav.signIn")}</NavLink>
                    )}
                  </div>
                </div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AccountSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};