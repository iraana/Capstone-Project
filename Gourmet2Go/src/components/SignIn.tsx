import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const signInSchema = z.object({
  email: z.email("Invalid email address"), 
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignIn = () => {
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    await signInWithEmail(data.email, data.password);
    navigate("/"); // Redirect to home page after sign-in
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
          Welcome Back
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={inputClasses(errors.email)}
              placeholder="24242424@saultcollege.ca"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={inputClasses(errors.password)}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
    </div>
  );
};