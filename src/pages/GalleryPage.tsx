import { Gallery } from "../components/Gallery"
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const GalleryPage = () => {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
                >
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                        {t("titles.gallery")}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mx-auto max-w-2xl">
                        {t("titles.gallerySubtitle")}
                    </p>
                </div>
                <Gallery />
            </motion.div>
        </main>
    );
}
