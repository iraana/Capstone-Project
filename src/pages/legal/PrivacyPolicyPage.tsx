import { useTranslation } from 'react-i18next';

const LAST_UPDATED = 'February 17, 2026';

export const PrivacyPolicyPage = () => {
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
            {t('privacy.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('privacy.subtitle')}
          </p>
          <p className="text-sm text-blue-200 mt-4">
            {t('privacy.lastUpdated', { date: LAST_UPDATED })}
          </p>
        </div>
      </div>

     
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
         
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.intro.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('privacy.sections.intro.p1')}</p>
              <p>{t('privacy.sections.intro.p2')}</p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
              {t('privacy.sections.collect.title')}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  {t('privacy.sections.collect.personal.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {t('privacy.sections.collect.personal.desc')}
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {(t('privacy.sections.collect.personal.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  {t('privacy.sections.collect.order.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {t('privacy.sections.collect.order.desc')}
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {(t('privacy.sections.collect.order.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  {t('privacy.sections.collect.payment.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('privacy.sections.collect.payment.desc')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  {t('privacy.sections.collect.technical.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {t('privacy.sections.collect.technical.desc')}
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {(t('privacy.sections.collect.technical.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

         
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.use.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p className="mb-3">{t('privacy.sections.use.desc')}</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {(t('privacy.sections.use.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.share.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('privacy.sections.share.desc')}</p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                  <p className="font-bold text-gray-900 dark:text-white mb-2">{t('privacy.sections.share.admin.title')}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('privacy.sections.share.admin.desc')}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                  <p className="font-bold text-gray-900 dark:text-white mb-2">{t('privacy.sections.share.emergency.title')}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('privacy.sections.share.emergency.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.security.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('privacy.sections.security.desc')}</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-3">
                {(t('privacy.sections.security.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">{t('privacy.sections.security.warning')}</p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.retention.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('privacy.sections.retention.desc')}</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-3">
                {(t('privacy.sections.retention.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

         
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.rights.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('privacy.sections.rights.desc')}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {[
                  { icon: '👁️', key: 'access' },
                  { icon: '✏️', key: 'correction' },
                  { icon: '🗑️', key: 'deletion' },
                  { icon: '📦', key: 'portability' },
                  { icon: '🚫', key: 'optOut' },
                  { icon: '⏸️', key: 'restriction' }
                ].map((right, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-zinc-700/50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3 shrink-0">{right.icon}</span>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          {t(`privacy.sections.rights.items.${right.key}.title`)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t(`privacy.sections.rights.items.${right.key}.desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg mt-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>{t('privacy.sections.rights.contactBold')}</strong> {t('privacy.sections.rights.contactRest')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.sections.changes.title')}
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>{t('privacy.sections.changes.p1')}</p>
              <p>{t('privacy.sections.changes.p2')}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};