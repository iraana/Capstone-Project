import { NavLink } from "react-router-dom";

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "Pending" | "Completed" | "Cancelled";
  date: string;
}

interface OrdersTableProps {
  orders: Order[];
  ordersPageLink: string;
}

export const OrdersTable = ({ orders, ordersPageLink }: OrdersTableProps) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Orders This Week</h2>
      <table className="min-w-full text-left">
        <thead className="border-b border-gray-300">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Customer</th>
            <th className="px-3 py-2">Items</th>
            <th className="px-3 py-2">Total</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200">
              <td className="px-3 py-2">{order.id}</td>
              <td className="px-3 py-2">{order.customer}</td>
              <td className="px-3 py-2">{order.items}</td>
              <td className="px-3 py-2">${order.total.toFixed(2)}</td>
              <td className="px-3 py-2">{order.status}</td>
              <td className="px-3 py-2">{order.date}</td>
              <td className="px-3 py-2">
                <NavLink
                  to={ordersPageLink}
                  className="text-primary hover:underline"
                >
                  View Order
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
