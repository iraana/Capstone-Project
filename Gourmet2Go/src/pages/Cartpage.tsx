import { useState } from 'react';

export const Cartpage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Egg Drop Soup',
      price: 5.00,
      quantity: 2,
      stock: 15
    },
    {
      id: '2',
      name: 'Korean Fried Chicken with Sriracha Potato Salad',
      price: 11.00,
      quantity: 1,
      stock: 10
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.min(newQuantity, Math.min(5, item.stock)) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    
    clearCart();
    setIsSubmitting(false);
    window.location.href = '/orders';
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-8xl mb-4">🛒</div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some delicious items from the menu!
            </p>
            
              href="/menu"
              className="inline-block bg-sault-blue text-white px-6 py-3 rounded-md font-medium hover:bg-sault-blue-dark transition-colors"
             `{'>'}` 
              Browse Menu
            </div>
          </div>
        </div>
      
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Your Cart
          </h1>
          <p className="text-gray-600">
            Review your order before submitting. Items can be altered until 2:30 PM.
          </p>
        </div>

        
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-3 text-xl shrink-0">⚠️</span>
            <p className="text-sm text-yellow-700">
              Adding items to your cart does not reserve them. Items are reserved only after 
              placing an order, and are released after closing.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-display font-bold text-xl mb-6">
                Order #{new Date().getTime().toString().slice(-8)}
              </h2>

              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-4 pb-6 ${
                      index < cartItems.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    
                    <div className="shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl">🍽️</span>
                    </div>

                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sault-blue font-bold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-lg font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium bg-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= Math.min(5, item.stock)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 text-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from cart"
                    >
                      <span className="text-xl">🗑️</span>
                    </button>
                  </div>
                ))}
              </div>

              
              <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (13% HST)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-sault-blue">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-sault-blue text-white py-3 px-4 rounded-md font-medium hover:bg-sault-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              
                href="/menu"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors text-center"
               `{'>'}` 
                Back to Menu
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-2">
                <p className="flex items-start">
                  <span className="mr-2">ℹ️</span>
                  Payment by card only at pickup (no cash)
                </p>
                <p className="flex items-start">
                  <span className="mr-2">📍</span>
                  Pickup: Room L1170, Wed/Thu 12:15-12:45 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  );
};