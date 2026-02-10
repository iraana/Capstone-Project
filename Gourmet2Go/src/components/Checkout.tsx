import { useState } from "react";
import { cartStore } from "../store/cartStore"; 
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabase-client";
import { useNavigate } from "react-router";
import { ArrowLeft, ShoppingBag, AlertCircle, FileText } from "lucide-react";
import { Loader } from "./Loader";

export const Checkout = () => {
  const { items, totalPrice, clearCart } = cartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const total = totalPrice();
    
  const handleConfirmOrder = async () => {
    // If, user isn't logged in or items is 0, return
    if (!user || items.length === 0) return;
    
    setLoading(true); // Shows loading state
    setErrorMsg(null); // Clears error messages

    try {
      const menuId = items[0].menu_id; // Gets the menu_id from the first item
      const dishIds = items.map((i) => i.dish_id); // Array of dish_ids

      // Ensures the user hasn't already made an order for this menu
      const { data: existingOrders, error: existingOrdersError } = await supabase
        .from("Orders")
        .select("order_id")
        .eq("user_id", user.id)
        .eq("menu_id", menuId)
        .limit(1);

      if (existingOrdersError) throw existingOrdersError;

      if (existingOrders && existingOrders.length > 0) {
        throw new Error("You've already placed an order for this menu. We have a strict one order per menu policy. You can delete your current order and re-order if you'd like.");
      }

      // Ensures the item is still in stock
      const { data: stockData, error: stockError } = await supabase
        .from('MenuDayDishes')
        .select(`
          dish_id, 
          stock, 
          Dishes ( name )
        `)
        .eq('menu_id', menuId)
        .in('dish_id', dishIds);

      if (stockError) throw stockError;

      // Loops through all items in the cart and finds the corresponding dish in the database
      for (const item of items) {
        const dbItem = stockData?.find((d) => d.dish_id === item.dish_id);
        
        if (!dbItem) {
          throw new Error(`Item ${item.name} is no longer available on this menu.`);
        }

        if (item.quantity > dbItem.stock) {
          throw new Error(
            `Sorry, there are only ${dbItem.stock} left in stock for "${item.name}". Please adjust your cart.`
          );
        }
      }

      // Inserts order into supabase
      const { data: orderData, error: orderError } = await supabase
        .from("Orders")
        .insert({
          user_id: user.id,
          menu_id: menuId,
          notes: notes.trim() || null,
          total: total,
          order_number: Math.floor(10000000 + Math.random() * 90000000) // Random 8 digit number
        })
        .select("order_id")
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.order_id; // Stores the order_id

      // Converts cart items into database rows
      const orderItemsData = items.map((item) => ({
        order_id: orderId,
        dish_id: item.dish_id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      // Inserts into OrderItems
      const { error: itemsError } = await supabase
        .from("OrderItems")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      const stockUpdates = items.map(async (item) => {
        // Finds the old stock
        const originalStock = stockData?.find(d => d.dish_id === item.dish_id)?.stock || 0;
        // Calculates the new stock
        const newStock = Math.max(0, originalStock - item.quantity);

        // Updates the stock of the dish
        return supabase
          .from('MenuDayDishes')
          .update({ stock: newStock })
          .eq('menu_id', menuId)
          .eq('dish_id', item.dish_id);
      });

      await Promise.all(stockUpdates); // All stock updates happen in unison

      clearCart(); // Cart cleared
      navigate("/successful-order"); // User sent to SuccessfulOrderPage

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null; // Checkout won't render if cart is empty

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full hover:border-[#00659B] hover:text-[#00659B] transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#00659B]" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Checkout</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review your order and confirm details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00659B]" />
                Order Notes <span className="text-gray-400 font-normal text-sm ml-auto">(Optional)</span>
              </h2>
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else we need to know to make your order perfect..."
                  className="w-full h-40 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-[#00659B] focus:border-transparent focus:outline-none transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {notes.length} characters
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#00659B]" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.dish_id} className="flex justify-between items-start py-2 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                    <div className="flex gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-zinc-800 text-xs font-bold rounded text-gray-600 dark:text-gray-300">
                        {item.quantity}x
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-extrabold text-[#00659B]">${total.toFixed(2)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                </div>
              )}

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full bg-linear-to-r from-[#00659B] to-[#005082] hover:from-[#005082] hover:to-[#004060] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? <Loader fullScreen text="Processing..." /> : "Confirm Order"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};