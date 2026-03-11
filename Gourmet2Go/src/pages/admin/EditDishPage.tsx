import { EditDish } from "../../components/admin/EditDish";
import { NavLink } from "react-router";
import { ArrowLeft, List } from "lucide-react";

export const EditDishPage = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-6 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Navigation Links */}
        <div className="flex justify-between mb-4">
          <NavLink
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </NavLink>

          <NavLink
            to="/admin/list-dishes"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
          >
            <List className="h-4 w-4" />
            Back to List
          </NavLink>
        </div>

        <div className="mt-15">
          <EditDish />
        </div>
      </div>
    </div>
  );
};