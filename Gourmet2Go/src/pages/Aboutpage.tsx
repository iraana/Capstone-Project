export const Aboutpage = () => {
  
  const brandBlue = "#0b6fa4";   
  const pageBg = "#f6f8fb";

  const fontFamily =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial';

  const textDark = "#111827";
  const textBody = "#374151";
  const textMuted = "#6b7280";

  const container = { maxWidth: "1200px", margin: "0 auto" };

  const card = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 10px 28px rgba(16,24,40,0.08)",
    border: "1px solid rgba(17,24,39,0.06)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: pageBg, fontFamily }}>

      
      <header
        style={{
          backgroundColor: brandBlue,
          color: "white",
          padding: "16px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <span style={{ fontSize: "20px", fontWeight: 800 }}>Gourmet2Go</span>

        <nav style={{ display: "flex", gap: "22px" }}>
          {["About", "Menu", "Orders", "Cart", "Sign Up"].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase().replace(" ", "")}`}
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "15px",
                opacity: 0.95,
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      
      
<div
  style={{
    position: "relative",
    backgroundColor: brandBlue,
    padding: "80px 20px",
    textAlign: "center",
    color: "white",
    overflow: "hidden",
  }}
>
  
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage:
        "url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.35, 
      transform: "scale(1.02)",
    }}
  />

  
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: brandBlue,
      opacity: 0.45, 
    }}
  />

  
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.00) 100%)",
      opacity: 0.55,
    }}
  />

  
  <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
    <h1
      style={{
        fontSize: "56px",
        fontWeight: 900,
        marginBottom: "12px",
        letterSpacing: "-0.03em",
      }}
    >
      Gourmet 2 Go
    </h1>
    <p style={{ fontSize: "20px", opacity: 0.95 }}>
      Fresh meals prepared by Sault College culinary students
    </p>
  </div>
</div>


      
      <div style={{ ...container, padding: "60px 30px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "48px",
          }}
        >
         
          <div>
            <h2
              style={{
                fontSize: "34px",
                fontWeight: 800,
                marginBottom: "18px",
                color: textDark,
              }}
            >
              What Makes It Special
            </h2>

            <div style={{ color: textBody, lineHeight: "1.85", fontSize: "16.5px" }}>
              <p style={{ marginBottom: "16px" }}>
                Gourmet2Go offers delicious, freshly prepared meals made by 
                Sault College culinary students. It’s your chance to enjoy high-quality,
                chef-style dishes right here on campus!
              </p>

              <p style={{ marginBottom: "16px" }}>
                Every week, our culinary team creates exciting new menus featuring soups,
                entrées, and more. Limited quantities are prepared fresh each service day,
                so ordering early helps ensure you don’t miss out.
              </p>

              <p>
                Pre-ordering through our app is quick and convenient—browse the weekly
                menu, select your favorites, and pick them up during scheduled hours.
              </p>
            </div>

            <div
              style={{
                marginTop: "36px",
                backgroundColor: "#eafaf2",
                borderLeft: "6px solid #22c55e",
                padding: "26px",
                borderRadius: "12px",
              }}
            >
              <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "18px" }}>
                How It Works
              </h3>

              {[
                "Browse the weekly menu and select your meals",
                "Place your order before the cutoff time",
                "Receive email confirmation with pickup details",
                "Pick up your meal and pay in person",
              ].map((step, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: "14px", marginBottom: "14px" }}
                >
                  <span
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#22c55e",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ paddingTop: "6px" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div style={card}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>
                🕐 Service Hours
              </h3>

              {[
                ["Wednesday", "12:15 - 12:45 PM"],
                ["Thursday", "12:15 - 12:45 PM"],
              ].map(([day, time]) => (
                <div
                  key={day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid #eef2f7",
                  }}
                >
                  <strong>{day}</strong>
                  <span>{time}</span>
                </div>
              ))}

              <p style={{ fontSize: "14px", color: textMuted, marginTop: "12px" }}>
                Service times may vary each semester.
              </p>
            </div>

            
            <div style={card}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>
                ℹ️ Important Rules
              </h3>

              {[
                "One active order per person at a time",
                "Maximum 5 of the same item per order",
                "Orders must be placed before daily cutoff time",
                "Payment is made in person at pickup",
                "Items available on a first-come, first-served basis",
              ].map((rule, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ color: "#22c55e", fontWeight: 800 }}>✓</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>

           
            <div
              style={{
                backgroundColor: brandBlue,
                color: "white",
                padding: "26px",
                borderRadius: "12px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "14px" }}>
                📍 Pickup Location
              </h3>
              <p style={{ fontWeight: 700, marginBottom: "8px" }}>
                Room L1170 – Culinary Department
              </p>
              <p style={{ fontSize: "14.5px", opacity: 0.95 }}>
                Located in the main building. You’ll receive an email with your pickup time
                when your order is ready.
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <footer
        style={{
          backgroundColor: brandBlue,
          color: "white",
          padding: "56px 30px",
        }}
      >
        <div
          style={{
            ...container,
            display: "flex",
            justifyContent: "space-between",
            gap: "60px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h4>Contact</h4>
            <p>443 Northern Ave</p>
            <p>Sault Ste. Marie, ON Canada</p>
            <p>Phone: 1.705.759.5711</p>
          </div>

          <div>
            <h4>Hours</h4>
            <p>Wednesday: 12:15–12:45 PM</p>
            <p>Thursday: 12:15–12:45 PM</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p>About</p>
            <p>Menu</p>
            <p>Sault College</p>
          </div>
        </div>

        <div
          style={{
            ...container,
            margin: "30px auto 20px",
            borderTop: "1px solid rgba(255,255,255,0.3)",
          }}
        />

        <p style={{ textAlign: "center", fontSize: "14px" }}>
          © 2026 Sault College. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
