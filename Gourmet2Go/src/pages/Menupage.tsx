import { useState } from "react";

export const Menupage = () => {
  const SAULT_BLUE = "#0b6fa3";
  const BG = "#f9fafb";
  const TEXT = "#1f2937";
  const MUTED = "#6b7280";
  const GREEN = "#10b981";

  const [selectedDay, setSelectedDay] = useState<"Wednesday" | "Thursday">("Wednesday");

  
  const pageFont = {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  };


  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const sectionTitle = {
    fontSize: "28px",
    fontWeight: 900,
    color: TEXT,
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
  };

  const sectionBar = {
    width: "8px",
    height: "32px",
    backgroundColor: GREEN,
    borderRadius: "4px",
    marginRight: "12px",
  };

  const MenuCard = ({ item }: { item: any }) => (
    <div style={{ ...cardStyle, overflow: "hidden" }}>
      <img
        src={item.img}
        alt={item.name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 900, color: TEXT, marginBottom: "8px" }}>
          {item.name}
        </h3>

        {item.desc ? (
          <p style={{ fontSize: "14px", color: MUTED, marginBottom: "10px" }}>{item.desc}</p>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: 900, color: SAULT_BLUE }}>
            ${item.price.toFixed(2)}
          </span>
          <span style={{ fontSize: "14px", color: GREEN, fontWeight: 700 }}>
            ✓ {item.available} available
          </span>
        </div>

        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: SAULT_BLUE,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 800,
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  const Section = ({ title, items }: { title: string; items: any[] }) => (
    <div style={{ marginBottom: "50px" }}>
      <h2 style={sectionTitle}>
        <span style={sectionBar} />
        {title}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px" }}>
        {items.map((item) => (
          <MenuCard key={item.name} item={item} />
        ))}
      </div>
    </div>
  );

  
  const soups = [
    { name: "Egg Drop Soup", price: 5, available: 15, img: "/images/EggDropSoup.jpg" },
    { name: "Corn Chowder", price: 5, available: 12, img: "/images/CornChowder.jpg" },
  ];

  const bowls = [
    {
      name: "Mediterranean Quinoa Bowl",
      price: 10,
      available: 10,
      img: "https://via.placeholder.com/400x250/90EE90/333333?text=Quinoa+Bowl",
    },
  ];

  const entrees = [
    {
      name: "Duck Confit Tacos",
      price: 12,
      available: 8,
      img: "https://via.placeholder.com/400x250/FF6347/333333?text=Duck+Tacos",
    },
    {
      name: "Korean Fried Chicken",
      desc: "with Sriracha Potato Salad",
      price: 11,
      available: 10,
      img: "https://via.placeholder.com/400x250/DC143C/333333?text=Korean+Chicken",
    },
    {
      name: "Beef Vegetable Soba Noodle Stir Fry",
      price: 10,
      available: 12,
      img: "https://via.placeholder.com/400x250/8B4513/FFFFFF?text=Soba+Noodles",
    },
    {
      name: "Tikka Masala",
      desc: "with Basmati Rice",
      price: 10,
      available: 15,
      img: "https://via.placeholder.com/400x250/FF8C00/333333?text=Tikka+Masala",
    },
    {
      name: "Seafood Linguine",
      desc: "with Cognac Cream Sauce",
      price: 12,
      available: 8,
      img: "https://via.placeholder.com/400x250/4682B4/FFFFFF?text=Seafood+Linguine",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...pageFont }}>
      
      <header
        style={{
          background: SAULT_BLUE,
          color: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ fontSize: "20px", fontWeight: 900 }}>Gourmet2Go</span>
        </div>

        <nav style={{ display: "flex", gap: "20px" }}>
          <a href="/about" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
            About
          </a>
          <a href="/menu" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
            Menu
          </a>
          <a href="/orders" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
            Orders
          </a>
          <a href="/cart" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
            Cart
          </a>
          <a href="/signup" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
            Sign Up
          </a>
        </nav>
      </header>

      
      <div style={{ position: "relative", height: "250px", backgroundColor: SAULT_BLUE }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18, 
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            padding: "20px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "10px" }}>
              This Week&apos;s Menu
            </h1>
            <p style={{ fontSize: "18px", opacity: 0.95, fontWeight: 600 }}>
              Fresh meals prepared daily by our culinary students
            </p>
          </div>
        </div>
      </div>

      
      <div style={{ backgroundColor: "#fef3c7", borderBottom: "2px solid #fbbf24", padding: "15px 20px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#92400e",
            fontWeight: 700,
          }}
        >
          <span style={{ marginRight: "10px", fontSize: "20px" }}>ℹ️</span>
          <span style={{ fontSize: "14px" }}>
            Service: Wednesday & Thursday 12:15–12:45 PM (Room L1170). Soups $5, Entrées $10–12.
            Card payment only. Items subject to change.
          </span>
        </div>
      </div>

      
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 30px" }}>
        
        <div
          style={{
            backgroundColor: GREEN,
            borderRadius: "10px",
            padding: "8px",
            display: "inline-flex",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
          {(["Wednesday", "Thursday"] as const).map((day) => {
            const active = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: active ? "white" : "transparent",
                  color: active ? GREEN : "white",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        
        <Section title="Soups" items={soups} />
        <Section title="Bowls" items={bowls} />
        <Section title="Entrées" items={entrees} />

        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px" }}>
          
          <div style={{ ...cardStyle, padding: "22px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 900, color: TEXT, marginBottom: "14px" }}>
              🕐 Service Hours
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eef2f7" }}>
              <span style={{ fontWeight: 700 }}>Wednesday</span>
              <span>12:15 - 12:45 PM</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span style={{ fontWeight: 700 }}>Thursday</span>
              <span>12:15 - 12:45 PM</span>
            </div>
            <p style={{ fontSize: "14px", color: MUTED, marginTop: "12px", lineHeight: 1.6 }}>
              Service times may vary each semester. Check weekly announcements for updates.
            </p>
          </div>

          
          <div style={{ ...cardStyle, padding: "22px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 900, color: TEXT, marginBottom: "14px" }}>
              ℹ️ Important Rules
            </h3>
            {[
              "One active order per person at a time",
              "Maximum 5 of the same item per order",
              "Orders must be placed before daily cutoff time",
              "Payment by card only at pickup (no cash accepted)",
              "Items available on a first-come, first-served basis",
            ].map((rule) => (
              <div key={rule} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                <span style={{ color: GREEN, fontWeight: 900 }}>✓</span>
                <span style={{ color: TEXT, fontSize: "14px", lineHeight: 1.6 }}>{rule}</span>
              </div>
            ))}
          </div>

         
          <div style={{ backgroundColor: SAULT_BLUE, color: "white", borderRadius: "10px", padding: "22px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "12px" }}>📍 Pickup Location</h3>
            <p style={{ fontSize: "16px", fontWeight: 800, marginBottom: "10px" }}>
              Room L1170 - Culinary Department
            </p>
            <p style={{ fontSize: "14px", opacity: 0.95, lineHeight: 1.7 }}>
              Located in the main building. You’ll receive pickup details when your order is ready.
            </p>
          </div>
        </div>
      </div>

      
      <footer style={{ backgroundColor: SAULT_BLUE, color: "white", padding: "50px 20px", marginTop: "60px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "30px", paddingBottom: "25px" }}>
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "12px" }}>Contact</h3>
              <p style={{ margin: "8px 0" }}>443 Northern Ave</p>
              <p style={{ margin: "8px 0" }}>Sault Ste. Marie, ON Canada, P6A 5L3</p>
              <p style={{ margin: "8px 0" }}>Phone: 1.705.759.5711</p>
            </div>

            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "12px" }}>Hours</h3>
              <p style={{ margin: "8px 0" }}>Wednesday: 12:15–12:45 PM</p>
              <p style={{ margin: "8px 0" }}>Thursday: 12:15–12:45 PM</p>
              <p style={{ margin: "8px 0", opacity: 0.9 }}>Hours may vary by semester</p>
            </div>

            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "12px" }}>Quick Links</h3>
              <p style={{ margin: "8px 0" }}>About</p>
              <p style={{ margin: "8px 0" }}>Menu</p>
              <p style={{ margin: "8px 0" }}>Sault College</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: "18px" }}>
            <p style={{ textAlign: "center", margin: 0, fontWeight: 700 }}>
              © 2026 Sault College. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
