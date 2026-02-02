// Current date + added to id of EditMenu

import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface AdminPage {
  id: string;
  title: string;
  icon: string;
}

const today = new Date().toISOString().split("T")[0];

const adminPages: AdminPage[] = [
  {
    id: 'analytics',
    title: 'Analytics',
    icon: '📈',
  },
  {
    id: 'add-dish',
    title: 'Add Dish',
    icon: '🍽️',
  },
  {
    id: 'add-menu',
    title: 'Add Menu',
    icon: '☰',
  },
  {
    id: `edit-menu/${today}`,
    title: 'Edit Menu',
    icon: '🛠️',
  }
];

export const AdminHome = () => {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata.first_name ||
    user?.user_metadata.last_name ||
    user?.email;

  return (
    <div className="max-w-8xl mx-auto px-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">Welcome back, {displayName}, what is it you want to do today?</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {adminPages.map((adminPage) => (
          <div key={adminPage.id} className="relative group w-80">
            <div className="absolute -inset-1 rounded-[20px] blur-sm opacity-0 transition duration-300 pointer-events-none"></div>

            <div className="bg-primary border border-green-500 rounded-[20px] p-5 flex flex-col h-full">
              
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{adminPage.icon}</div>
                <h3 className="text-2xl font-bold text-white transition-colors">
                  {adminPage.title}
                </h3>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to={`/admin/${adminPage.id}`}
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Click Here
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};