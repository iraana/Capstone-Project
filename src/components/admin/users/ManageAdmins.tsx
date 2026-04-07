import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../supabase-client.ts";
import { useState } from "react";
import { Loader } from "../../Loader.tsx";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "ADMIN" | "USER" | "NO_ACCESS";
  is_banned: boolean;
}

export const ManageAdmins = () => {
  const [search, setSearch] = useState("");
  const [adminToDelete, setAdminToDelete] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: admins, isLoading, error } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data: adminUsers, error: adminSelectError } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["ADMIN"])
        .order("role", { ascending: true })
        .order("first_name", { ascending: true });

      if (adminSelectError) throw adminSelectError;
      return adminUsers as User[];
    },
  });

  const toggleBan = useMutation({
    mutationFn: async ({
      adminId,
      isBanned,
    }: {
      adminId: string;
      isBanned: boolean;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/admin/toggle-ban', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({ userId: adminId, isBanned: !isBanned })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update ban status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (adminId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ userId: adminId })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete admin');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const changeRole = useMutation({
    mutationFn: async ({
      adminId,
      role,
    }: {
      adminId: string;
      role: User["role"];
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", adminId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const handleToggleBan = async (admin: User) => {
    const action = admin.is_banned ? "Unbanning" : "Banning";
    const toastId = toast.loading(`${action} admin...`);
    try {
      await toggleBan.mutateAsync({ adminId: admin.id, isBanned: admin.is_banned });
      toast.success(`Admin ${admin.is_banned ? "unbanned" : "banned"} successfully!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || `Failed to update ban status for ${admin.first_name}.`, { id: toastId });
    }
  };

  const handleChangeRole = async (adminId: string, role: User["role"]) => {
    const toastId = toast.loading("Updating role...");
    try {
      await changeRole.mutateAsync({ adminId, role });
      toast.success("Admin role updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update admin role.", { id: toastId });
    }
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    const adminId = adminToDelete.id;
    setAdminToDelete(null);
    const toastId = toast.loading("Deleting admin...");

    try {
      await deleteAdmin.mutateAsync(adminId);
      toast.success("Admin deleted successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete admin. Please try again.", { id: toastId });
    }
  };

  if (isLoading) return <Loader fullScreen/>;
  if (error) return <p className="text-center mt-4">Error: {error.message}</p>;

  const filteredAdmins = admins?.filter((admin) => {
    const searchValue = search.toLowerCase();
    return (
      admin.first_name.toLowerCase().includes(searchValue) ||
      admin.last_name.toLowerCase().includes(searchValue) ||
      admin.email.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="mt-10 max-w-3xl mx-auto space-y-4 relative">
      <input
        type="text"
        placeholder="Search admins by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 rounded-lg border border-blue-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />

      {filteredAdmins?.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
          No admins found
        </p>
      )}

      {filteredAdmins?.map((admin) => (
        <div
          key={admin.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-blue-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md transition gap-4"
        >
          <div className="mb-2 sm:mb-0">
            <p className="font-medium text-blue-900 dark:text-blue-400">
              {admin.first_name} {admin.last_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400">{admin.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={toggleBan.isPending}
              onClick={() => handleToggleBan(admin)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50
                ${
                  admin.is_banned
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800"
                }
              `}
            >
              {toggleBan.isPending ? "Processing..." : admin.is_banned ? "Unban" : "Ban"}
            </button>

            <label htmlFor={`role-select-${admin.id}`} className="sr-only">
              Change role for {admin.first_name}
            </label>

            <select
              id={`role-select-${admin.id}`}
              value={admin.role}
              onChange={(e) => handleChangeRole(admin.id, e.target.value as User["role"])}
              disabled={changeRole.isPending}
              className="rounded-md border border-blue-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1.5 text-xs font-semibold text-blue-900 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="NO_ACCESS">No Access</option>
            </select>

            <button
              disabled={deleteAdmin.isPending}
              onClick={() => setAdminToDelete(admin)}
              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
              title="Delete Admin"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delete Admin</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Are you sure you want to permanently delete: <br/>
                <span className="font-semibold text-zinc-900 dark:text-white block mt-2">
                  {adminToDelete.first_name} {adminToDelete.last_name}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-1">
                  ({adminToDelete.email})
                </span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setAdminToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 rounded-xl transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};