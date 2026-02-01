import { useState } from "react";

export const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const SAULT_BLUE = "#0B6FA4";
  const SAULT_BLUE_DARK = "#095c87";
  const FONT_STACK =
    "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email.includes("@saultcollege.ca")) {
        alert("Login successful!");
        window.location.href = "/menu";
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${SAULT_BLUE} 0%, ${SAULT_BLUE_DARK} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ maxWidth: "450px", width: "100%" }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              fontWeight: 900,
              fontSize: "32px",
              color: SAULT_BLUE,
            }}
          >
            G2G
          </div>

          <h1
            style={{
              fontSize: "42px",
              fontWeight: 900,
              color: "white",
              marginBottom: "10px",
              letterSpacing: "-0.5px",
            }}
          >
            Gourmet2Go
          </h1>

          <p style={{ fontSize: "16px", color: "#dbeafe" }}>
            Fresh meals prepared by Sault College culinary students
          </p>
        </div>

        
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            padding: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#1f2937",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Sign In
          </h2>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "25px",
              }}
            >
              {error}
            </div>
          )}

          
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@saultcollege.ca"
              disabled={isLoading}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: FONT_STACK,
              }}
              onFocus={(e) => (e.target.style.borderColor = SAULT_BLUE)}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

        
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: FONT_STACK,
              }}
              onFocus={(e) => (e.target.style.borderColor = SAULT_BLUE)}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: SAULT_BLUE,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = SAULT_BLUE_DARK;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = SAULT_BLUE;
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          
          <div
            style={{
              marginTop: "25px",
              paddingTop: "25px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                textAlign: "center",
                marginBottom: "12px",
              }}
            >
              Demo Credentials
            </p>

            <p style={{ fontSize: "12px", textAlign: "center", color: "#374151" }}>
              user@saultcollege.ca / admin@saultcollege.ca <br />
              (Password: any value)
            </p>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#dbeafe",
            fontSize: "14px",
            marginTop: "25px",
          }}
        >
          Access restricted to Sault College students and staff
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
