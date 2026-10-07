'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderEvent, SizeOption, StitchingOption } from '@/lib/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, PINCODE_DATABASE } from '@/lib/data';
import { generateSampleOrders } from '@/lib/sampleOrders';
import { getCartRewards } from '@/lib/cartRewards';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  formatPrice: (amountInINR: number) => string;
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: SizeOption, stitching?: StitchingOption, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  cartSubtotal: number;
  cartDiscount: number; // promo + milestone
  promoDiscount: number;
  milestoneDiscount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  unavailableItems: CartItem[];
  clearCart: () => void;
  
  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Orders
  hydrated: boolean;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'createdAt' | 'history'>) => Order;
  updateOrder: (orderId: string, updates: Partial<Order> | ((order: Order) => Partial<Order>), event?: Omit<OrderEvent, 'at'>) => void;
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus'], note?: string) => void;
  commitOrderStock: (order: Order) => void;
  loadSampleOrders: () => void;
  clearSampleOrders: () => void;
  
  // Admin Product Catalog
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => void;
  updateProduct: (id: string, updates: Partial<Product>, options?: { silent?: boolean }) => void;
  deleteProduct: (id: string) => void;

  // Logistics / Pin Code
  checkPincode: (pincode: string) => { serviceable: boolean; city?: string; state?: string; days?: number; cod?: boolean };

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const PROMO_CODES: Record<string, { pct: number; message: string }> = {
  ELEGANCE: { pct: 0.1, message: 'Promo code applied: 10% off' },
  ROYAL10: { pct: 0.1, message: 'Promo code applied: 10% off' },
  FIRST15: { pct: 0.15, message: 'First order special: 15% off applied' }
};

// Admin edits are kept in localStorage; they are dropped whenever the shipped catalog changes so shoppers never see stale data
const CATALOG_VERSION = (() => {
  const json = JSON.stringify(INITIAL_PRODUCTS);
  let h = 0;
  for (let i = 0; i < json.length; i++) h = (h * 31 + json.charCodeAt(i)) | 0;
  return String(h);
})();

