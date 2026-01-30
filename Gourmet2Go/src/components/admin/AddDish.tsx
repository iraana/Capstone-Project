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
  category: z.enum(['Other', 'Soups', 'Salads', 'Sandwiches']),
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
    <div className="p-6 space-y-4 max-w-md items-center mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            placeholder="Dish Name"
            className="border px-3 py-2 rounded w-full mb-2"
            {...register("name")} 
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="border px-3 py-2 rounded w-full mb-2"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p>{errors.price.message}</p>}
        </div>

        <div>
          <label>Category:</label>
          <select {...register("category")} className="border px-3 py-2 rounded w-full mb-2">  
            <option value="Other">Other</option>
            <option value="Soups">Soups</option>
            <option value="Salads">Salads</option>
            <option value="Sandwiches">Sandwiches</option>
          </select>
          {errors.category && <p>{errors.category.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "Submitting..." : "Add Dish"}
        </button>
      </form>

      {successMsg && <p>{successMsg}</p>}
      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
};