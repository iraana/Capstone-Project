export interface TopUser {
  id: string;
  name: string;
  orders: number;
}

export const TopUsersList = ({ users }: { users: TopUser[] }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Top Users</h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between bg-blue-50 p-2 rounded">
            <span className="font-medium text-blue-900">{user.name}</span>
            <span className="text-gray-700">{user.orders} orders</span>
          </li>
        ))}
      </ul>
    </div>
  );
};