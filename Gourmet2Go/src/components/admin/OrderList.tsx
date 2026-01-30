import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";

const fetchOrders = async () => {
  const { data, error } = await supabase.from("Orders")
    .select(`
        order_id,
        Users (
            last_name, first_name
        ),
        timestamp,
        status,
        notes,
        total
    `)
    .order("timestamp", { ascending: false });
  if (error) {
    throw error;
  }

    return data;
};

export const OrderList = () => {
    const {data, isLoading, error} = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });

    if (isLoading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>Error loading orders: {(error as Error).message}</div>;
    }

    return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Orders:</h2>
                <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Order ID</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Customer Name</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Timestamp</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Status</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Notes</th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((order, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2 text-center">{order.order_id}</td>
                                <td className="px-4 py-2 text-center">{order.Users[0]?.first_name} {order.Users[0]?.last_name}</td>
                                <td className="px-4 py-2 text-center">{order.timestamp}</td>
                                <td className="px-4 py-2 text-center">{order.status}</td>
                                <td className="px-4 py-2 text-center">{order.notes}</td>
                                <td className="px-4 py-2 text-center">{order.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    );
};


