import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Loader2, ShieldCheck, Mail } from "lucide-react";
import { supabase } from "../../../supabase-client";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const profileSchema = z.object({
  first_name: z.string().min(1, "settings.account.validation.firstNameRequired"),
  last_name: z.string().min(1, "settings.account.validation.lastNameRequired"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const MyAccountTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile, reset]);

  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      reset(undefined, { keepValues: true });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 hidden md:block">
        {t("settings.account.title")}
      </h1>

      <div className="bg-[#00659B] h-16 md:h-24 rounded-t-xl relative mb-20 md:mb-16 mt-2 md:mt-0">
        <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white dark:bg-zinc-900 p-1 md:p-1.5">
            <div className="w-full h-full bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
            </div>
            <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 border-[3px] md:border-4 border-white dark:border-zinc-900 rounded-full" />
          </div>
        </div>

        <div className="absolute -bottom-16 md:-bottom-12 left-0 w-full md:w-auto md:left-32 flex flex-col md:block items-center text-center md:text-left">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {profile?.first_name} {profile?.last_name}
            {profile?.role === "ADMIN" && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={10} /> {t("settings.account.adminRole")}
              </span>
            )}
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 text-xs md:text-sm mt-0.5 md:mt-0">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 md:p-6 border border-gray-200 dark:border-zinc-700">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-3 md:mb-4">
          {t("settings.account.profileInfo")}
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-4 md:py-8">
            <Loader2 className="animate-spin text-[#00659B]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1 md:space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t("settings.account.firstName")}
                </label>
                <input
                  {...register("first_name")}
                  className="w-full bg-gray-200 dark:bg-zinc-900 rounded-md px-3 py-1.5 md:py-2 text-sm md:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00659B]"
                />
                {errors.first_name?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(errors.first_name.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1 md:space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t("settings.account.lastName")}
                </label>
                <input
                  {...register("last_name")}
                  className="w-full bg-gray-200 dark:bg-zinc-900 rounded-md px-3 py-1.5 md:py-2 text-sm md:text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00659B]"
                />
                {errors.last_name?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {t(errors.last_name.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="opacity-70 space-y-1 md:space-y-1.5">
              <label className="text-[11px] md:text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                {t("settings.account.email")}
                <span className="normal-case font-normal text-[10px]">
                  {t("settings.account.cannotChange")}
                </span>
              </label>

              <div className="relative">
                <input
                  disabled
                  value={profile?.email || ""}
                  className="w-full bg-gray-200 dark:bg-zinc-900 rounded-md px-3 py-1.5 md:py-2 pl-9 text-sm md:text-base text-gray-500 cursor-not-allowed"
                />
                <Mail size={16} className="absolute left-3 top-2 md:top-2.5 text-gray-400" />
              </div>
            </div>
          </form>
        )}
      </div>

      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-full max-w-2xl z-50 md:px-4"
          >
            <div className="bg-zinc-900 rounded-lg shadow-2xl p-3 md:px-4 flex flex-col md:flex-row items-center justify-between border border-zinc-700/50 gap-3 md:gap-0">
              <p className="text-white text-xs md:text-sm font-medium text-center md:text-left">
                {t("settings.account.unsavedChanges")}
              </p>
              <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                <button
                  onClick={() => reset()}
                  className="text-white hover:underline text-xs md:text-sm"
                >
                  {t("settings.account.reset")}
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={updateProfile.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-xs md:text-sm font-bold flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  {updateProfile.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {t("settings.account.saveChanges")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};