import { useTranslation } from "react-i18next";
import { Menu } from "../components/Menu"

export const MenuPage = () => {
    
    const { t } = useTranslation(); 
    return (
        <main className="pt-6">
            <div className="text-center mb-10 space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {t("titles.menu")}
                </h1>
            </div>
            
            <Menu />
        </main>
    );
}