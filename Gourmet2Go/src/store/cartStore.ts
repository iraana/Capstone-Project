import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MAX_QTY_PER_ITEM = 5; // Hard cap on quantity

export interface CartItem {
  dish_id: number;
  menu_id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[]; 
  isOpen: boolean; 
  addItem: (item: Omit<CartItem, 'quantity'>) => void; 
  removeItem: (dish_id: number) => void; 
  updateQuantity: (dish_id: number, delta: number) => void; 
  clearCart: () => void; 
  toggleCart: () => void; 
  totalPrice: () => number; 
}

export const cartStore = create<CartState>()(
  // Perists across page reloads
  persist(
    // set updates the current state, get reads it
    (set, get) => ({
      // Cart starts as empty and closed
      items: [], 
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get(); // Reads current items
        // Checks if the item is already in the cart
        const existingItem = items.find(
          (i) => i.dish_id === newItem.dish_id
        );

        // Cannot exceed the 5 quantity limit and the stock
        const effectiveMax = Math.min(
          MAX_QTY_PER_ITEM,
          newItem.maxStock
        );

        // If the item is in the cart
        if (existingItem) {
          // If the quantity is less then the max, finds the matching item and increments the quantity
          if (existingItem.quantity < effectiveMax) {
            set({
              items: items.map((i) =>
                i.dish_id === newItem.dish_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            });
          }
          // else, add a brand new item with a quantity of 1
        } else {
          set({
            items: [
              ...items,
              {
                ...newItem,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (dish_id) => {
        // Filters out the item with the matching dish_id
        set({
          items: get().items.filter((i) => i.dish_id !== dish_id),
        });
      },

      updateQuantity: (dish_id, delta) => {
        // Reads the current items and removeItem action
        const { items, removeItem } = get();
        // Finds the target item
        const item = items.find((i) => i.dish_id === dish_id);

        if (!item) return;

        // Recalculates the maximum allowed
        const effectiveMax = Math.min(
          MAX_QTY_PER_ITEM,
          item.maxStock
        );
        const newQuantity = item.quantity + delta; // Applies the requested change

        // If quantity would be 0 or lower, remove
        if (newQuantity <= 0) {
          removeItem(dish_id);
          // Else, update quantity
        } else {
          set({
            items: items.map((i) =>
              i.dish_id === dish_id
                ? {
                    ...i,
                    quantity: Math.min(effectiveMax, newQuantity),
                  }
                : i
            ),
          });
        }
      },

      // Empties the cart
      clearCart: () => set({ items: [] }),

      // Toggle open or closed
      toggleCart: () =>
        set({ isOpen: !get().isOpen }),

      // Total starts at 0, loops through items, item price times quantity, adds to total
      totalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: 'gourmet2go-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);