import { useTranslation } from "react-i18next";

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 -mt-20">
      
      <div className="relative bg-primary text-white py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200)',
          }}
        />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-display font-bold mb-4">
            Gourmet2Go
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("about.heroSubtitle")}
          </p>
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          
          
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                {t("about.special.title")}
              </h2>
              <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p>{t("about.special.p1")}</p>
                <p>{t("about.special.p2")}</p>
                <p>{t("about.special.p3")}</p>
              </div>
            </div>

            
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-3">
                {t("about.howItWorks.title")}
              </h3>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                {[1, 2, 3, 4].map((step) => (
                  <li key={step} className="flex items-start">
                    <span className="shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {step}
                    </span>
                    <span>{t(`about.howItWorks.step${step}`)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

         
          <div className="space-y-6">
            
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-700">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🕐</span>
                {t("about.serviceHours.title")}
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-700">
                  <span className="font-medium">{t("about.serviceHours.wednesday")}</span>
                  <span>{t("about.serviceHours.wednesdayTime")}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">{t("about.serviceHours.thursday")}</span>
                  <span>{t("about.serviceHours.thursdayTime")}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {t("about.serviceHours.note")}
                </p>
              </div>
            </div>

            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-700">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                {t("about.rules.title")}
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {[1, 2, 3, 4, 5].map((rule) => (
                  <li key={rule} className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{t(`about.rules.rule${rule}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            
            <div className="bg-primary text-white rounded-lg shadow-md p-6">
              <h3 className="font-display font-bold text-xl mb-4 flex items-center">
                <span className="mr-2">📍</span>
                {t("about.location.title")}
              </h3>
              <p className="text-white  mb-2">{t("about.location.room")}</p>
              <p className="text-sm text-blue-50">
                {t("about.location.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};