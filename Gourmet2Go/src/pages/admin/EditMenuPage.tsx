import { EditMenu } from "../../components/admin/EditMenu";
import { NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";

export const EditMenuPage = () => {

  return (
    <div className="bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-6 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">

        <NavLink
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </NavLink>

        <div className="mt-6">
          <EditMenu />
        </div>

      </div>
    </div>
  );
};
