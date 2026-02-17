import { supabase } from "../../../supabase-client";
import { useAuth } from "../../context/AuthContext";

// This is all stuff we'll work on fully implementing in the future
export const SecurityTab = () => {
  const { user } = useAuth();

  // We need to make an SMTP server before this can work properly 
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    await supabase.auth.resetPasswordForEmail(user.email);
    alert("Password reset email sent!");
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
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};
