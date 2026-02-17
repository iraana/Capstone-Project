import { supabase } from "../../../supabase-client";
import { useQuery } from '@tanstack/react-query';
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

type Dish = {
    dish_id: number;
    name: string;
    price: number;
    category: string;
};

const dishSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .number("Price must be a number")
    .positive("Price must be positive")
    .refine((val) => Number((val * 100).toFixed(0)) === val * 100, "Max 2 decimal places"),
  category: z.enum(['Other', 'Soups', 'Salads', 'Sandwiches']),
});

type DishFormData = z.infer<typeof dishSchema>;

export const EditDish = () => {
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { dishId } = useParams<{ dishId: string }>();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
      } = useForm<DishFormData>({
        resolver: zodResolver(dishSchema),
    });

    const { data: dish } = useQuery({
        queryKey: ['dishes', dishId],
        queryFn: async () => {
        const { data, error } = await supabase.from('Dishes')
        .select('*')
        .eq('dish_id', Number(dishId))
        .single();
        if (error) throw error;
        return data as Dish;
        },
        enabled: !!dishId,
    });

    useEffect(() => {
        if (dish) {
            reset({
            name: dish.name,
            category: dish.category as DishFormData['category'],
            price: dish.price,
            });
        }
    }, [dish, reset]);

    const onSubmit = async (data: DishFormData) => {
        const { error } = await supabase.from("Dishes")
        .update({
            name: data.name,
            category: data.category,
            price: data.price,
        })
        .eq('dish_id', Number(dishId));
        if (error) {
            setErrorMsg(error.message || 'Failed to update dish');
            setSuccessMsg(null);
        } else {
            setSuccessMsg('Dish updated successfully');
            setErrorMsg(null);
        }
    };

        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Dish</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Update dish details below</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {successMsg && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2">
                                {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
                                {errorMsg}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <label className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mb-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Dish Name"
                                    className="border rounded px-3 py-2 w-full font-semibold text-gray-900 dark:text-white bg-white dark:bg-zinc-800"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <label className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mb-1">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="border rounded px-3 py-2 w-full font-semibold text-gray-900 dark:text-white bg-white dark:bg-zinc-800"
                                    {...register("price", { valueAsNumber: true })}
                                />
                                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <label className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mb-1">Category</label>
                            <select
                                {...register("category")}
                                className="border rounded px-3 py-2 w-full font-semibold text-gray-900 dark:text-white bg-white dark:bg-zinc-800"
                            >
                                <option value="Other">Other</option>
                                <option value="Soups">Soups</option>
                                <option value="Salads">Salads</option>
                                <option value="Sandwiches">Sandwiches</option>
                            </select>
                            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-700 flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
}