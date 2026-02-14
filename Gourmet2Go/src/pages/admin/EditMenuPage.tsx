import { useParams } from "react-router";
import { EditMenu } from "../../components/admin/EditMenu";
import { SelectMenuToEdit } from "../../components/admin/SelectMenuToEdit";

export const EditMenuPage = () => {
  const { date } = useParams<{ date: string }>();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">

        {!date ? (
          <>
            <div className="space-y-2">
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
