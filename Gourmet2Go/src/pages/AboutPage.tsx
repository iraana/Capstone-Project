export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 -mt-20">
      
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
            Fresh meals prepared by Sault College culinary students
          </p>
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          
          
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                What Makes It Special
              </h2>
              <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p>
                  Gourmet2Go offers delicious, freshly prepared meals made by Sault
                  College culinary students. It's your chance to enjoy high-quality, 
                  chef-style dishes right here on campus!
                </p>
                <p>
                  Every week, our culinary team creates exciting new menus featuring 
                  soups, entrées, and more. Limited quantities are prepared fresh each 
                  service day, so ordering early ensures you don't miss out.
                </p>
                <p>
                  Pre-ordering through our app is quick and convenient—browse the weekly 
                  menu, select your favorites, and pick them up during scheduled hours. 
                  No waiting in long lines!
                </p>
              </div>
            </div>

            
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-3">
                How It Works
              </h3>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                {[
                  'Browse the weekly menu and select your meals',
                  'Place your order before the cutoff time',
                  'Receive email confirmation with pickup details',
                  'Pick up your meal and pay in person'
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

         
          <div className="space-y-6">
            
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-700">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🕐</span>
                Service Hours
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-700">
                  <span className="font-medium">Wednesday</span>
                  <span>12:15 - 12:45 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Thursday</span>
                  <span>12:15 - 12:45 PM</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Service times may vary each semester. Check weekly announcements for updates.
                </p>
              </div>
            </div>

            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-700">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Important Rules
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {[
                  'One active order per person at a time',
                  'Maximum 5 of the same item per order',
                  'Orders must be placed before daily cutoff time',
                  'Payment by card only at pickup (no cash accepted)',
                  'Items available on a first-come, first-served basis'
                ].map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg shrink-0">✓</span>
                    <span className="text-sm">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            
            <div className="bg-primary text-white rounded-lg shadow-md p-6">
              <h3 className="font-display font-bold text-xl mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Pickup Location
              </h3>
              <p className="text-blue-100 mb-2">Room L1170 - Culinary Department</p>
              <p className="text-sm text-blue-200">
                Located in the main building. You'll receive an email with your pickup 
                time when your order is ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};