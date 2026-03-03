export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      
     
      <div className="relative bg-primary text-white py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200)',
          }}
        />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-display font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-blue-200 mt-4">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

     
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
         
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Welcome to Gourmet2Go. We are committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you use our online 
                food ordering platform.
              </p>
              <p>
                By using our service, you agree to the collection and use of information in 
                accordance with this policy. If you do not agree with our policies and practices, 
                please do not use our service.
              </p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
              2. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  2.1 Personal Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  When you create an account or place an order, we may collect:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {[
                    'Full name (first and last name)',
                    'Email address',
                    'Student ID number',
                    'Phone number (optional)',
                    'Dietary preferences and restrictions'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  2.2 Order Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We collect details about your orders, including:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {[
                    'Items ordered and quantities',
                    'Order date and time',
                    'Pickup location and time',
                    'Order status and history',
                    'Special instructions or requests'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  2.3 Payment Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Payment is processed at pickup using card terminals. We do not store your full 
                  credit card information on our servers. Payment processing is handled securely 
                  through our payment provider in compliance with PCI DSS standards.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  2.4 Technical Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We automatically collect certain technical information, including:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {[
                    'IP address and device information',
                    'Browser type and version',
                    'Operating system',
                    'Pages visited and time spent on our platform',
                    'Referring website addresses'
                  ].map((item, index) => (
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
              3. How We Use Your Information
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p className="mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {[
                  'To process and fulfill your food orders',
                  'To communicate order confirmations, updates, and pickup notifications',
                  'To manage your account and provide customer support',
                  'To improve our menu offerings based on ordering patterns',
                  'To accommodate dietary restrictions and food allergies',
                  'To send important updates about service hours or menu changes',
                  'To maintain records for operational and compliance purposes',
                  'To analyze usage patterns and improve our platform',
                  'To prevent fraud and ensure system security'
                ].map((item, index) => (
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
              4. How We Share Your Information
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Service Providers</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    With trusted third-party vendors who assist in operating our platform 
                    (e.g., payment processors, email service providers)
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">University Administration</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    When required for institutional reporting or compliance purposes
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Legal Obligations</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    When required by law, court order, or government regulation
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Emergency Situations</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    To protect health and safety in cases involving food allergies or medical emergencies
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              5. Data Security
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or 
                destruction. These measures include:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-3">
                {[
                  'Encryption of data in transit and at rest',
                  'Regular security audits and monitoring',
                  'Access controls and authentication requirements',
                  'Secure backup and recovery procedures',
                  'Employee training on data protection practices'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% 
                secure. While we strive to protect your personal information, we cannot guarantee 
                absolute security.
              </p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              6. Data Retention
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required or 
                permitted by law. Specifically:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-3">
                {[
                  'Account information is retained while your account is active',
                  'Order history is kept for 2 years for operational and reporting purposes',
                  'Payment records are retained as required by financial regulations',
                  'Analytics data may be retained in aggregated, anonymized form indefinitely'
                ].map((item, index) => (
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
              7. Cookies and Tracking Technologies
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our 
                platform. Cookies are small data files stored on your device.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start">
                  <span className="mr-3 text-2xl shrink-0">🍪</span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Essential Cookies</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Required for basic site functionality (login, cart management)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 text-2xl shrink-0">⚙️</span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Preference Cookies</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Remember your settings and preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 text-2xl shrink-0">📊</span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Help us understand how you use our platform
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4">
                You can control cookie settings through your browser preferences, though disabling 
                certain cookies may affect site functionality.
              </p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              8. Your Privacy Rights
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                You have the following rights regarding your personal information:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {[
                  { icon: '👁️', title: 'Access', desc: 'Request a copy of the personal information we hold about you' },
                  { icon: '✏️', title: 'Correction', desc: 'Request correction of inaccurate or incomplete information' },
                  { icon: '🗑️', title: 'Deletion', desc: 'Request deletion of your personal information (subject to legal obligations)' },
                  { icon: '📦', title: 'Data Portability', desc: 'Receive your data in a structured, machine-readable format' },
                  { icon: '🚫', title: 'Opt-out', desc: 'Unsubscribe from marketing communications' },
                  { icon: '⏸️', title: 'Restriction', desc: 'Request restriction of processing in certain circumstances' }
                ].map((right, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-zinc-700/50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3 shrink-0">{right.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{right.title}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{right.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg mt-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>To exercise any of these rights,</strong> please contact us at{' '}
                  <a href="mailto:privacy@gourmet2go.com" className="text-primary hover:underline font-medium">
                    privacy@gourmet2go.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              9. Third-Party Links
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Our platform may contain links to third-party websites or services that are not 
                operated by us. If you click on a third-party link, you will be directed to that 
                third party's site.
              </p>
              <p>
                We strongly advise you to review the Privacy Policy of every site you visit. We 
                have no control over and assume no responsibility for the content, privacy policies, 
                or practices of any third-party sites or services.
              </p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              10. Children's Privacy
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Our service is intended for use by college students and staff members. We do not 
                knowingly collect personally identifiable information from children under 13. If 
                you are a parent or guardian and you are aware that your child has provided us with 
                personal information, please contact us.
              </p>
            </div>
          </div>

         
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last 
                Updated" date at the top of this policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes 
                to this Privacy Policy are effective when they are posted on this page.
              </p>
            </div>
          </div>

          
          <div className="bg-primary text-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-display font-bold mb-4">
              12. Contact Us
            </h2>
            <p className="text-blue-100 mb-6">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-3 text-blue-100">
              <p className="flex items-center">
                <span className="mr-3 text-xl">📧</span>
                Email: <a href="mailto:privacy@gourmet2go.com" className="ml-2 hover:underline font-medium">privacy@gourmet2go.com</a>
              </p>
              <p className="flex items-center">
                <span className="mr-3 text-xl">📍</span>
                Location: Room L1170, Culinary Department, Sault College
              </p>
              <p className="flex items-center">
                <span className="mr-3 text-xl">🕐</span>
                Service Hours: Wednesday & Thursday, 12:15 - 12:45 PM
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};