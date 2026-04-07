import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { supabase } from "../../supabase-client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { Dish } from "./Menu";
import { Star, Utensils, MessageCircle } from "lucide-react";

const reviewSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
    comment: z.string().max(500, "Comment cannot exceed 500 characters").optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;


export const Review = () => {
    const { user, role } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [selectedDish, setSelectedDish] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
        },
    });

    const { data: dishes= [] } = useQuery({
        queryKey: ['dishes'],
        queryFn: async () => {
        const { data, error } = await supabase
            .from('Dishes')
            .select('dish_id, name')
            .eq('dish_status', true)
            .order('name');
    
        if (error) throw error;
    
        return data as Dish[];
        },
        refetchOnWindowFocus: true,
    });

    const { data: orders } = useQuery({
        queryKey: ['orders', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('Orders')
                .select('order_id, user_id, OrderItems(dish_id)')
                .eq('user_id', user?.id)
                .eq('status', 'FULFILLED');
            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    const {data: reviews} = useQuery({
        queryKey: ['reviews', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('Reviews')
                .select('review_id, user_id, dish_id')
                .eq('user_id', user?.id);
            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    const reviewableDishes = dishes.filter(dish => orders?.some(order => order.OrderItems?.some(item => item.dish_id === dish.dish_id)) && !reviews?.some(review => review.dish_id === dish.dish_id));

    const isAuthorized = user && (role === "USER" || role === "ADMIN");

    const onSubmit = async (data: ReviewFormData) => {
        try {
            const { error } = await supabase.from("Reviews").insert({
                user_id: user?.id,
                dish_id: selectedDish,
                rating: data.rating,
                comment: data.comment,
                timestamp: new Date().toISOString(),
            });
            if (error) throw error;
            setSuccessMessage("Review submitted successfully!");
            setErrorMessage("");
            } catch (error) {
                console.error("Error submitting review:", error);
                setErrorMessage("Failed to submit review. Please try again.");
                setSuccessMessage("");
            }
    }

    const inputClasses = (error: any) => `
        w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border transition-all text-sm
        ${error ? "border-red-500 ring-1 ring-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"}
    `;

    const labelClasses = "block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5";

    return (
        <div className="max-w-lg mx-auto">
            <form 
                className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-all" 
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Status Messages */}
                {successMessage && (
                    <div className="mx-6 mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm font-medium border border-emerald-100 dark:border-emerald-800/30 text-center">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl text-sm font-medium border border-red-100 dark:border-red-800/30 text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="p-6 sm:p-8 space-y-6"> 
                    {/* Header Note */}
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed text-center italic">
                            Disclaimer: Only one review can be submitted per dish. All submissions are final.
                        </p>
                    </div>

                    {isAuthorized ? (
                        <>
                            {/* Dish Selection */}
                            <div className="space-y-2">
                                <label htmlFor="dish-select" className={labelClasses}>
                                    <Utensils size={14} className="inline mr-2 -mt-1" />
                                    Select Dish
                                </label>
                                <select
                                    id="dish-select"
                                    className={inputClasses(false)}
                                    value={selectedDish}
                                    onChange={(e) => setSelectedDish(e.target.value)}
                                >
                                    <option value="">Choose a dish you've tried...</option>
                                    {reviewableDishes?.map((dish) => (
                                        <option key={dish.dish_id} value={dish.dish_id}>
                                            {dish.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Star Rating */}
                            <div className="space-y-1 text-center py-2">
                                <label className={labelClasses}>Overall Rating</label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => {
                                                setRating(star)
                                                setValue("rating", star)
                                            }}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(null)}
                                            className="transition-all transform hover:scale-125 active:scale-95"
                                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                        >
                                            <Star 
                                                size={42} 
                                                strokeWidth={1.5}
                                                className={`transition-colors ${
                                                    (hoveredRating !== null ? star <= hoveredRating : star <= rating) 
                                                    ? 'fill-yellow-400 text-yellow-400' 
                                                    : 'text-zinc-300 dark:text-zinc-700'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && (
                                    <p className="text-red-500 text-xs mt-2">{errors.rating.message}</p>
                                )}
                            </div>

                            {/* Comment Area */}
                            <div className="space-y-2">
                                <label className={labelClasses}>
                                    <MessageCircle size={14} className="inline mr-2 -mt-1" />
                                    Your Feedback
                                </label>
                                <textarea
                                    className={`${inputClasses(errors.comment)} min-h-[120px] resize-none`}
                                    placeholder="Tell us what you liked (or what could be better)..."
                                    {...register("comment")}
                                />
                                {errors.comment && (
                                    <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!selectedDish || rating === 0}
                                className="w-full bg-linear-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale mt-4"
                            >
                                Submit Review
                            </button>
                        </>
                    ) : (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-6 rounded-2xl text-center">
                            <p className="text-red-600 dark:text-red-400 font-medium">You must have an active student account and a fulfilled order to leave reviews.</p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}