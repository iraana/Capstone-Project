import { supabase } from "../../../../supabase-client.ts";
import { useQuery } from '@tanstack/react-query';
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

type Dish = {
    dish_id: number;
    name: string;
    price: number;
    category: string;
};

const dishSchema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name must be 30 characters or less"),
  price: z
    .number("Price must be a number")
    .positive("Price must be positive")
    .refine((val) => Number((val * 100).toFixed(2)) === val * 100, "Max 2 decimal places"),
  category: z.enum(['Other', 'Soups', 'Salads', 'Sandwiches', 'Entrees', 'Desserts', 'Bowls', 'Appetizers', 'Sides']),
});

type DishFormData = z.infer<typeof dishSchema>;

export const EditDish = () => {
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
        .eq('dish_status', true)
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
        const toastId = toast.loading("Saving changes...");

        try {
            const { error } = await supabase.from("Dishes")
            .update({
                name: data.name,
                category: data.category,
                price: data.price,
            })
            .eq('dish_id', Number(dishId));

            if (error) throw error;

            toast.success('Dish updated successfully!', { id: toastId });
        } catch (error: any) {
            console.error("Error updating dish:", error);
            toast.error(error.message || 'Failed to update dish. Please try again.', { id: toastId });
        }
    };

    return (
        <div className="px-4">
            <div
                className="w-full max-w-2xl mx-auto 
                bg-white dark:bg-zinc-800 
                shadow-lg rounded-2xl 
                border border-zinc-200 dark:border-zinc-700 
                p-8 space-y-6"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                        Edit Dish
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Update dish details below.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Dish Name
                        </label>
                        <input
                        type="text"
                        placeholder="Enter dish name"
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        {...register("name")}
                        />
                        {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Price */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                            <select
                                {...register("category")}
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="Other">Other</option>
                                <option value="Soups">Soups</option>
                                <option value="Salads">Salads</option>
                                <option value="Sandwiches">Sandwiches</option>
                                <option value="Entrees">Entrees</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Bowls">Bowls</option>
                                <option value="Appetizers">Appetizers</option>
                                <option value="Sides">Sides</option>
                            </select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-linear-to-r from-blue-600 to-green-500 px-4 py-2.5 text-white font-semibold shadow-md hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );     
}