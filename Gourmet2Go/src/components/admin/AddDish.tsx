import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { supabase } from "../../../supabase-client";

const dishSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .number("Price must be a number")
    .positive("Price must be positive")
    .refine((val) => Number((val * 100).toFixed(0)) === val * 100, "Max 2 decimal places"),
  category: z.enum(['Other', 'Soups', 'Salads', 'Sandwiches', 'Entrees', 'Desserts', 'Bowls']),
});

type DishFormData = z.infer<typeof dishSchema>;

export const AddDish = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
  });

  const onSubmit = async (data: DishFormData) => {
    const { error } = await supabase.from("Dishes").insert({
      name: data.name,
      price: data.price,
      category: data.category,
    });

    if (!error) {
      setSuccessMsg("Dish added successfully!");
      setErrorMsg(null);
      reset();
    } else {
      setErrorMsg("Error adding dish");
      setSuccessMsg(null);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-zinc-900 transition-colors">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-800 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 space-y-6">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-center bg-linear-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Add New Dish
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Dish Name
            </label>
            <input 
              type="text" 
              placeholder="Enter dish name"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register("name")} 
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>


          {/* Price */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <select {...register("category")} className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">  
              <option value="Other">Other</option>
              <option value="Soups">Soups</option>
              <option value="Salads">Salads</option>
              <option value="Sandwiches">Sandwiches</option>
              <option value="Entrees">Entrees</option>
              <option value="Desserts">Desserts</option>
              <option value="Bowls">Bowls</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full rounded-lg bg-linear-to-r from-blue-600 to-green-500 px-4 py-2 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Add Dish"}
          </button>
        </form>

        {/* Messages */}
        {successMsg && (
          <div className="text-sm text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-lg">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-4 py-2 rounded-lg">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};