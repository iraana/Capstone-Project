import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import { useState } from "react";

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
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: users, error: userSelectError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "ADMIN")
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


  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
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
        className="w-full mb-8 rounded-lg border border-blue-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />

      {filteredUsers?.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No users found
        </p>
      )}

      {filteredUsers?.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between rounded-lg border border-blue-100 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="font-medium text-blue-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

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
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }
            `}
          >
            {user.is_banned ? "Unban" : "Ban"}
          </button>

          <select
            value={user.role}
            onChange={(e) =>
              changeRole.mutate({
                userId: user.id,
                role: e.target.value as User["role"],
              })
            }
            className="rounded-md border border-blue-200 bg-white px-2 py-1 text-xs font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="NO_ACCESS">No Access</option>
          </select>
        </div>
      ))}
    </div>
  );
};