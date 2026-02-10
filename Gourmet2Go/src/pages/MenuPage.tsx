import { Menu } from "../components/Menu"

export const MenuPage = () => {
    return (
        <div className="pt-6">
            <div className="text-center mb-10 space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Gourmet2Go Menu
                </h2>
            </div>
            
            <Menu />
        </div>
    );
}