import { NavLink } from "react-router";

interface FooterLink {
  name: string;
  path: string;
}

const footerLinks: FooterLink[] = [
  { name: "About", path: "/about" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Service", path: "/terms-of-service" },
  { name: "Contact", path: "/contact" },
];

export const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-8 shadow-sm border-t border-blue-700">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <NavLink to="/" className="flex items-center mb-4 sm:mb-0 space-x-3">
            <span className="text-2xl font-semibold whitespace-nowrap">
              Gourmet2Go
            </span>
          </NavLink>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
            {footerLinks.map((link) => (
              <li key={link.name} className="me-4 md:me-6">
                <NavLink
                  to={link.path}
                  className="hover:underline"
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-6 border-blue-700 sm:mx-auto lg:my-8" />

        <span className="block text-sm sm:text-center">
          © 2026{" "}
          <NavLink to="/" className="hover:underline">
            Gourmet2Go™
          </NavLink>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