const isPurchasable = (p?: Product) => !!p && p.inStock && p.stockCount > 0;

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [storedCart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);


  // LocalStorage sync
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('svayam_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCart = localStorage.getItem('svayam_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('svayam_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedProducts = localStorage.getItem('svayam_products');
      if (savedProducts && localStorage.getItem('svayam_catalog_version') === CATALOG_VERSION) setProducts(JSON.parse(savedProducts));

      const savedPromo = localStorage.getItem('svayam_promo');
      if (savedPromo && PROMO_CODES[savedPromo]) setPromoCode(savedPromo);
    } catch {
      // ignore SSR/hydration storage errors
    }
    setHydrated(true);
  }, []);

  // Orders & catalog are persisted locally until a backend/database is connected
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('svayam_orders', JSON.stringify(orders));
    } catch {}
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('svayam_products', JSON.stringify(products));
      localStorage.setItem('svayam_catalog_version', CATALOG_VERSION);
    } catch {}
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (promoCode) localStorage.setItem('svayam_promo', promoCode);
      else localStorage.removeItem('svayam_promo');
    } catch {}
  }, [promoCode, hydrated]);

  // Cart lines always reflect the live catalog (price, stock, images), not the snapshot taken when added
  const cart: CartItem[] = storedCart.map((item) => {
    const live = products.find((p) => p.id === item.product.id);
    return live ? { ...item, product: live, unitPrice: live.price + (item.selectedStitching?.price || 0) } : item;
  });
  const unavailableItems = cart.filter((item) => !isPurchasable(products.find((p) => p.id === item.product.id)));
  const availableCart = cart.filter((item) => !unavailableItems.includes(item));

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('svayam_cart', JSON.stringify(newCart));
    } catch {}
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const formatPrice = (amountInINR: number): string =>
    `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;

  const addToCart = (product: Product, size: SizeOption, stitching?: StitchingOption, quantity = 1) => {
    if (!isPurchasable(product)) {
      showToast(`"${product.title}" is sold out`, 'error');
      return;
    }
    const cartItemId = `${product.id}-${size}-${stitching?.id || 'none'}`;
    const unitPrice = product.price + (stitching?.price || 0);

    const existingIndex = storedCart.findIndex((item) => item.id === cartItemId);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = storedCart.map((item, i) => (i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      updated = [
        ...storedCart,
        {
          id: cartItemId,
          product,
          selectedSize: size,
          selectedStitching: stitching,
          quantity,
          unitPrice
        }
      ];
    }

    saveCartToStorage(updated);
    // Opening the bag is the confirmation; a toast here would cover the checkout button
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const updated = storedCart.filter((item) => item.id !== cartItemId);
    saveCartToStorage(updated);
    showToast('Item removed from shopping bag', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = storedCart.map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
    setPromoCode('');
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const promo = PROMO_CODES[clean];
    if (!promo) {
      showToast(`"${clean}" isn't a valid code`, 'error');
      return false;
    }
    setPromoCode(clean);
    showToast(promo.message, 'success');
    return true;
  };

  const removePromoCode = () => {
    setPromoCode('');
    showToast('Promo code removed', 'info');
  };

  // Sold-out lines stay visible in the bag but are never charged
  const cartSubtotal = availableCart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const promoDiscount = Math.round(cartSubtotal * (PROMO_CODES[promoCode]?.pct ?? 0));
  const milestoneDiscount = getCartRewards(cartSubtotal).discount;
  const cartDiscount = promoDiscount + milestoneDiscount;

  const toggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      showToast('Removed from wishlist', 'info');
    } else {
      updated = [...wishlist, productId];
      showToast('Added to wishlist', 'success');
    }
    setWishlist(updated);
    try {
      localStorage.setItem('svayam_wishlist', JSON.stringify(updated));
    } catch {}
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'createdAt' | 'history'>): Order => {
    const now = new Date();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${now.getTime()}`,
      orderNumber: `HEVA-${now.getFullYear()}-${randomNum}`,
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: now.toISOString(),
      history: [{ at: now.toISOString(), label: 'Order created' }]
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrder = (
    orderId: string,
    updates: Partial<Order> | ((order: Order) => Partial<Order>),
    event?: Omit<OrderEvent, 'at'>
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const patch = typeof updates === 'function' ? updates(ord) : updates;
        const history = event ? [...(ord.history || []), { ...event, at: new Date().toISOString() }] : ord.history;
        return { ...ord, ...patch, history };
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: Order['fulfillmentStatus'], note?: string) => {
    updateOrder(orderId, { fulfillmentStatus: status }, { label: `Status changed to ${status}`, note });
    showToast(`Order status updated to "${status}"`, 'info');
  };

  const commitOrderStock = (order: Order) => {
    setProducts((prev) =>
      prev.map((p) => {
        const qty = order.items.filter((i) => i.productId === p.id).reduce((sum, i) => sum + i.quantity, 0);
        if (!qty) return p;
        const stockCount = Math.max(0, p.stockCount - qty);
        return { ...p, stockCount, inStock: stockCount > 0 };
      })
    );
  };

  const loadSampleOrders = () => {
    setOrders((prev) => [...prev.filter((o) => !o.isSample), ...generateSampleOrders(products)]);
    showToast('Sample orders loaded', 'success');
  };

  const clearSampleOrders = () => {
    setOrders((prev) => prev.filter((o) => !o.isSample));
    showToast('Sample orders removed', 'info');
  };

  // Admin Catalog Handlers
  const addProduct = (newProdData: Omit<Product, 'id' | 'slug'>) => {
    const slug = newProdData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      slug
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title}" published to catalog`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>, options?: { silent?: boolean }) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (!options?.silent) showToast('Product specifications updated', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product archived from catalog', 'info');
  };

  // Pin code serviceability
  const checkPincode = (pincode: string) => {
    const cleanPin = pincode.trim();
    if (PINCODE_DATABASE[cleanPin]) {
      const match = PINCODE_DATABASE[cleanPin];
      return {
        serviceable: true,
        city: match.city,
        state: match.state,
        days: match.days,
        cod: match.cod
      };
    }
    // standard fallback for 6-digit Indian PIN codes
    if (cleanPin.length === 6 && /^\d+$/.test(cleanPin)) {
      return {
        serviceable: true,
        city: 'India Hub',
        state: 'Express Courier Network',
        days: 4,
        cod: true
      };
    }
    return { serviceable: false };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        formatPrice,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartSubtotal,
        cartDiscount,
        promoDiscount,
        milestoneDiscount,
        promoCode,
        applyPromoCode,
        removePromoCode,
        unavailableItems,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        hydrated,
        orders,
        createOrder,
        updateOrder,
        updateOrderStatus,
        commitOrderStock,
        loadSampleOrders,
        clearSampleOrders,
        addProduct,
        updateProduct,
        deleteProduct,
        checkPincode,
        toasts,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
