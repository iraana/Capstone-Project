import { describe, it, expect, beforeEach } from 'vitest';
import { cartStore } from '../store/cartStore';

describe('cartStore', () => {
  // Reset cart before each test
  beforeEach(() => {
    cartStore.getState().clearCart();
    cartStore.setState({ isOpen: false });
  });

  describe('Initial State', () => {
    it('starts with an empty cart', () => {
      const { items } = cartStore.getState();
      expect(items).toEqual([]);
    });

    it('starts with cart closed', () => {
      const { isOpen } = cartStore.getState();
      expect(isOpen).toBe(false);
    });

    it('totalPrice starts at 0', () => {
      const { totalPrice } = cartStore.getState();
      expect(totalPrice()).toBe(0);
    });

    it('totalItems starts at 0', () => {
      const { totalItems } = cartStore.getState();
      expect(totalItems()).toBe(0);
    });
  });

  describe('addItem', () => {
    it('adds a new item to the cart', () => {
  const { addItem } = cartStore.getState();
  
  addItem({
    dish_id: 1,
    menu_id: 1,
    name: 'Burger',
    price: 10.99,
    category: 'Main',
    maxStock: 10,
  });

  const state = cartStore.getState();
  expect(state.items.length).toBe(1);
  expect(state.items[0].dish_id).toBe(1);
  expect(state.items[0].quantity).toBe(1);
});

    it('increments quantity when adding existing item', () => {
      const { addItem } = cartStore.getState();
      
      const item = {
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      };

      addItem(item);
      addItem(item);

      const state = cartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('does not exceed MAX_QTY_PER_ITEM (5)', () => {
      const { addItem } = cartStore.getState();
      
      const item = {
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      };

      // Try to add 10 times
      for (let i = 0; i < 10; i++) {
        addItem(item);
      }

      const state = cartStore.getState();
      expect(state.items[0].quantity).toBe(5); // Should cap at 5
    });

    it('does not exceed maxStock limit', () => {
      const { addItem } = cartStore.getState();
      
      const item = {
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 3, // Only 3 in stock
      };

      // Try to add 10 times
      for (let i = 0; i < 10; i++) {
        addItem(item);
      }

      const state = cartStore.getState();
      expect(state.items[0].quantity).toBe(3); // Should cap at stock limit
    });

    it('does not add more items when MAX_TOTAL_ITEMS (5) is reached', () => {
      const { addItem } = cartStore.getState();

      // Add 5 different items (1 each)
      for (let i = 1; i <= 5; i++) {
        addItem({
          dish_id: i,
          menu_id: 1,
          name: `Item ${i}`,
          price: 10,
          category: 'Main',
          maxStock: 10,
        });
      }

      let state = cartStore.getState();
      expect(state.items.length).toBe(5);

      // Try to add a 6th item
      addItem({
        dish_id: 6,
        menu_id: 1,
        name: 'Item 6',
        price: 10,
        category: 'Main',
        maxStock: 10,
      });

      state = cartStore.getState();
      // Should still be 5 items
      expect(state.items.length).toBe(5);
    });
  });

  describe('removeItem', () => {
    it('removes an item from the cart', () => {
      const { addItem, removeItem } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      let state = cartStore.getState();
      expect(state.items.length).toBe(1);

      removeItem(1);

      state = cartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('removes only the specified item', () => {
      const { addItem, removeItem } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      addItem({
        dish_id: 2,
        menu_id: 1,
        name: 'Pizza',
        price: 12.99,
        category: 'Main',
        maxStock: 10,
      });

      let state = cartStore.getState();
      expect(state.items.length).toBe(2);

      removeItem(1);

      state = cartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].dish_id).toBe(2);
    });

    it('does nothing when removing non-existent item', () => {
      const { addItem, removeItem } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      removeItem(999); // Non-existent ID

      const state = cartStore.getState();
      expect(state.items.length).toBe(1);
    });
  });

  describe('updateQuantity', () => {
    it('increases quantity when delta is positive', () => {
      const { addItem, updateQuantity } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      updateQuantity(1, 2); // Add 2 more

      const state = cartStore.getState();
      expect(state.items[0].quantity).toBe(3);
    });

    it('decreases quantity when delta is negative', () => {
      const { addItem, updateQuantity } = cartStore.getState();

      const item = {
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      };

      // Add 3 times
      addItem(item);
      addItem(item);
      addItem(item);

      let state = cartStore.getState();
      expect(state.items[0].quantity).toBe(3);

      updateQuantity(1, -1); // Remove 1

      state = cartStore.getState();
      expect(state.items[0].quantity).toBe(2);
    });

    it('removes item when quantity reaches 0', () => {
      const { addItem, updateQuantity } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      updateQuantity(1, -1); // Decrease by 1 (1 - 1 = 0)

      const state = cartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('does not exceed MAX_QTY_PER_ITEM when increasing', () => {
      const { addItem, updateQuantity } = cartStore.getState();

      const item = {
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      };

      // Add to quantity 4
      addItem(item);
      addItem(item);
      addItem(item);
      addItem(item);

      let state = cartStore.getState();
      expect(state.items[0].quantity).toBe(4);

      updateQuantity(1, 5); // Try to add 5 more

      state = cartStore.getState();
      expect(state.items[0].quantity).toBe(5); // Should cap at 5
    });

    it('does not exceed maxStock when increasing', () => {
      const { addItem, updateQuantity } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 3,
      });

      updateQuantity(1, 10); // Try to add 10

      const state = cartStore.getState();
      expect(state.items[0].quantity).toBe(3); // Should cap at stock
    });

    it('does nothing when item does not exist', () => {
      const { updateQuantity } = cartStore.getState();

      updateQuantity(999, 5); // Non-existent item

      const state = cartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('does not increase when MAX_TOTAL_ITEMS is reached', () => {
      const { addItem, updateQuantity } = cartStore.getState();

      // Add 5 different items
      for (let i = 1; i <= 5; i++) {
        addItem({
          dish_id: i,
          menu_id: 1,
          name: `Item ${i}`,
          price: 10,
          category: 'Main',
          maxStock: 10,
        });
      }

      const totalBefore = cartStore.getState().totalItems();
      expect(totalBefore).toBe(5);

      // Try to increase quantity of first item
      updateQuantity(1, 1);

      const totalAfter = cartStore.getState().totalItems();
      expect(totalAfter).toBe(5); // Should still be 5
    });
  });

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const { addItem, clearCart } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      addItem({
        dish_id: 2,
        menu_id: 1,
        name: 'Pizza',
        price: 12.99,
        category: 'Main',
        maxStock: 10,
      });

      let state = cartStore.getState();
      expect(state.items.length).toBe(2);

      clearCart();

      state = cartStore.getState();
      expect(state.items.length).toBe(0);
    });
  });

  describe('toggleCart', () => {
    it('opens cart when closed', () => {
      const { toggleCart, isOpen } = cartStore.getState();

      expect(isOpen).toBe(false);

      toggleCart();

      expect(cartStore.getState().isOpen).toBe(true);
    });

    it('closes cart when open', () => {
      const { toggleCart } = cartStore.getState();

      cartStore.setState({ isOpen: true });

      expect(cartStore.getState().isOpen).toBe(true);

      toggleCart();

      expect(cartStore.getState().isOpen).toBe(false);
    });
  });

  describe('totalPrice', () => {
    it('calculates correct total for single item', () => {
      const { addItem, totalPrice } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.50,
        category: 'Main',
        maxStock: 10,
      });

      expect(totalPrice()).toBe(10.50);
    });

    it('calculates correct total for multiple quantities', () => {
      const { addItem, totalPrice } = cartStore.getState();

      const item = {
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.00,
        category: 'Main',
        maxStock: 10,
      };

      addItem(item);
      addItem(item);
      addItem(item);

      expect(totalPrice()).toBe(30.00);
    });

    it('calculates correct total for multiple items', () => {
      const { addItem, totalPrice } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.00,
        category: 'Main',
        maxStock: 10,
      });

      addItem({
        dish_id: 2,
        menu_id: 1,
        name: 'Pizza',
        price: 15.50,
        category: 'Main',
        maxStock: 10,
      });

      expect(totalPrice()).toBe(25.50);
    });

    it('returns 0 for empty cart', () => {
      const { totalPrice } = cartStore.getState();

      expect(totalPrice()).toBe(0);
    });
  });

  describe('totalItems', () => {
    it('counts single item correctly', () => {
      const { addItem, totalItems } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      expect(totalItems()).toBe(1);
    });

    it('counts multiple quantities correctly', () => {
      const { addItem, totalItems } = cartStore.getState();

      const item = {
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      };

      addItem(item);
      addItem(item);
      addItem(item);

      expect(totalItems()).toBe(3);
    });

    it('counts multiple different items correctly', () => {
      const { addItem, totalItems } = cartStore.getState();

      addItem({
        dish_id: 1,
        menu_id: 1,
        name: 'Burger',
        price: 10.99,
        category: 'Main',
        maxStock: 10,
      });

      addItem({
        dish_id: 2,
        menu_id: 1,
        name: 'Pizza',
        price: 12.99,
        category: 'Main',
        maxStock: 10,
      });

      expect(totalItems()).toBe(2);
    });

    it('returns 0 for empty cart', () => {
      const { totalItems } = cartStore.getState();

      expect(totalItems()).toBe(0);
    });
  });
});
