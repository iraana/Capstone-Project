import { NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";
import { TrashBin } from "../../components/admin/TrashBin";

export const TrashBinPage = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">

        <NavLink
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </NavLink>

        <div className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-700">
          <TrashBin />
        </div>

      </div>
    </div>
  );
};