import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { cartStore } from "../store/cartStore";
import { useAuth } from "../context/AuthContext";
import { Plus, ShoppingBasket, UtensilsCrossed, Lock, AlertCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "./Loader";

export interface Dish {
  dish_id: number;
  name: string;
  category: 'Other' | 'Soups' | 'Salads' | 'Sandwiches' | 'Entrees' | 'Desserts' | 'Bowls'; 
  price: number;
}

export interface MenuDayDish {
  menu_day_dish_id: number;
  stock: number;
  Dishes: Dish; 
}

export interface MenuDay {
  menu_day_id: number;
  date: string; 
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  MenuDayDishes: MenuDayDish[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Menu = () => {
  const { addItem, items: cartItems, clearCart } = cartStore();
  const { user, role } = useAuth(); 
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);

  // Selects from MenuDays and then the related MenuDayDishes and the related Dishes 
  const { data: menuDays, isLoading, error } = useQuery({
    queryKey: ['menuDays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as unknown as MenuDay[];
    }
  });

  // Sets default day to the first one
  useEffect(() => {
    if (menuDays && menuDays.length > 0 && selectedDayId === null) {
      setSelectedDayId(menuDays[0].menu_day_id);
    }
  }, [menuDays, selectedDayId]);

  // One menu per order
  const cartMenuId = useMemo(() => {
    return cartItems.length > 0 ? cartItems[0].menu_id : null;
  }, [cartItems]);

  // Finds the selected menu object
  const currentMenu = useMemo(() => {
    return menuDays?.find(d => d.menu_day_id === selectedDayId);
  }, [menuDays, selectedDayId]);

  // Locks UI if cart has a different menu
  const isMenuLocked = cartMenuId !== null && currentMenu?.menu_day_id !== cartMenuId;

  // If user is a USER or ADMIN they'll be authorized
  const isAuthorized = user && (role === "USER" || role === "ADMIN");

  const lockedDateString = useMemo(() => {
    // Return if there is no menu in the cart or data isn't loaded
    if (!cartMenuId || !menuDays) return "";
    // Find the menu that matches the one in the cart
    const lockedMenu = menuDays.find(d => d.menu_day_id === cartMenuId);
    // Converts date to a more readible format
    return lockedMenu ? new Date(lockedMenu.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) : "";
  }, [cartMenuId, menuDays]); // Dependency array

  const dishesByCategory = useMemo(() => {
    // If no menu is selected, return an empty object
    if (!currentMenu) return {};

    // Holds dishes grouped by category
    const groups: Record<string, MenuDayDish[]> = {};
    
    // Dish array copied and dishes sorted alphabetically 
    const sortedDishes = [...currentMenu.MenuDayDishes].sort((a, b) => 
      a.Dishes.name.localeCompare(b.Dishes.name)
    );

    // Loop through each dish
    sortedDishes.forEach(dishItem => {
      // Get the category
      const cat = dishItem.Dishes.category;
      // If the category doesn't exist, create an empty array for it
      if (!groups[cat]) groups[cat] = [];
      // Add the dish to it's category group
      groups[cat].push(dishItem);
    });
    // Return the grouped dishes object
    return groups;
  }, [currentMenu]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAddToCart = (dishItem: MenuDayDish) => {
    // If isn't authorized or menu is locked or isn't the current menu, return
    if (!isAuthorized || isMenuLocked || !currentMenu) return;

    // Pushes the item data into the cart store
    addItem({
      dish_id: dishItem.Dishes.dish_id,
      name: dishItem.Dishes.name,
      price: dishItem.Dishes.price,
      category: dishItem.Dishes.category,
      maxStock: dishItem.stock,
      menu_id: currentMenu.menu_day_id,
    });
  };

  // Spinner while loading
  if (isLoading) {
    return <Loader fullScreen/>
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-red-500">
        <p>Something went wrong: {error.message}</p>
      </div>
    );
  }

  // If no menus
  if (!menuDays || menuDays.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <UtensilsCrossed className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-xl font-bold">No Menus Available</h3>
        <p>Come back another time</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      <AnimatePresence>
        {isMenuLocked && isAuthorized && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="z-30 mb-4 mx-4 md:mx-0 overflow-hidden"
          >
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  You have an active order for <span className="font-bold">{lockedDateString}</span>. 
                  You must clear your cart to order from this date.
                </p>
              </div>
              <button 
                onClick={clearCart}
                className="whitespace-nowrap flex items-center gap-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-800 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 text-xs font-bold rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-20 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-xl md:top-20 md:mb-8">
        <div className="flex overflow-x-auto no-scrollbar gap-2 py-4 snap-x">
          {menuDays.map((day) => {
            const isSelected = selectedDayId === day.menu_day_id;
            const isCartDate = cartMenuId !== null && day.menu_day_id === cartMenuId;
            const isLockedTab = cartMenuId !== null && day.menu_day_id !== cartMenuId;

            return (
              <button
                key={day.menu_day_id}
                onClick={() => setSelectedDayId(day.menu_day_id)}
                className={`
                  relative shrink-0 snap-start px-5 py-3 rounded-lg transition-all duration-300 group
                  flex flex-col items-center min-w-100px border
                  ${isSelected 
                    ? "bg-[#00659B] text-white border-[#00659B] shadow-lg shadow-blue-900/20 scale-105 z-10" 
                    : isLockedTab && isAuthorized
                        ? "bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-zinc-600 border-transparent hover:bg-gray-100" 
                        : "bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-700"}
                  `}
                >
                {isCartDate && !isSelected && isAuthorized && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-[#00659B] rounded-full"></div>
                )}

                <span className={`text-xs uppercase font-bold tracking-wider mb-1 ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                  {day.day.substring(0, 3)}
                </span>
                <span className="text-lg font-bold">
                  {formatDate(day.date)}
                </span>
                
                {isSelected && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full mb-2"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentMenu && (
          <motion.div
            key={currentMenu.menu_day_id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`space-y-10 px-2 md:px-0 mt-6 ${isMenuLocked && isAuthorized ? 'opacity-60 grayscale-[0.3] pointer-events-none' : ''}`}
          >
            {Object.keys(dishesByCategory).length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border-dashed border-2 border-gray-200 dark:border-zinc-700">
                    <ShoppingBasket className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No dishes have been added to this menu yet.</p>
                </div>
            ) : (
                Object.entries(dishesByCategory).map(([category, dishes]) => (
                <div key={category} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {category}
                    </h2>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700 mt-2"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dishes.map((dishItem) => {
                        const isSoldOut = dishItem.stock <= 0;
                        
                        let buttonText = "Add to Cart";
                        let ButtonIcon = Plus;
                        let isDisabled = false;

                        if (!user) {
                            buttonText = "Locked";
                            ButtonIcon = Lock;
                            isDisabled = true;
                        } else if (role === "NO_ACCESS") {
                            buttonText = "Locked";
                            ButtonIcon = Lock;
                            isDisabled = true;
                        } else if (isMenuLocked) {
                            buttonText = "Locked";
                            ButtonIcon = Lock;
                            isDisabled = true;
                        } else if (isSoldOut) {
                            buttonText = "Sold Out";
                            ButtonIcon = Lock;
                            isDisabled = true;
                        }

                        return (
                        <motion.div
                            key={dishItem.menu_day_dish_id}
                            variants={itemVariants}
                            className={`
                            relative overflow-hidden rounded-2xl p-5 border transition-all duration-300
                            ${isDisabled || isSoldOut 
                                ? "bg-gray-50 dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 opacity-80" 
                                : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900"}
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                {dishItem.Dishes.name}
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <UtensilsCrossed className="w-3 h-3" />
                                {category}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-[#00659B] dark:text-blue-400">
                                ${dishItem.Dishes.price.toFixed(2)}
                                </span>
                            </div>
                            </div>

                            <div className="flex items-end justify-between mt-4">
                            <div className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${isSoldOut 
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"}
                            `}>
                                {isSoldOut ? "Sold Out" : `${dishItem.stock} remaining`}
                            </div>

                            <motion.button
                                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                                onClick={() => handleAddToCart(dishItem)}
                                disabled={isDisabled}
                                className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors pointer-events-auto
                                ${isDisabled
                                    ? "bg-gray-100 text-gray-400 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-600 dark:border-zinc-700 cursor-not-allowed" 
                                    : "bg-[#00659B] text-white hover:bg-[#005082] shadow-md shadow-blue-900/10"}
                                `}
                            >
                                <ButtonIcon className="w-4 h-4" />
                                {buttonText}
                            </motion.button>
                            </div>
                        </motion.div>
                        );
                    })}
                    </div>
                </div>
                ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};