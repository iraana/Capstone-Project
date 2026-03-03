import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import { Loader } from "../Loader";
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
  status: 'PENDING' | 'FULFILLED' | 'INACTIVE';
  notes: string | null;
  total: number;
  order_number: number;
  menu_id: number;
  profiles: UserProfile;    
  MenuDays: MenuDay;        
  OrderItems: OrderItemWithDish[]; 
}

export const CancelledOrders = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedMenuId, setSelectedMenuId] = useState<number | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["inactive_orders"],
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
        .eq("status", "INACTIVE") 
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: number; newStatus: string }) => {
      const { error } = await supabase
        .from("Orders")
        .update({ status: newStatus })
        .eq("order_id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inactive_orders"] });
    },
  });

  const availableMenus = useMemo(() => {
    if (!orders) return [];
    const map = new Map();
    orders.forEach((o) => {
      if (o.MenuDays && !map.has(o.MenuDays.menu_day_id)) {
        map.set(o.MenuDays.menu_day_id, o.MenuDays);
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    let result = orders;
    
    if (selectedMenuId !== "ALL") {
      result = result.filter(
        (o) => o.MenuDays?.menu_day_id === selectedMenuId
      );
    }
    
    if (search.trim() !== "") {
      result = result.filter((o) =>
        o.order_number
          .toString()
          .includes(search.trim()) ||
        o.profiles?.first_name
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        o.profiles?.last_name
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        o.profiles?.email
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }
    
    return result;
  }, [orders, selectedMenuId, search]);

  if (isLoading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-red-500">
        <p>Error loading orders: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by Menu:</span>
            <select
                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedMenuId}
                onChange={(e) => setSelectedMenuId(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
            >
                <option value="ALL">All Menus</option>
                {availableMenus.map((menu) => (
                    <option key={menu.menu_day_id} value={menu.menu_day_id}>
                        {new Date(menu.date).toLocaleDateString()} - {menu.day}
                    </option>
                ))}
            </select>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search users by order number, name, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-8 rounded-lg border border-blue-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length === 0 ? (
           <div className="col-span-full text-center py-20 text-gray-400">
               No orders found for this selection.
           </div>
        ) : (
            filteredOrders.map((order) => (
            <div 
                key={order.order_id} 
                onClick={() => navigate(`/admin/order/${order.order_number}`)}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col cursor-pointer hover:shadow-md hover:border-red-300 transition-all ${
                    order.status === 'INACTIVE' ? 'border-gray-200 opacity-75' : 'border-gray-200'
                }`}
            >
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-gray-900">#{order.order_number}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                order.status === "INACTIVE"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>

                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {order.profiles?.first_name} {order.profiles?.last_name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {order.profiles?.email}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400">
                            {order.MenuDays ? new Date(order.MenuDays.date).toLocaleDateString() : 'No Date'}
                        </div>
                        <div className="text-xs text-gray-400">
                            {new Date(`${order.MenuDays.date}T${order.timestamp}`).toLocaleTimeString([], {hour: '2-digit',minute: '2-digit',})}
                        </div>
                    </div>
                </div>

                <div className="p-4 grow space-y-3">
                    <ul className="space-y-2">
                        {order.OrderItems.map((item) => (
                            <li key={item.order_item_id} className="flex justify-between text-sm">
                                <div className="flex gap-2">
                                    <span className="font-bold w-6 text-center bg-gray-100 rounded text-gray-700">
                                        {item.quantity}x
                                    </span>
                                    <span className="text-gray-800">{item.Dishes?.name || "Unknown Dish"}</span>
                                </div>
                                <span className="text-gray-500">${item.subtotal.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    
                    {order.notes && (
                        <div className="mt-4 p-2 bg-green-50 text-green-800 text-xs rounded border border-green-100">
                            <strong>Note:</strong> {order.notes}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        {order.status === 'INACTIVE' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatusMutation.mutate({ orderId: order.order_id, newStatus: 'PENDING' });
                                }}
                                disabled={updateStatusMutation.isPending}
                                className="col-span-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
                            >
                                Reopen
                            </button>
                        )}

                        {order.status === 'INACTIVE' && (
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatusMutation.mutate({ orderId: order.order_id, newStatus: 'FULFILLED' });
                                }}
                                disabled={updateStatusMutation.isPending}
                                className="col-span-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
                            >
                                Move to Archive
                            </button>
                        )}
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};