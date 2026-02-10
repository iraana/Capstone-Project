import { useState } from 'react';

export const Menupage = () => {
  const [selectedDay, setSelectedDay] = useState('wednesday');
  

  const menuItems = [
    
    { id: '1', name: 'Egg Drop Soup', price: 5.00, category: 'soups', stock: 15, image: '/images/EggDropSoup.jpg' },
    { id: '2', name: 'Corn Chowder', price: 5.00, category: 'soups', stock: 12, image: '/images/CornChowder.jpg' },
    
    { id: '3', name: 'Mediterranean Quinoa Bowl', price: 10.00, category: 'bowls', stock: 10, image: 'https://via.placeholder.com/400x250/90EE90/333333?text=Quinoa+Bowl' },
    
    { id: '4', name: 'Duck Confit Tacos', price: 12.00, category: 'entrees', stock: 8, image: 'https://via.placeholder.com/400x250/FF6347/333333?text=Duck+Tacos' },
    { id: '5', name: 'Korean Fried Chicken', price: 11.00, category: 'entrees', stock: 10, image: 'https://via.placeholder.com/400x250/DC143C/333333?text=Korean+Chicken' },
    { id: '6', name: 'Beef Vegetable Soba Noodle Stir Fry', price: 10.00, category: 'entrees', stock: 12, image: 'https://via.placeholder.com/400x250/8B4513/FFFFFF?text=Soba+Noodles' },
    { id: '7', name: 'Tikka Masala with Basmati Rice', price: 10.00, category: 'entrees', stock: 15, image: 'https://via.placeholder.com/400x250/FF8C00/333333?text=Tikka+Masala' },
    { id: '8', name: 'Seafood Linguine with Cognac Cream Sauce', price: 12.00, category: 'entrees', stock: 8, image: 'https://via.placeholder.com/400x250/4682B4/FFFFFF?text=Seafood+Linguine' },
  ];

  const soups = menuItems.filter(item => item.category === 'soups');
  const bowls = menuItems.filter(item => item.category === 'bowls');
  const entrees = menuItems.filter(item => item.category === 'entrees');

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="relative h-64 bg-linear-to-r from-sault-blue to-sault-blue-dark overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200)',
          }}
        />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              This Week's Menu
            </h1>
            <p className="text-lg text-blue-100">
              Fresh meals prepared daily by our culinary students
            </p>
          </div>
        </div>
      </div>

      
      <div className="bg-yellow-50 border-b-2 border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center text-yellow-800">
            <span className="mr-2 text-xl">ℹ️</span>
            <span className="text-sm font-medium">
              Service: Wednesday & Thursday from 12:15-12:45 PM in Room L1170. 
              Soups are $5, Entrées $10-12. Card payment only. Menu items subject to change.
            </span>
          </div>
        </div>
      </div>

    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
       
        <div className="bg-sault-green mb-8 rounded-lg p-2 inline-flex space-x-2">
          <button
            onClick={() => setSelectedDay('wednesday')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              selectedDay === 'wednesday'
                ? 'bg-white text-sault-green shadow-md'
                : 'text-white hover:bg-sault-green-dark'
            }`}
          >
            Wednesday
          </button>
          <button
            onClick={() => setSelectedDay('thursday')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              selectedDay === 'thursday'
                ? 'bg-white text-sault-green shadow-md'
                : 'text-white hover:bg-sault-green-dark'
            }`}
          >
            Thursday
          </button>
        </div>

        
        {soups.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-8 bg-sault-green rounded-full mr-3" />
              Soups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soups.map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-sault-blue">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-sault-green font-medium">
                        ✓ {item.stock} available
                      </span>
                    </div>
                    <button className="w-full bg-sault-blue text-white py-2 px-4 rounded-md font-medium hover:bg-sault-blue-dark transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {bowls.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-8 bg-sault-green rounded-full mr-3" />
              Bowls
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bowls.map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-sault-blue">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-sault-green font-medium">
                        ✓ {item.stock} available
                      </span>
                    </div>
                    <button className="w-full bg-sault-blue text-white py-2 px-4 rounded-md font-medium hover:bg-sault-blue-dark transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {entrees.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-8 bg-sault-green rounded-full mr-3" />
              Entrées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entrees.map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-sault-blue">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-sault-green font-medium">
                        ✓ {item.stock} available
                      </span>
                    </div>
                    <button className="w-full bg-sault-blue text-white py-2 px-4 rounded-md font-medium hover:bg-sault-blue-dark transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};