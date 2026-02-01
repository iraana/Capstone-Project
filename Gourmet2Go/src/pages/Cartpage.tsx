import { useMemo, useState } from "react";

export const Cartpage = () => {
  // ✅ Sault College theme (single source of truth)
  const BRAND = useMemo(
    () => ({
      blue: "#0B6FA4", // Sault College blue
      blueDark: "#095c87",
      green: "#6F8F1F",
      greenDark: "#5f7c1a",
      bg: "#f9fafb",
      text: "#1f2937",
      muted: "#6b7280",
      line: "#e5e7eb",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
    }),
    []
  );

  const styles = useMemo(
    () => ({
      page: { minHeight: "100vh", backgroundColor: BRAND.bg, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" } as React.CSSProperties,
      header: {
        background: BRAND.blue,
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      } as React.CSSProperties,
      nav: { display: "flex", gap: "20px" } as React.CSSProperties,
      navLink: { color: "white", textDecoration: "none", fontWeight: 600 } as React.CSSProperties,
      container: { maxWidth: 1200, margin: "0 auto", padding: "50px 30px" } as React.CSSProperties,

      h1: { fontSize: 42, fontWeight: 900, color: BRAND.text, marginBottom: 10, letterSpacing: "-0.5px" } as React.CSSProperties,
      pMuted: { fontSize: 16, color: BRAND.muted } as React.CSSProperties,

      bannerWarn: {
        marginBottom: 30,
        backgroundColor: "#fef3c7",
        borderLeft: "4px solid #f59e0b",
        padding: 16,
        borderRadius: "0 8px 8px 0",
      } as React.CSSProperties,
      grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 30 } as React.CSSProperties,

      card: { backgroundColor: "white", borderRadius: 10, padding: 30, boxShadow: BRAND.shadow } as React.CSSProperties,
      cardTitle: { fontSize: 20, fontWeight: 800, marginBottom: 25, color: BRAND.text } as React.CSSProperties,

      itemRow: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        paddingBottom: 25,
      } as React.CSSProperties,
      itemDivider: { borderBottom: `1px solid ${BRAND.line}` } as React.CSSProperties,

      iconCircle: {
        width: 64,
        height: 64,
        backgroundColor: "#dbeafe",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      } as React.CSSProperties,

      itemName: { fontSize: 16, fontWeight: 700, color: BRAND.text, marginBottom: 5 } as React.CSSProperties,
      priceBlue: { fontSize: 16, fontWeight: 900, color: BRAND.blue } as React.CSSProperties,

      qtyBox: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        overflow: "hidden",
      } as React.CSSProperties,
      qtyBtn: {
        padding: "8px 12px",
        backgroundColor: "#f3f4f6",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
        fontWeight: 900,
      } as React.CSSProperties,
      qtyValue: { padding: "8px 16px", backgroundColor: "white", fontWeight: 700, fontSize: 16 } as React.CSSProperties,

      removeBtn: {
        padding: 8,
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#ef4444",
        borderRadius: "50%",
      } as React.CSSProperties,

      smallMeta: { marginTop: 25, paddingTop: 20, borderTop: `1px solid ${BRAND.line}`, fontSize: 14, color: BRAND.muted } as React.CSSProperties,

      summaryCard: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 25,
        boxShadow: BRAND.shadow,
        position: "sticky",
        top: 30,
      } as React.CSSProperties,

      row: { display: "flex", justifyContent: "space-between", color: "#4b5563" } as React.CSSProperties,
      totalRow: {
        borderTop: `2px solid ${BRAND.line}`,
        paddingTop: 15,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 18,
        fontWeight: 900,
      } as React.CSSProperties,

      primaryBtn: {
        width: "100%",
        padding: 12,
        backgroundColor: BRAND.blue,
        color: "white",
        border: "none",
        borderRadius: 8,
        fontWeight: 800,
        fontSize: 16,
        cursor: "pointer",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      } as React.CSSProperties,

      secondaryLink: {
        display: "block",
        width: "100%",
        padding: 12,
        backgroundColor: "#f3f4f6",
        color: "#374151",
        borderRadius: 8,
        fontWeight: 800,
        fontSize: 16,
        textAlign: "center",
        textDecoration: "none",
        boxSizing: "border-box",
      } as React.CSSProperties,

      helperList: {
        marginTop: 25,
        paddingTop: 20,
        borderTop: `1px solid ${BRAND.line}`,
        fontSize: 12,
        color: BRAND.muted,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      } as React.CSSProperties,

      emptyWrap: { maxWidth: 800, margin: "0 auto", padding: "50px 30px" } as React.CSSProperties,
      emptyCard: { textAlign: "center", padding: "60px 20px", backgroundColor: "white", borderRadius: 10, boxShadow: BRAND.shadow } as React.CSSProperties,
      emptyTitle: { fontSize: 28, fontWeight: 900, color: BRAND.text, marginBottom: 10 } as React.CSSProperties,

      footer: {
        backgroundColor: BRAND.blue, // ✅ FIXED: Sault College blue
        color: "white",
        padding: "40px 20px",
        marginTop: 50,
      } as React.CSSProperties,
    }),
    [BRAND]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock cart data - will be replaced with real cart from backend/context later
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Egg Drop Soup", price: 5.0, quantity: 2, stock: 15 },
    { id: "2", name: "Korean Fried Chicken with Sriracha Potato Salad", price: 11.0, quantity: 1, stock: 10 },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(newQuantity, Math.min(5, item.stock)) } : item
      )
    );
  };

  const removeFromCart = (id: string) => setCartItems((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    alert("Order placed successfully! You will receive a confirmation email shortly.");
    clearCart();
    setIsSubmitting(false);
    window.location.href = "/orders";
  };

  const Header = () => (
    <header style={styles.header}>
      <div>
        <span style={{ fontSize: 20, fontWeight: 900 }}>Gourmet2Go</span>
      </div>
      <nav style={styles.nav}>
        <a href="/about" style={styles.navLink}>
          About
        </a>
        <a href="/menu" style={styles.navLink}>
          Menu
        </a>
        <a href="/orders" style={styles.navLink}>
          Orders
        </a>
        <a href="/cart" style={styles.navLink}>
          Cart
        </a>
        <a href="/signup" style={styles.navLink}>
          Sign Up
        </a>
      </nav>
    </header>
  );

  // ✅ UPDATED footer info + Sault College blue
  const Footer = () => (
    <footer style={styles.footer}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 40,
          paddingBottom: 30,
        }}
      >
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Contact</h4>
          <p style={{ margin: "6px 0" }}>425 Northern Ave</p>
          <p style={{ margin: "6px 0" }}>Sault Ste. Marie, ON, Canada</p>
          <p style={{ margin: "6px 0" }}>P6A 5L3</p>
          <p style={{ margin: "6px 0" }}>Phone: 1-705-759-2554</p>
        </div>

        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Hours</h4>
          <p style={{ margin: "6px 0" }}>Wednesday: 12:15 – 12:45 PM</p>
          <p style={{ margin: "6px 0" }}>Thursday: 12:15 – 12:45 PM</p>
          <p style={{ margin: "10px 0 0", opacity: 0.85 }}>Hours may vary by semester</p>
        </div>

        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Quick Links</h4>
          <p style={{ margin: "6px 0" }}>
            <a href="/about" style={{ color: "white", textDecoration: "none" }}>
              About
            </a>
          </p>
          <p style={{ margin: "6px 0" }}>
            <a href="/menu" style={{ color: "white", textDecoration: "none" }}>
              Menu
            </a>
          </p>
          <p style={{ margin: "6px 0" }}>
            <a href="https://www.saultcollege.ca" target="_blank" rel="noreferrer" style={{ color: "white", textDecoration: "none" }}>
              Sault College
            </a>
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.25)",
          paddingTop: 20,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        © 2026 Sault College. All rights reserved.
      </div>
    </footer>
  );

 
  if (cartItems.length === 0) {
    return (
      <div style={styles.page}>
        <Header />

        <div style={styles.emptyWrap}>
          <div style={styles.emptyCard}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={{ ...styles.pMuted, marginBottom: 30 }}>Add some delicious items from the menu!</p>
            <a href="/menu" style={{ ...styles.secondaryLink, backgroundColor: BRAND.blue, color: "white" }}>
              Browse Menu
            </a>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

 
  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        
        <div style={{ marginBottom: 30 }}>
          <h1 style={styles.h1}>Your Cart</h1>
          <p style={styles.pMuted}>Review your order before submitting. Items can be altered until 2:30 PM.</p>
        </div>

        
        <div style={styles.bannerWarn}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 12, fontSize: 20 }}>⚠️</span>
            <p style={{ fontSize: 14, color: "#92400e", margin: 0 }}>
              Adding items to your cart does not reserve them. Items are reserved only after placing an order, and are released after closing.
            </p>
          </div>
        </div>

        <div style={styles.grid}>
          
          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Order #{new Date().getTime().toString().slice(-8)}</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
                {cartItems.map((item, index) => {
                  const maxAllowed = Math.min(5, item.stock);
                  const isLast = index === cartItems.length - 1;

                  return (
                    <div
                      key={item.id}
                      style={{
                        ...styles.itemRow,
                        ...(isLast ? {} : styles.itemDivider),
                      }}
                    >
                      
                      <div style={styles.iconCircle}>
                        <span style={{ fontSize: 32 }}>🍽️</span>
                      </div>

                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <p style={styles.priceBlue}>${item.price.toFixed(2)}</p>
                      </div>

                     
                      <div style={styles.qtyBox}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>
                          -
                        </button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= maxAllowed}
                          style={{
                            ...styles.qtyBtn,
                            cursor: item.quantity >= maxAllowed ? "not-allowed" : "pointer",
                            opacity: item.quantity >= maxAllowed ? 0.5 : 1,
                          }}
                        >
                          +
                        </button>
                      </div>

                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        title="Remove from cart"
                        style={styles.removeBtn}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <span style={{ fontSize: 20 }}>🗑️</span>
                      </button>
                    </div>
                  );
                })}
              </div>

             
              <div style={styles.smallMeta}>
                {itemCount} {itemCount === 1 ? "item" : "items"} in cart
              </div>
            </div>
          </div>

          
          <div>
            <div style={styles.summaryCard}>
              <h2 style={styles.cardTitle}>Order Summary</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 15, marginBottom: 25 }}>
                <div style={styles.row}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={styles.row}>
                  <span>Tax (13% HST)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Total</span>
                  <span style={{ color: BRAND.blue }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                style={{ ...styles.primaryBtn, opacity: isSubmitting ? 0.7 : 1 }}
                onMouseOver={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = BRAND.blueDark;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.blue;
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              <a href="/menu" style={styles.secondaryLink}>
                Back to Menu
              </a>

              <div style={styles.helperList}>
                <p style={{ display: "flex", alignItems: "flex-start", margin: 0 }}>
                  <span style={{ marginRight: 8 }}>ℹ️</span>
                  Payment by card only at pickup (no cash)
                </p>
                <p style={{ display: "flex", alignItems: "flex-start", margin: 0 }}>
                  <span style={{ marginRight: 8 }}>📍</span>
                  Pickup: Room L1170, Wed/Thu 12:15-12:45 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Footer />
    </div>
  );
};
