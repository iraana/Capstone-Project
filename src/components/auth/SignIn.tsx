import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.tsx";
import { useState } from "react";
import { supabase } from "../../../supabase-client.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const signInSchema = z.object({
  email: z
    .email("auth.validation.invalidEmail")
    .refine((email) => /^[0-9]{8}@saultcollege\.ca$/i.test(email), {
      message: "auth.validation.saultEmail",
    }),
  password: z.string().min(1, "auth.validation.passwordRequired"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignIn = () => {
  const { t } = useTranslation();
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error(t("auth.signIn.toasts.enterEmailFirst"));
      return;
    }

    const toastId = toast.loading(t("auth.signIn.toasts.sendingReset"));

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success(t("auth.signIn.toasts.resetSent"), { id: toastId });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    const toastId = toast.loading(t("auth.signIn.toasts.signingIn"));
    
    try {
      await signInWithEmail(data.email, data.password);
      toast.success(t("auth.signIn.toasts.success"), { id: toastId });
      navigate("/"); 
    } catch (error: any) {
      toast.error(error?.message || t("auth.signIn.toasts.error"), { id: toastId });
    }
  };

  const inputClasses = (error: any) => `
    w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 
    placeholder-zinc-400 dark:placeholder-zinc-500 border transition-all
    ${error ? "border-red-500 ring-1 ring-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"}
  `;

  const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="bg-white dark:bg-zinc-900 px-8 py-10 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all">
      <h3 className="text-xl font-semibold text-center text-zinc-800 dark:text-zinc-200 mb-8">
        {t("auth.signIn.title")}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClasses}>
            {t("auth.signIn.emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              onChange: (e) => setEmail((e.target as HTMLInputElement).value),
            })}
            className={inputClasses(errors.email)}
            placeholder="40404040@saultcollege.ca"
          />
          {errors.email?.message && <p className="text-red-500 text-xs mt-1.5 ml-1">{t(errors.email.message)}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClasses}>
            {t("auth.signIn.passwordLabel")}
          </label>
          <div className="flex items-center gap-3">
            <input
              id="password"
              type="password"
              {...register("password")}
              className={inputClasses(errors.password)}
              placeholder="••••••••"
            />
          </div>
          {errors.password?.message && <p className="text-red-500 text-xs mt-1.5 ml-1">{t(errors.password.message)}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? t("auth.signIn.signingInBtn") : t("auth.signIn.signInBtn")}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isSubmitting}
          className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          {t("auth.signIn.forgotPassword")}
        </button>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {t("auth.signIn.noAccount")}{" "}
          <a href="/sign-up" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            {t("auth.signIn.signUpLink")}
          </a>
        </p>
      </div>
    </div>
  );
};