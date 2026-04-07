import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../supabase-client.ts";
import { useState } from "react";
import { Loader } from "../../Loader.tsx";
import { Trash2 } from "lucide-react";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "ADMIN" | "USER" | "NO_ACCESS";
  is_banned: boolean;
}

export const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: users, error: userSelectError } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["USER", "NO_ACCESS"])
        .order("role", { ascending: true })
        .order("first_name", { ascending: true });

      if (userSelectError) throw userSelectError;
      return users as User[];
    },
  });

  const toggleBan = useMutation({
    mutationFn: async ({
      userId,
      isBanned,
    }: {
      userId: string;
      isBanned: boolean;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Calls the API route defined in our Flask backend
      const response = await fetch('/api/admin/toggle-ban', {
        method: 'POST', // Using POST since we're updating data
        headers: {
          'Content-Type': 'application/json', // Sending JSON data
          'Authorization': `Bearer ${session?.access_token}` // Includes the access token
        },
        // If isBanned is true, we send false, and vice versa
        body: JSON.stringify({ userId, isBanned: !isBanned })
      });

      // If the response isn't ok, we try to parse the error message and throw it
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update ban status');
      }
    },
    // On success, the users query is invalidated
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      if(!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const changeRole = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: User["role"];
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });


  if (isLoading) return <Loader fullScreen/>;
  if (error) return <p className="text-center mt-4">Error: {error.message}</p>;

  const filteredUsers = users?.filter((user) => {
    const searchValue = search.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchValue) ||
      user.last_name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="mt-10 max-w-3xl mx-auto space-y-4">

      <input
        type="text"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 rounded-lg border border-blue-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />

      {filteredUsers?.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
          No users found
        </p>
      )}

      {filteredUsers?.map((user) => (
        <div
          key={user.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-blue-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md transition gap-4"
        >
          <div className="mb-2 sm:mb-0">
            <p className="font-medium text-blue-900 dark:text-blue-400">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <button
              disabled={toggleBan.isPending}
              onClick={() =>
                toggleBan.mutate({
                  userId: user.id,
                  isBanned: user.is_banned,
                })
              }
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50
                ${
                  user.is_banned
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800"
                }
              `}
            >
              {toggleBan.isPending ? "Processing..." : user.is_banned ? "Unban" : "Ban"}
            </button>

            {/* --- ADDED ACCESSIBILITY LABEL --- */}
            <label htmlFor={`role-select-${user.id}`} className="sr-only">
              Change role for {user.first_name}
            </label>

            <select
              id={`role-select-${user.id}`}
              value={user.role}
              onChange={(e) =>
                changeRole.mutate({
                  userId: user.id,
                  role: e.target.value as User["role"],
                })
              }
              className="rounded-md border border-blue-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1.5 text-xs font-semibold text-blue-900 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="NO_ACCESS">No Access</option>
            </select>

            <button
              disabled={deleteUser.isPending}
              onClick={() => deleteUser.mutate(user.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
              title="Delete User"
            >
              <Trash2 size={16} />
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};