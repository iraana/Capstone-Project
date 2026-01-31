import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Validator using zod, remember these from CSD213?
const signUpSchema = z.object({
  email: z.email("Invalid email address"), // Built-in email validator from zod
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

// Infer the form data type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUp = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { signUpWithEmail } = useAuth(); // The sign-up function I made in AuthContext
  
  const {
    register, // Used on input fields
    handleSubmit, // Used on the form
    formState: { errors, isSubmitting }, // Shows validation errors and a boolean that indicates form submission state
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
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
          setErrorMsg('Error signing up');
      } else {
          setSuccessMsg('Sign-up successful!');
      }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full px-4 py-3 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? "border-red-500 border" : "border-transparent"
            }`}
            placeholder="40404040@saultcollege.ca"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`w-full px-4 py-3 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.password ? "border-red-500 border" : "border-transparent"
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-black mb-2"
          >
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            {...register("first_name")}
            className={`w-full px-4 py-3 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.first_name ? "border-red-500 border" : "border-transparent"
            }`}
            placeholder="John"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-black mb-2"
          >
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            {...register("last_name")}
            className={`w-full px-4 py-3 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.last_name ? "border-red-500 border" : "border-transparent"
            }`}
            placeholder="Doe"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      {errorMsg && (
        <div className="text-red-500 text-center mb-4">
          {errorMsg}
        </div>
      )}
      
      {successMsg && (
        <div className="text-green-500 text-center mb-4">
          {successMsg}
          </div>
      )}

      <p className="text-center text-gray-800 mt-6">
        By signing up, you agree to our{" "}
        <a
          href="/terms-of-service"
          className="text-blue-400 hover:text-blue-500 font-medium transition-colors duration-200"
        >
          Terms of Service
        </a>
      </p>

      <p className="text-center text-gray-800 mt-6">
        You also agree to our{" "}
        <a
          href="/privacy-policy"
          className="text-blue-400 hover:text-blue-500 font-medium transition-colors duration-200"
        >
          Privacy Policy
        </a>
      </p>

      <p className="text-center text-gray-800 mt-6">
        Already have an account?{" "}
        <a
          href="/sign-in"
          className="text-blue-400 hover:text-blue-500 font-medium transition-colors duration-200"
        >
          Sign In
        </a>
      </p>

    </div>
  );
};