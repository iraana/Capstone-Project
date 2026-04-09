import { supabase } from "../../../supabase-client";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface SecurityTabProps {
  onClose: () => void;
}

export const SecurityTab = ({ onClose }: SecurityTabProps) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    navigate('/reset-password');
    onClose();
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    const toastId = toast.loading(t("settings.security.toasts.deleting"));

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
      toast.success(t("settings.security.toasts.success"), { id: toastId });
      setShowDeleteModal(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t("settings.security.toasts.error"), { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    setConfirmText("");
    setShowDeleteModal(true);
  };

  return (
    <div className="max-w-3xl relative">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 hidden md:block">
        {t("settings.security.title")}
      </h1>

      <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-zinc-700 space-y-8 mt-4 md:mt-0">
        
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {t("settings.security.changePassword")}
          </h3>
          <button
            onClick={handlePasswordReset}
            className="w-full md:w-auto bg-[#00659B] hover:bg-[#00527c] text-white px-4 py-2 rounded text-sm font-bold transition-colors text-center"
          >
            {t("settings.security.goToChange")}
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-red-600 mb-2">
            {t("settings.security.dangerZone")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {t("settings.security.dangerWarning")}
          </p>
          <button 
            onClick={openDeleteModal}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors flex justify-center items-center gap-2"
          >
            {t("settings.security.deleteAccountBtn")}
          </button>
        </div>

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {t("settings.security.modal.title")}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("settings.security.modal.cannotUndo")}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-5">
                {t("settings.security.modal.description")}
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <label htmlFor="confirm-delete" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {t("settings.security.modal.typePromptPart1")} <span className="font-bold text-red-600 dark:text-red-400 select-all">{t("settings.security.modal.targetPhrase")}</span> {t("settings.security.modal.typePromptPart2")}
                </label>
                <input
                  id="confirm-delete"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                  placeholder={t("settings.security.modal.targetPhrase")}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-end gap-3 px-4 md:px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full md:w-auto px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-all disabled:opacity-50 text-center"
              >
                {t("settings.security.modal.cancel")}
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={confirmText !== t("settings.security.modal.targetPhrase") || isDeleting}
                className="w-full md:w-auto px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                {t("settings.security.modal.confirm")}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};