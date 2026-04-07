import { Review } from "../components/Review"

export const ReviewPage = () => {
    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 py-10 px-4">
            <div className="max-w-2xl mx-auto"> 
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
                        Submit a Review
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                        Your feedback helps our culinary students grow and improve their craft.
                    </p>
                </div>
                <Review />
            </div>
        </main>
    );
}