import { Review } from "../components/Review"
import { useTranslation } from "react-i18next";

export const ReviewPage = () => {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300 py-10 px-4">
            <div className="max-w-2xl mx-auto"> 
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
                        {t("titles.review")}
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                        {t("titles.reviewSubtitle")}
                    </p>
                </div>
                <Review />
            </div>
        </main>
    );
}