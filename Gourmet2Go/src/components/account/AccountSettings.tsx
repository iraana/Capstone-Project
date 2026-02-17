import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MyAccountTab } from "./MyAccountTab";
import { SecurityTab } from "./SecurityTab";

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettings = ({
  isOpen,
  onClose,
}: AccountSettingsProps) => {
  const [activeTab, setActiveTab] = useState<"my-account" | "security">(
    "my-account"
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900 overflow-hidden"
        >
          <div className="flex w-full h-full max-w-7xl mx-auto">
            
            <div className="w-64 bg-gray-50 dark:bg-zinc-950 flex flex-col pt-10 pb-6 px-3 border-r border-gray-200 dark:border-zinc-800">
              <div className="px-3 mb-6">
                <h2 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  User Settings
                </h2>

                <button
                  onClick={() => setActiveTab("my-account")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "my-account"
                      ? "bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-200"
                  }`}
                >
                  My Account
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "security"
                      ? "bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Security
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900">
              <div className="flex justify-end p-6">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-400 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 md:px-12 lg:px-16 pb-20">
                {activeTab === "my-account" && <MyAccountTab />}
                {activeTab === "security" && <SecurityTab />}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
