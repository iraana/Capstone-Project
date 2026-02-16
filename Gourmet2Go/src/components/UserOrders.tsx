import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { useAuth } from "../context/AuthContext";
import QRCode from "react-qr-code";
import { QrCode, Trash2 } from "lucide-react";

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
  const [showHistory, setShowHistory] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const [activeQrId, setActiveQrId] = useState<number | null>(null);

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
        // Gets dishIds from order
        const dishIds = order.OrderItems.map((item) => item.Dishes.dish_id);
        
        // Fetch the current stock
        const { data: currentStockData, error: stockFetchError } = await supabase
          .from("MenuDayDishes")
          .select("dish_id, stock")
          .eq("menu_id", order.menu_id)
          .in("dish_id", dishIds);

        if (stockFetchError) {
          console.error("Failed to fetch current stock:", stockFetchError);
          throw new Error("Could not restore stock. Order deletion aborted.");
        }

        const stockUpdates = order.OrderItems.map(async (item) => {
          const currentStockRecord = currentStockData?.find(
            (s) => s.dish_id === item.Dishes.dish_id
          );

          if (currentStockRecord) {
            const newStock = currentStockRecord.stock + item.quantity; // Calculates new stock
            
            // Updates it in the database
            const { error: updateError } = await supabase
              .from("MenuDayDishes")
              .update({ stock: newStock })
              .eq("menu_id", order.menu_id)
              .eq("dish_id", item.Dishes.dish_id);

            if (updateError) throw updateError;
          }
        });

        await Promise.all(stockUpdates);

        // Hard delete on order
        const { error } = await supabase
          .from("Orders")
          .delete()
          .eq("order_id", order.order_id)
          .eq("user_id", user!.id);

        if (error) throw error;

      } else {
        // Soft delete
        const { error } = await supabase
          .from("Orders")
          .update({ is_showing: false })
          .eq("order_id", order.order_id)
          .eq("user_id", user!.id);

        if (error) throw error;
      }

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
  if (!orders || orders.length === 0)
    return <div className="p-6">No orders found.</div>;

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