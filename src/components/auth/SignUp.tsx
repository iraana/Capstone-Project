import { useAuth } from "../../context/AuthContext.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Validator using zod, remember these from CSD213?
const signUpSchema = z
  .object({
    email: z
      .email("Invalid email address")
      .refine((email) => /^[0-9]{8}@saultcollege\.ca$/i.test(email), {
        message: "You must use your 8-digit Sault College email to sign up",
      }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

    confirm_password: z.string(),

    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),

    accept_terms: z.literal(true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Infer the form data type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUp = () => {
  const { signUpWithEmail } = useAuth(); // The sign-up function I made in AuthContext

  const {
    register, // Used on input fields
    handleSubmit, // Used on the form
    formState: { errors, isSubmitting }, // Shows validation errors and a boolean that indicates form submission state
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const toastId = toast.loading("Creating your account...");

    const { error } = await signUpWithEmail({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      },
    });

    if (error) {
      toast.error(error.message || "Error signing up. Please try again.", { id: toastId });
    } else {
      toast.success("Sign-up successful! Check your email for the confirmation link.", { id: toastId });
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
        Create Your Account
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className={labelClasses}>First Name</label>
            <input {...register("first_name")} className={inputClasses(errors.first_name)} placeholder="John" />
            {errors.first_name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.first_name.message}</p>}
          </div>
          <div className="flex-1">
            <label className={labelClasses}>Last Name</label>
            <input {...register("last_name")} className={inputClasses(errors.last_name)} placeholder="Doe" />
            {errors.last_name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.last_name.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Email Address</label>
          <input type="email" {...register("email")} className={inputClasses(errors.email)} placeholder="40404040@saultcollege.ca" />
          {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClasses}>Password</label>
          <input type="password" {...register("password")} className={inputClasses(errors.password)} placeholder="••••••••" />
          {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className={labelClasses}>Confirm Password</label>
          <input type="password" {...register("confirm_password")} className={inputClasses(errors.confirm_password)} placeholder="••••••••" />
          {errors.confirm_password && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2 pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("accept_terms")}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              I agree to the{" "}
              <a
                href="/terms-of-service"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {errors.accept_terms && (
          <p className="text-red-500 text-xs ml-1">{errors.accept_terms.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};