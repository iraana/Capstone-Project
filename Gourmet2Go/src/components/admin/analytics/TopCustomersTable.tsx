interface CustomerStats {
  name: string;
  orders: number;
}

interface TopCustomersTableProps {
  customers: CustomerStats[];
}

export const TopCustomersTable = ({ customers }: TopCustomersTableProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">
        Top Customers
      </h2>

      <table className="min-w-full border border-gray-200">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-3 py-2 text-center">User</th>
            <th className="px-3 py-2 text-center">Orders</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, idx) => (
            <tr key={idx} className={idx === 0 ? "bg-green-100" : idx % 2 === 0 ? "bg-blue-50" : "bg-white"}>
              <td className="px-3 py-2 text-center">{customer.name}</td>
              <td className="px-3 py-2 text-center">
                {customer.orders}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};