import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import { Loader } from "../Loader";
import { ArrowLeft, Check, X, Archive } from "lucide-react";

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
  profiles: UserProfile;
  MenuDays: MenuDay;
  OrderItems: OrderItemWithDish[];
}

export const OrderDetails = () => {
  const { order_number } = useParams<{ order_number: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["single_order", order_number],
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
        .eq("order_number", order_number) // Filters by a single order_number
        .single();

      if (error) throw error;
      return data as unknown as Order;
    },
    enabled: !!order_number, // Only run if order exists
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ newStatus }: { newStatus: string }) => {
      if (!order) return; // Update prevention if order isn't loaded
      setActionLoading(true);
      const { error } = await supabase
        .from("Orders")
        .update({ status: newStatus }) // Update status
        .eq("order_id", order.order_id);
      if (error) throw error;
    },
    // Refetch Order Details and Pending Orders
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["single_order"] });
      queryClient.invalidateQueries({ queryKey: ["pending_orders"] });
      setActionLoading(false);
    },
    onError: () => {
        setActionLoading(false);
    }
  });

  if (isLoading) return <Loader fullScreen />;

  if (error || !order) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-gray-500">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p>Could not locate order #{order_number}</p>
        <button 
            onClick={() => navigate('/admin')}
            className="text-[#00659B] hover:underline"
        >
            Return to Dashboard
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FULFILLED": return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate("/admin/pending-orders")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to List
      </button>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                #{order.order_number}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {order.profiles.first_name} {order.profiles.last_name} ({order.profiles.email})
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wide text-center ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">Date</span>
                <span className="font-semibold text-gray-900 dark:text-white">{new Date(order.MenuDays.date).toLocaleDateString()}</span>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">Time Ordered</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(`${order.MenuDays.date}T${order.timestamp}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
          </div>
          <div className="border rounded-xl border-gray-200 dark:border-zinc-700 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-700/50">
                <tr>
                  <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Qty</th>
                  <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Item</th>
                  <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                {order.OrderItems.map((item) => (
                  <tr key={item.order_item_id}>
                    <td className="p-3 font-bold text-gray-900 dark:text-white w-16 text-center bg-gray-50/50 dark:bg-zinc-800">{item.quantity}</td>
                    <td className="p-3 text-gray-900 dark:text-white">{item.Dishes.name}</td>
                    <td className="p-3 text-gray-900 dark:text-white text-right">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-zinc-700/30 font-bold">
                <tr>
                    <td colSpan={2} className="p-3 text-right text-gray-600 dark:text-gray-300">Total</td>
                    <td className="p-3 text-right text-lg text-[#00659B] dark:text-blue-400">${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {order.notes && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-xl">
              <h3 className="text-amber-800 dark:text-amber-500 font-bold text-sm uppercase mb-1">Customer Notes</h3>
              <p className="text-gray-800 dark:text-gray-200">{order.notes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-zinc-700 flex flex-col sm:flex-row gap-3">
            {order.status === "PENDING" && (
                <>
                    <button
                        disabled={actionLoading}
                        onClick={() => updateStatusMutation.mutate({ newStatus: "FULFILLED" })}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Check size={20} />
                        Complete
                    </button>
                    <button
                        disabled={actionLoading}
                        onClick={() => updateStatusMutation.mutate({ newStatus: "INACTIVE" })}
                        className="flex-1 bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        <X size={20} />
                        Cancel 
                    </button>
                </>
            )}
            {order.status === "FULFILLED" && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={() => updateStatusMutation.mutate({ newStatus: "PENDING" })}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Check size={20} />
                    Reopen
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => updateStatusMutation.mutate({ newStatus: "INACTIVE" })}
                    className="flex-1 bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <X size={20} />
                    Move to Cancelled
                  </button>
                </>
            )}
            {order.status === "INACTIVE" && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={() => updateStatusMutation.mutate({ newStatus: "PENDING" })}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Check size={20} />
                    Reopen
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => updateStatusMutation.mutate({ newStatus: "FULFILLED" })}
                    className="flex-1 bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Archive size={20} />
                    Move to Archive
                  </button>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};