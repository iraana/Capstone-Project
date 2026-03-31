import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { supabase } from "../../../../supabase-client.ts";
import { Sparkles, Loader2 } from "lucide-react"; 

const dishSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .number("Price must be a number")
    .positive("Price must be positive")
    .refine((val) => Number((val * 100).toFixed(0)) === val * 100, "Max 2 decimal places"),
  category: z.enum(['Other', 'Soups', 'Salads', 'Sandwiches', 'Entrees', 'Desserts', 'Bowls']),
  description: z.string().max(250, "Description too long").optional(), // Updated max length slightly
});

type DishFormData = z.infer<typeof dishSchema>;

export const AddDish = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue, // Needed to set AI text
    watch,    // Needed to read name/category for the prompt
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
        category: 'Other'
    }
  });

  // Watch fields so we can send them to the AI
  const dishName = watch("name");
  const dishCategory = watch("category");

  // --- NEW: AI GENERATION LOGIC ---
  const handleGenerateAI = async () => {
    if (!dishName) {
      alert("Please enter a dish name first so the AI knows what to describe!");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/admin/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
            name: dishName, 
            category: dishCategory 
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to generate");

      // Set the value in the form
      setValue("description", result.description);
    } catch (err: any) {
      console.error("AI Error:", err);
      setErrorMsg("AI service is currently unavailable.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: DishFormData) => {
    const { error } = await supabase.from("Dishes").insert({
      name: data.name,
      price: data.price,
      category: data.category,
      description: data.description, // --- ADDED THIS ---
    });

    if (!error) {
      setSuccessMsg("Dish added successfully!");
      setErrorMsg(null);
      reset();
    } else {
      setErrorMsg("Error adding dish to database");
      setSuccessMsg(null);
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
            Add New Dish
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create a new dish that will be available for menu selection.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-1">
            <label htmlFor="dish-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Dish Name
            </label>
            <input
              id="dish-name"
              type="text"
              placeholder="e.g., Creamy Tomato Basil Soup"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                id="category"
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
              </select>
            </div>
          </div>

          {/* --- NEW: DESCRIPTION FIELD WITH AI BUTTON --- */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
                </label>
                <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !dishName}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-40 transition-colors p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {isGenerating ? "Crafting..." : "AI Description"}
                </button>
            </div>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe the flavors, ingredients, or story behind this dish..."
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg 
            bg-linear-to-r from-blue-600 to-green-500 
            px-4 py-3 text-white font-bold 
            shadow-lg shadow-blue-500/20 hover:scale-[1.01] transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving Dish..." : "Add Dish to Library"}
          </button>
        </form>

        {successMsg && (
          <div className="text-sm text-green-700 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 px-4 py-2 rounded-lg text-center font-medium">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="text-sm text-red-700 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 px-4 py-2 rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};