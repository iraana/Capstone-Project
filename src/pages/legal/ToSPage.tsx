import { useTranslation } from 'react-i18next';

const LAST_UPDATED = 'February 17, 2026';

export const ToSPage = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 -mt-20">
      
      <div className="relative bg-primary text-white py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200)',
          }}
        />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-display font-bold mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('terms.subtitle')}
          </p>
          <p className="text-sm text-blue-200 mt-4">
            {t('terms.lastUpdated', { date: LAST_UPDATED })}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.agreement.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.agreement.p1')}</p>
              <p>{t('terms.sections.agreement.p2')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.account.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p className="mb-3">{t('terms.sections.account.p1')}</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {(t('terms.sections.account.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-sault-green mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">{t('terms.sections.account.p2')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.policies.title')}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  {t('terms.sections.policies.limits.title')}
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {(t('terms.sections.policies.limits.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  {t('terms.sections.policies.deadlines.title')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('terms.sections.policies.deadlines.desc')}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  {t('terms.sections.policies.reservations.title')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('terms.sections.policies.reservations.desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.payment.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <ul className="space-y-2">
                {(t('terms.sections.payment.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-sault-green mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.pickup.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.pickup.p1')}</p>
              
              <div className="bg-gray-50 dark:bg-zinc-700/50 p-4 rounded-lg my-4">
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🕐</span>
                    <div>
                      <p className="font-bold">{t('terms.sections.pickup.hoursTitle')}</p>
                      <p className="text-sm">{t('terms.sections.pickup.hours')}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <p className="font-bold">{t('terms.sections.pickup.locationTitle')}</p>
                      <p className="text-sm">{t('terms.sections.pickup.location')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mt-4">
                {(t('terms.sections.pickup.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-sault-green mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.cancellation.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.cancellation.p1')}</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-4">
                <div className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-3 text-xl shrink-0">⚠️</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('terms.sections.cancellation.warning')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.safety.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.safety.p1')}</p>
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                <div className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-3 text-xl shrink-0">⚠️</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>{t('terms.sections.safety.important')}</strong> 
                    {t('terms.sections.safety.warning')}
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                {(t('terms.sections.safety.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-sault-green mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.prohibited.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.prohibited.p1')}</p>
              <ul className="space-y-2">
                {(t('terms.sections.prohibited.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2 text-lg shrink-0">✗</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">{t('terms.sections.prohibited.p2')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.liability.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.liability.p1')}</p>
              <ul className="space-y-2">
                {(t('terms.sections.liability.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2 text-lg shrink-0">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.availability.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.availability.p1')}</p>
              <ul className="space-y-2">
                {(t('terms.sections.availability.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2 text-lg shrink-0">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">{t('terms.sections.availability.p2')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('terms.sections.changes.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('terms.sections.changes.p1')}</p>
              <p>{t('terms.sections.changes.p2')}</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};