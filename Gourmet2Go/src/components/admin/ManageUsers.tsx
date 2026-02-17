import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import { useState } from "react";
import { Loader } from "../Loader";

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
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: !isBanned })
        .eq("id", userId);

      if (error) throw error;
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

      {/* Search input */}
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 rounded-lg border border-blue-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />

      {/* No results */}
      {filteredUsers?.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
          No users found
        </p>
      )}

      {/* Users list */}
      {filteredUsers?.map((user) => (
        <div
          key={user.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-blue-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md transition"
        >
          {/* User info */}
          <div className="mb-2 sm:mb-0">
            <p className="font-medium text-blue-900 dark:text-blue-400">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">

            {/* Ban/Unban */}
            <button
              onClick={() =>
                toggleBan.mutate({
                  userId: user.id,
                  isBanned: user.is_banned,
                })
              }
              className={`rounded-md px-3 py-1 text-xs font-semibold transition
                ${
                  user.is_banned
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                }
              `}
            >
              {user.is_banned ? "Unban" : "Ban"}
            </button>

            {/* Role select */}
            <select
              value={user.role}
              onChange={(e) =>
                changeRole.mutate({
                  userId: user.id,
                  role: e.target.value as User["role"],
                })
              }
              className="rounded-md border border-blue-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1 text-xs font-semibold text-blue-900 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="NO_ACCESS">No Access</option>
            </select>

          </div>
        </div>
      ))}
    </div>
  );
};