import { ResetPassword } from "../../components/auth/ResetPassword.tsx"
import { useTranslation } from "react-i18next";

export const ResetPasswordPage = () => {
    const { t } = useTranslation();
    
    return (
        <main className="flex flex-col items-center justify-center py-12 px-6 transition-colors duration-300">
            <div className="w-full max-w-2xl"> 
                <h2 className="text-center text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white mb-10">
                    {t("resetPassword.title")}
                </h2>
                <ResetPassword />
            </div>
        </main>
    );
}