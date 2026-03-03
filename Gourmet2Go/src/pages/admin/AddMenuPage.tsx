import { AddMenu } from "../../components/admin/AddMenu";
import { NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";

export const AddMenuPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="space-y-2">
          <NavLink
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </NavLink>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Create Menu
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Select dishes and create a menu for a specific date.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-700">
          <AddMenu />
        </div>

      </div>
    </div>
  );
};
