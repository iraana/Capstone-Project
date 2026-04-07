import { supabase } from "../../../supabase-client.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) setErrorMsg(error.message);
    else setSuccessMsg("Password updated! You can now log in.");
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
        Secure Your Account
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="password" className={labelClasses}>New Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={inputClasses(errors.password)}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirm_password" className={labelClasses}>Confirm New Password</label>
          <input
            id="confirm_password"
            type="password"
            placeholder="••••••••"
            {...register("confirm_password")}
            className={inputClasses(errors.confirm_password)}
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="text-sm text-green-700 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center font-medium">
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <a href="/sign-in" className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Return to Sign In
        </a>
      </div>
    </div>
  );
};