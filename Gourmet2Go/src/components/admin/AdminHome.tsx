import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { UserCog, BarChart3, UtensilsCrossed, FilePlus, FilePenLine, Users, ChevronRight, ClipboardClock, BookMinus, Archive, ScanLine, List } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";

interface AdminPage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const adminPages: AdminPage[] = [
  {
    id: 'add-dish',
    title: 'Add Dish',
    description: 'Add a new dish for the menu',
    icon: UtensilsCrossed,
    color: 'from-orange-500 to-amber-400',
  },
  {
    id: 'admin-manager',
    title: 'Admin Manager',
    description: 'Manage admin roles & permissions',
    icon: UserCog,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Top buyer, top seller, & more',
    icon: BarChart3,
    color: 'from-emerald-500 to-green-400', 
  },
  {
    id: 'archived-orders',
    title: 'Archived Orders',
    description: 'View and manage all fulfilled orders',
    icon: Archive,
    color: 'from-slate-500 to-gray-400'
  },
  {
    id: 'cancelled-orders',
    title: 'Cancelled Orders',
    description: 'Manage all inactive orders',
    icon: BookMinus,
    color: 'from-red-500 to-rose-400'
  },
  {
    id: 'add-menu',
    title: 'Create Menu',
    description: 'Set up a new menu',
    icon: FilePlus,
    color: 'from-purple-500 to-pink-400',
  },
  {
    id: `edit-menu`,
    title: 'Edit Menu',
    description: 'Make changes to a menu',
    icon: FilePenLine,
    color: 'from-rose-500 to-red-400',
  },
  {
    id: 'list-dishes',
    title: 'List Dishes',
    description: 'View all the currently available dishes',
    icon: List,
    color: 'from-emerald-500 to-lime-400'
  },
  {
    id: 'pending-orders',
    title: 'Pending Orders',
    description: 'Manage unfulfilled orders',
    icon: ClipboardClock,
    color: 'from-indigo-500 to-blue-400'
  },
  {
    id: 'scanner',
    title: 'QR Code Scanner',
    description: 'Scan QR code for quick pickup',
    icon: ScanLine,
    color: 'from-blue-600 to-indigo-500',
  },
  {
    id: 'user-manager',
    title: 'User Manager',
    description: 'Manage user roles & permissions',
    icon: Users,
    color: 'from-indigo-500 to-violet-400',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AdminHome = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", "navbar", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!user,
  });

  const displayName =
    profile?.first_name ||
    profile?.last_name ||
    user?.email ||
    "Admin";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-500 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-green-400/20 rounded-full blur-3xl dark:bg-green-900/20" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl dark:bg-blue-900/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-green-500 to-emerald-700">{displayName}</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Access your command centre for all admin operations for Gourmet2Go.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {adminPages.map((page) => (
            <motion.div
              key={page.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/admin/${page.id}`}
                className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-linear-to-br ${page.color} transition-opacity duration-300`} />
                
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-xl bg-linear-to-br ${page.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <page.icon size={24} strokeWidth={2} />
                  </div>
                  
                  <div className="text-slate-300 dark:text-slate-600 group-hover:text-green-500 transition-colors">
                    <ChevronRight size={24} />
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {page.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {page.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};