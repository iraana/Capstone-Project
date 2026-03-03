export const ToSPage = () => {
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
            Terms of Service
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Please read these terms carefully before using Gourmet2Go
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
              1. Agreement to Terms
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Welcome to Gourmet2Go. By accessing or using our online food ordering platform, 
                you agree to be bound by these Terms of Service and all applicable laws and 
                regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing this service.
              </p>
              <p>
                These Terms of Service apply to all users of the platform, including students, 
                faculty, staff, and administrators of Sault College.
              </p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              2. Account Registration and Eligibility
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p className="mb-3">
                To use Gourmet2Go, you must:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {[
                  'Be a current Sault College student, faculty, or staff member',
                  'Provide accurate, current, and complete information during registration',
                  'Maintain the security of your account password',
                  'Notify us immediately of any unauthorized use of your account',
                  'Be responsible for all activities that occur under your account'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-sault-green mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                We reserve the right to suspend or terminate accounts that violate these terms 
                or are associated with fraudulent activity.
              </p>
            </div>
          </div>

         
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              3. Order Policies
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Order Limits</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• One active order per person at a time</li>
                  <li>• Maximum 5 of the same item per order</li>
                  <li>• Orders subject to item availability</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Order Deadlines</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Orders must be placed before the daily cutoff time. Late orders will not be 
                  accepted. Cutoff times are displayed on the menu page and may vary by service day.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Reservations</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Adding items to your cart does NOT reserve them. Items are only reserved after 
                  you complete checkout and receive order confirmation. Reserved items are released 
                  after closing if not picked up.
                </p>
              </div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              4. Payment Terms
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <ul className="space-y-2">
                {[
                  'Payment is required at pickup by card only (no cash accepted)',
                  'Prices are subject to 13% HST (Harmonized Sales Tax)',
                  'Prices may change without notice',
                  'All sales are final - no refunds except for quality issues',
                  'Unclaimed orders will not be refunded'
                ].map((item, index) => (
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
              5. Pickup Requirements
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Orders must be picked up during designated service hours:
              </p>
              
              <div className="bg-gray-50 dark:bg-zinc-700/50 p-4 rounded-lg my-4">
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🕐</span>
                    <div>
                      <p className="font-bold">Service Hours</p>
                      <p className="text-sm">Wednesday & Thursday: 12:15 - 12:45 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <p className="font-bold">Location</p>
                      <p className="text-sm">Room L1170 - Culinary Department</p>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mt-4">
                {[
                  'You must present your student/staff ID at pickup',
                  'Orders not picked up during service hours will be released',
                  'No refunds for unclaimed orders',
                  'You will receive email notification when your order is ready'
                ].map((item, index) => (
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
              6. Cancellation and Modification
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Orders can be modified or cancelled through your account dashboard before the 
                daily cutoff time (typically 2:30 PM). After the cutoff, orders cannot be 
                cancelled or modified as meal preparation has begun.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-4">
                <div className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-3 text-xl shrink-0">⚠️</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Late cancellations (after cutoff) or no-shows may result in temporary 
                    suspension of ordering privileges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              7. Food Safety and Allergies
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                While we make every effort to accommodate dietary restrictions and allergies, 
                our kitchen handles common allergens including dairy, eggs, wheat, soy, nuts, 
                and shellfish. Cross-contamination may occur.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                <div className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-3 text-xl shrink-0">⚠️</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Important:</strong> If you have severe food allergies, please consult 
                    with our culinary staff before ordering. We cannot guarantee allergen-free meals.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                {[
                  'Ingredient lists are provided for all menu items',
                  'You are responsible for reviewing ingredients before ordering',
                  'Special dietary requests must be submitted in advance',
                  'We are not liable for allergic reactions resulting from undisclosed allergies'
                ].map((item, index) => (
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
              8. Prohibited Conduct
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>You agree NOT to:</p>
              <ul className="space-y-2">
                {[
                  'Create multiple accounts to circumvent order limits',
                  'Place fraudulent or abusive orders',
                  'Share your account credentials with others',
                  'Resell meals purchased through Gourmet2Go',
                  'Attempt to manipulate prices or inventory',
                  'Use automated systems to place orders (bots)',
                  'Harass or abuse staff members',
                  'Violate any applicable laws or regulations'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2 text-lg shrink-0">✗</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Violation of these terms may result in immediate account termination and 
                potential disciplinary action through Sault College.
              </p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              9. Limitation of Liability
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Gourmet2Go and Sault College shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use or inability 
                to use the service, including but not limited to:
              </p>
              <ul className="space-y-2">
                {[
                  'Errors or inaccuracies in menu descriptions',
                  'Unavailability of menu items',
                  'Service interruptions or technical issues',
                  'Food quality concerns (subject to quality guarantee)',
                  'Delays in order preparation or pickup'
                ].map((item, index) => (
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
              10. Service Availability
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Gourmet2Go operates during the academic year and is subject to closure during:
              </p>
              <ul className="space-y-2">
                {[
                  'College holidays and breaks',
                  'Reading weeks and exam periods',
                  'Summer semester (unless otherwise announced)',
                  'Emergency situations or unforeseen circumstances'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2 text-lg shrink-0">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                We reserve the right to modify service hours, suspend operations, or discontinue 
                the service at any time without prior notice.
              </p>
            </div>
          </div>

          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              11. Changes to Terms
            </h2>
            <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify 
                users of significant changes via email or prominent notice on the platform. Your 
                continued use of Gourmet2Go after such modifications constitutes acceptance of 
                the updated terms.
              </p>
              <p>
                It is your responsibility to review these terms periodically. The "Last Updated" 
                date at the top of this page indicates when the terms were last revised.
              </p>
            </div>
          </div>

         
          <div className="bg-primary text-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-display font-bold mb-4">
              12. Contact Information
            </h2>
            <p className="text-blue-100 mb-6">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-3 text-blue-100">
              <p className="flex items-center">
                <span className="mr-3 text-xl">📧</span>
                Email: <a href="mailto:support@gourmet2go.com" className="ml-2 hover:underline font-medium">support@gourmet2go.com</a>
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