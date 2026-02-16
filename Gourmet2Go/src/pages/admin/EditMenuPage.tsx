import { useParams } from "react-router";
import { EditMenu } from "../../components/admin/EditMenu";
import { SelectMenuToEdit } from "../../components/admin/SelectMenuToEdit";
import { NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";

export const EditMenuPage = () => {
  const { date } = useParams<{ date: string }>();

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

        {!date ? (
          <>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Edit Existing Menu
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Select a menu to manage dishes and availability.
              </p>
            </div>

            <SelectMenuToEdit />
          </>
        ) : (
          <EditMenu />
        )}

      </div>
    </div>
  );
};
