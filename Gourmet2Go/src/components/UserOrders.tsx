import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { useAuth } from "../context/AuthContext";
import QRCode from "react-qr-code";
import { QrCode, Trash2, ShoppingBag, Utensils, MoveLeft } from "lucide-react"; 
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router"; 


interface Dish {
  dish_id: number;
  name: string;
  price: number;
}

interface OrderItemWithDish {
  order_item_id: number;
  quantity: number;
  subtotal: number;
  Dishes: Dish;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface MenuDay {
  menu_day_id: number;
  date: string;
  day: string;
}

interface Order {
  order_id: number;
  timestamp: string;
  status: "PENDING" | "FULFILLED" | "INACTIVE";
  notes: string | null;
  total: number;
  order_number: number;
  menu_id: number;
  is_showing: boolean;
  profiles: UserProfile;
  MenuDays: MenuDay;
  OrderItems: OrderItemWithDish[];
}

export const UserOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const[processingId, setProcessingId] = useState<number | null>(null);
  const [activeQrId, setActiveQrId] = useState<number | null>(null);

  // --- ANIMATION VARIANTS (Matching SuccessfulOrder) ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };
  // -----------------------------------------------------

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["user_orders", user?.id], // Scoped per user
    enabled: !!user, // If no user exists it won't fetch
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Orders")
        .select(`
          *,
          profiles (first_name, last_name, email),
          MenuDays (menu_day_id, date, day),
          OrderItems (
            order_item_id,
            quantity,
            subtotal,
            Dishes (dish_id, name, price)
          )
        `)
        .eq("user_id", user!.id)
        .eq("is_showing", true) // Filters where is_showing is true
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
  });

  const formatOrderDateTime = (date?: string, time?: string) => {
    if (!date || !time) return "N/A";
    const cleanTime = time.split(".")[0];
    const fullDateTime = new Date(`${date}T${cleanTime}`);
    if (isNaN(fullDateTime.getTime())) return "Invalid Date";

    return fullDateTime.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleDelete = async (order: Order) => {
    try {
      setProcessingId(order.order_id);

      if (order.status === "PENDING") {
        const { error } = await supabase.rpc('cancel_pending_order', {
          p_order_id: order.order_id
        });
        
        if (error) throw error;

      } else {
        // Soft delete for fulfilled/inactive orders 
        const { error } = await supabase
          .from("Orders")
          .update({ is_showing: false })
          .eq("order_id", order.order_id)
          .eq("user_id", user!.id);

        if (error) throw error;
      }

      // Refresh UI
      queryClient.invalidateQueries({ queryKey: ["user_orders"] });
    } catch (err) {
      console.error("Action failed:", err);
      alert("Failed to delete order. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) return null;
  if (isLoading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading orders</div>;

  // NEW NO ORDERS 
  if (!orders || orders.length === 0) {
    return (
        <main className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-900 px-4 transition-colors duration-300">
          
          {/* Background Blobs (Blue/Indigo theme for empty state) */}
          <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] mix-blend-multiply dark:bg-blue-500/10 dark:mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px] mix-blend-multiply dark:bg-indigo-500/10 dark:mix-blend-screen animate-pulse delay-1000" />
    
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 mx-auto max-w-2xl text-center"
          >
            {/* Icon */}
            <motion.div variants={itemVariants} className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 shadow-sm dark:from-zinc-800 dark:to-zinc-800/50 border border-blue-100 dark:border-zinc-700">
                <ShoppingBag className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
    
            {/* Text */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-linear-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent select-none pb-2"
            >
              No Orders Yet
            </motion.h1>
    
            <motion.h2
              variants={itemVariants}
              className="mt-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-2xl"
            >
              Looks like you haven't placed any orders.
            </motion.h2>
    
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400 sm:text-lg"
            >
              Browse our menu to find your next favorite meal and place your first order today!
            </motion.p>
    
            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <button
                onClick={() => navigate(-1)}
                className="group flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700 dark:focus:ring-offset-zinc-900 sm:w-auto"
                aria-label="Go back"
              >
                <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Go Back
              </button>
    
              <button
                onClick={() => navigate("/")} 
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 sm:w-auto"
                aria-label="Browse Menu"
              >
                <Utensils className="h-4 w-4" />
                Browse Menu
              </button>
            </motion.div>
          </motion.div>
        </main>
    );
  }
  // ---------------------------------------

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const historyOrders = orders.filter(
    (o) => o.status === "FULFILLED" || o.status === "INACTIVE"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "FULFILLED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "INACTIVE":
        return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
      default:
        return "";
    }
  };

  const renderOrderCard = (order: Order) => {
    // URL for the QR code
    const qrUrl = `${window.location.origin}/admin/order/${order.order_number}`;

    return (
      <div
        key={order.order_id}
        className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-6 mb-6 border border-gray-100 dark:border-zinc-700 transition-colors duration-200"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order #{order.order_number}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatOrderDateTime(order.MenuDays?.date, order.timestamp)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>

            {order.status === "PENDING" && (
                <button 
                  onClick={() => setActiveQrId(activeQrId === order.order_id ? null : order.order_id)}
                  className="flex items-center gap-1 text-xs font-bold text-[#00659B] hover:text-[#005082] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <QrCode size={16} />
                  {activeQrId === order.order_id ? "Hide QR" : "Show QR"}
                </button>
            )}
            
            {order.status !== "PENDING" && (
                <button
                onClick={() => handleDelete(order)}
                disabled={processingId === order.order_id}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
                >
                <Trash2 size={14} />
                {processingId === order.order_id
                    ? "Processing..."
                    : "Remove"}
                </button>
            )}
          </div>
        </div>

        {activeQrId === order.order_id && order.status === "PENDING" && (
            <div className="mb-6 bg-gray-50 dark:bg-black/30 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                    Show this to the staff at pickup
                </p>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <QRCode
                        size={150}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={qrUrl}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </div>
        )}

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          <p>
            <strong>Menu Day:</strong>{" "}
            {order.MenuDays?.day} ({order.MenuDays?.date})
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {order.OrderItems.map((item) => (
            <div
              key={item.order_item_id}
              className="flex justify-between text-sm text-gray-700 dark:text-gray-200"
            >
              <span>
                {item.quantity}× {item.Dishes.name}
              </span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-700/50 p-3 rounded border border-gray-100 dark:border-zinc-700">
            <strong>Notes:</strong> {order.notes}
          </div>
        )}

        <div className="flex justify-between font-semibold text-md border-t border-gray-100 dark:border-zinc-700 pt-3 text-gray-900 dark:text-white items-center">
            {order.status === "PENDING" ? (
                 <button
                 onClick={() => handleDelete(order)}
                 disabled={processingId === order.order_id}
                 className="text-xs font-normal text-red-500 hover:text-red-600 hover:underline disabled:opacity-50"
               >
                 {processingId === order.order_id
                   ? "Cancelling..."
                   : "Cancel Order"}
               </button>
            ) : (
                <span></span> 
            )}
         
          <div className="flex gap-4">
             <span>Total</span>
             <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Orders</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-zinc-800/50 rounded-xl border-dashed border-2 border-gray-200 dark:border-zinc-700">
            <p className="text-gray-500 dark:text-gray-400">You have no pending orders.</p>
          </div>
        ) : (
          pendingOrders.map(renderOrderCard)
        )}
      </div>

      {historyOrders.length > 0 && (
        <div className="mt-10 pb-20">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[#00659B] dark:text-blue-400 font-semibold hover:underline mb-4 flex items-center gap-2 text-sm"
          >
            {showHistory
              ? "Hide Fulfilled & Inactive Orders ▲"
              : "Show Fulfilled & Inactive Orders ▼"}
          </button>

          {showHistory && (
              <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                  {historyOrders.map(renderOrderCard)}
              </div>
          )}
        </div>
      )}
    </div>
  );
};