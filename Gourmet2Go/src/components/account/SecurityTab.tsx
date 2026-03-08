import { supabase } from "../../../supabase-client";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const SecurityTab = () => {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // We'll need an SMTP server for this in the future
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    await supabase.auth.resetPasswordForEmail(user.email);
    alert("Password reset email sent!");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure? This action is irreversible. All your data and orders will be deleted."
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      await signOut();
      alert("Your account has been deleted.");
    } catch (error) {
      console.error(error);
      alert("Error deleting account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Security
      </h1>

      <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-6 border border-gray-200 dark:border-zinc-700 space-y-8">
        
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Change Password
          </h3>
          <button
            onClick={handlePasswordReset}
            className="bg-[#00659B] hover:bg-[#00527c] text-white px-4 py-2 rounded text-sm font-bold transition-colors"
          >
            Send Password Reset Email
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-red-600 mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};