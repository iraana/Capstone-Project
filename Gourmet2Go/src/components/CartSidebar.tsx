import { cartStore } from "../store/cartStore";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router";

const MAX_QTY_PER_ITEM = 5;

export const CartSidebar = () => {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    totalPrice,
  } = cartStore();

  const { user } = useAuth();

  const displayName = user?.user_metadata.first_name || user?.user_metadata.last_name || user?.email?.split('@')[0];

  const subtotal = totalPrice();

  const navigate = useNavigate();

  const handleBrowseMenu = () => {
    toggleCart();
    navigate('/');
  }

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {/* Renders if open */}
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-dvh w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-70 flex flex-col border-l border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {displayName}'s Order
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <Utensils className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Cart is Empty
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-200px mx-auto">
                      If you're hungry, I suggest you browse our menu
                    </p>
                  </div>
                  <button
                    onClick={handleBrowseMenu} 
                    className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-[#005082] transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => {
                    const effectiveMax = Math.min(
                      MAX_QTY_PER_ITEM,
                      item.maxStock
                    );
                    const isMaxed = item.quantity >= effectiveMax;

                    return (
                      <motion.div
                        layout
                        key={item.dish_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex gap-4 group"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                            {item.category}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-lg p-1 border border-gray-100 dark:border-zinc-700">
                              <button
                                onClick={() =>
                                  updateQuantity(item.dish_id, -1)
                                }
                                disabled={item.quantity <= 1}
                                title={
                                  item.quantity <= 1
                                    ? "Minimum quantity is 1"
                                    : "Remove one"
                                }
                                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-md shadow-sm hover:shadow text-gray-600 dark:text-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus size={14} strokeWidth={2.5} />
                              </button>

                              <span className="w-4 text-center text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(item.dish_id, 1)
                                }
                                disabled={isMaxed}
                                title={
                                  isMaxed
                                    ? "Maximum 5 per item"
                                    : "Add one"
                                }
                                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-md shadow-sm hover:shadow text-gray-600 dark:text-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} strokeWidth={2.5} />
                              </button>

                              {isMaxed && (
                                <span className="text-xs text-gray-400 ml-1">
                                  Max 5
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => removeItem(item.dish_id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Remove Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="group w-full bg-linear-to-r from-[#00659B] to-[#005082] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                >
                  Checkout
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};