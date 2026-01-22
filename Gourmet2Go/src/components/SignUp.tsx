import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  const { signUpWithEmail } = useAuth(); // The sign-up function I made in AuthContext
  
  const {
    register, // Used on input fields
    handleSubmit, // Used on the form
    formState: { errors, isSubmitting }, // Shows validation errors and a boolean that indicates form submission state
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    await signUpWithEmail({
          email: data.email,
          password: data.password,
          options: {
              data: {
                  first_name: data.first_name,
                  last_name: data.last_name,
              },
          },
      });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            type="text"
            {...register("first_name")}
          />
          {errors.first_name && <p>{errors.first_name.message}</p>}
        </div>

        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            type="text"
            {...register("last_name")}
          />
          {errors.last_name && <p>{errors.last_name.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <a href="/sign-in">Already have an account? Sign In</a>
    </div>
  );
};