import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

interface FooterLink {
  key: string;
  path: string;
}

const footerLinks: FooterLink[] = [
  { key: "footer.links.about", path: "/about" },
  { key: "footer.links.privacy", path: "/privacy-policy" },
  { key: "footer.links.terms", path: "/terms-of-service" },
  { key: "footer.links.contact", path: "/contact" },
];

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-white mt-8 shadow-sm border-t">
      <div className="w-full max-w-7xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <NavLink to="/" className="flex items-center mb-4 sm:mb-0 space-x-3">
            <span className="text-2xl font-semibold whitespace-nowrap">
              Gourmet2Go
            </span>
          </NavLink>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
            {footerLinks.map((link) => (
              <li key={link.key} className="me-4 md:me-6">
                <NavLink
                  to={link.path}
                  className="hover:underline"
                >
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-6 opacity-10 sm:mx-auto lg:my-8" />

        <span className="block text-sm sm:text-center">
          © 2026{" "}
          <NavLink to="/" className="hover:underline">
            Sault College™
          </NavLink>
          . {t("footer.rights")}
        </span>
      </div>
    </footer>
  );
};