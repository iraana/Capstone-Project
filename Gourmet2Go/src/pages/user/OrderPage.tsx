import { useState } from "react";

export const OrdersPage = () => {
  const SAULT_BLUE = "#0b6fa3"; 
  const BG = "#f9fafb";
  const TEXT = "#1f2937";
  const MUTED = "#6b7280";

  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  
  const mockOrders = [
    {
      id: "1",
      displayId: "#1001",
      date: "February 2, 2025",
      time: "2:30 PM",
      status: "completed",
      total: 18.0,
      items: [
        {
          id: "1",
          name: "Szechuan Shrimp Stir Fry with Rice",
          price: 9.0,
          quantity: 2,
          subtotal: 18.0,
        },
      ],
    },
    {
      id: "2",
      displayId: "#1002",
      date: "January 28, 2025",
      time: "3:45 PM",
      status: "completed",
      total: 15.5,
      items: [
        {
          id: "2",
          name: "Cream of Broccoli and Cheddar Soup",
          price: 6.5,
          quantity: 1,
          subtotal: 6.5,
        },
        {
          id: "3",
          name: "Szechuan Shrimp Stir Fry with Rice",
          price: 9.0,
          quantity: 1,
          subtotal: 9.0,
        },
      ],
    },
  ];

  const activeOrders = mockOrders.filter(
    (o) => o.status === "pending" || o.status === "in_progress"
  );
  const completedOrders = mockOrders.filter((o) => o.status === "completed");
  const displayOrders = activeTab === "active" ? activeOrders : completedOrders;

  const statusBadgeStyle = (status: string) => {
    if (status === "pending") return { backgroundColor: "#fef3c7", color: "#92400e" };
    if (status === "in_progress") return { backgroundColor: "#dbeafe", color: "#1e40af" };
    if (status === "completed") return { backgroundColor: "#e6f0f7", color: SAULT_BLUE }; 
    return { backgroundColor: "#fee2e2", color: "#991b1b" };
  };

  const statusText = (status: string) => {
    if (status === "pending") return "Pending";
    if (status === "in_progress") return "In Progress";
    if (status === "completed") return "Completed";
    return "Cancelled";
  };

  
  const pageFont = {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const primaryBtn = {
    backgroundColor: SAULT_BLUE,
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: 700 as const,
    cursor: "pointer",
  };

  const outlineBtn = {
    backgroundColor: "white",
    color: SAULT_BLUE,
    border: `2px solid ${SAULT_BLUE}`,
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: 700 as const,
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...pageFont }}>
    

      
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px 30px" }}>
      
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "44px", fontWeight: 800, color: TEXT, marginBottom: "8px" }}>
            My Orders
          </h1>
          <p style={{ fontSize: "16px", color: MUTED }}>
            View and manage your Gourmet2Go orders
          </p>
        </div>

        
        <div
          style={{
            ...cardStyle,
            padding: "8px",
            display: "inline-flex",
            gap: "8px",
            marginBottom: "35px",
          }}
        >
          <button
            onClick={() => setActiveTab("active")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "active" ? SAULT_BLUE : "transparent",
              color: activeTab === "active" ? "white" : TEXT,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Active Orders
            {activeOrders.length > 0 && (
              <span
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#10b981",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 800,
                  borderRadius: "999px",
                  padding: "2px 8px",
                }}
              >
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "history" ? SAULT_BLUE : "transparent",
              color: activeTab === "history" ? "white" : TEXT,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Order History
          </button>
        </div>

        
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {displayOrders.length > 0 ? (
            displayOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const totalWithTax = order.total * 1.13;

              return (
                <div key={order.id} style={cardStyle}>
                 
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "22px", fontWeight: 800, color: TEXT }}>
                        Order {order.displayId}
                      </h3>
                      <p style={{ fontSize: "14px", color: MUTED, marginTop: "6px" }}>
                        {order.date}, {order.time}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: 700,
                        ...statusBadgeStyle(order.status),
                      }}
                    >
                      {statusText(order.status)}
                    </span>
                  </div>

                  
                  <div style={{ marginBottom: "18px" }}>
                    {(isExpanded ? order.items : order.items.slice(0, 2)).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom: "1px solid #eef2f7",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              backgroundColor: "#e6f0f7",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              color: SAULT_BLUE,
                              fontWeight: 900,
                            }}
                          >
                            🍽️
                          </div>
                          <div>
                            <p style={{ fontSize: "15px", fontWeight: 700, color: TEXT }}>
                              {item.name}
                            </p>
                            <p style={{ fontSize: "13px", color: MUTED, marginTop: "3px" }}>
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span style={{ fontSize: "15px", fontWeight: 800, color: TEXT }}>
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {!isExpanded && order.items.length > 2 && (
                      <p style={{ fontSize: "14px", color: MUTED, marginTop: "10px" }}>
                        + {order.items.length - 2} more{" "}
                        {order.items.length - 2 === 1 ? "item" : "items"}
                      </p>
                    )}
                  </div>

                  
                  {isExpanded && (
                    <div
                      style={{
                        borderTop: "2px solid #eef2f7",
                        paddingTop: "18px",
                        marginBottom: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "18px", fontWeight: 900, color: TEXT }}>
                          Total
                        </span>
                        <span style={{ fontSize: "18px", fontWeight: 900, color: SAULT_BLUE }}>
                          ${totalWithTax.toFixed(2)}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: MUTED, textAlign: "right", marginTop: "6px" }}>
                        Includes 13% HST
                      </p>
                    </div>
                  )}

                  
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      style={{ flex: 1, ...(isExpanded ? outlineBtn : outlineBtn) }}
                    >
                      {isExpanded ? "Show Less" : "View Details"}
                    </button>

                    {activeTab === "history" && (
                      <button
                        style={{
                          flex: 1,
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 16px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ ...cardStyle, textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "70px", marginBottom: "12px" }}>📋</div>
              <h3 style={{ fontSize: "22px", fontWeight: 900, color: TEXT, marginBottom: "10px" }}>
                {activeTab === "active" ? "No active orders" : "No order history"}
              </h3>
              <p style={{ fontSize: "16px", color: MUTED, marginBottom: "26px" }}>
                {activeTab === "active"
                  ? "You don't have any active orders at the moment."
                  : "You haven't placed any orders yet."}
              </p>

              {activeTab === "active" && (
                <a href="/menu" style={{ textDecoration: "none" }}>
                  <button style={primaryBtn}>Browse Menu</button>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};