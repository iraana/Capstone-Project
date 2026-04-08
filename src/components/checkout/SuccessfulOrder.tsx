import { motion, type Variants } from "framer-motion";
import { CheckCircle, MoveLeft, Home, List } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.tsx";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client.ts";
import { t } from "i18next";

export const SuccessfulOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  // Fetch the newest order for the current user
  const { data: newestOrderNumber, isLoading, isError, error } = useQuery<number | null, Error>({
    queryKey: ["orders", "newest", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("Orders")
        .select("order_number, timestamp, status")
        .eq("status", "PENDING") // Only pending orders
        .eq("user_id", user.id) // Only for the current user
        .order("timestamp", { ascending: false }) // Newest
        .limit(1) // Only one, the latest one
        .single(); // Expect a single result

      // If no rows are returned
      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (!data) return null; // If no order found, return null

      return (data as { order_number: number }).order_number; // Extract just the order number 
    }
  });

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-start pt-10 overflow-hidden bg-white dark:bg-zinc-900 px-4 transition-colors duration-300">
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-green-500/20 blur-[100px] mix-blend-multiply dark:bg-green-500/10 dark:mix-blend-screen animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-[100px] mix-blend-multiply dark:bg-emerald-500/10 dark:mix-blend-screen animate-pulse delay-1000" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 shadow-sm dark:from-zinc-800 dark:to-zinc-800/50 border border-green-100 dark:border-zinc-700">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl font-extrabold tracking-tight sm:text-7xl bg-linear-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent select-none"
        >
          {t("titles.successfulOrder")}
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl"
        >
          {t("titles.successfulOrderSubtitle")}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400 sm:text-lg"
        >
          {t("titles.successfulOrderSubtitle2")}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-6">
          {isLoading && (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Fetching your order number…</div>
          )}

          {isError && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Oops — couldn't load your order. {error?.message ?? ""}
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {newestOrderNumber ? (
                <div className="inline-flex items-baseline gap-3 rounded-full bg-green-50/70 px-4 py-2 mt-2 border border-green-100 dark:bg-zinc-800 dark:border-zinc-700">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Order #</span>
                  <span className="text-2xl font-bold tracking-tight text-green-800 dark:text-white">
                    {newestOrderNumber}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">No recent orders found on your account.</div>
              )}
            </>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-green-200 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-green-200 dark:focus:ring-green-200 dark:focus:ring-offset-zinc-900 sm:w-auto"
            aria-label="Go back"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("helperWords.goBack")}
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-green-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 sm:w-auto"
            aria-label="View my orders"
          >
            <List className="h-4 w-4" />
            {t("helperWords.viewMyOrders")}
          </button>

          <a
            href="/public"
            className="group hidden sm:inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-green-700 border border-green-200 bg-white hover:bg-green-50 transition-all focus:outline-none focus:ring-2 focus:ring-green-200"
            aria-label="Back to home"
          >
            <Home className="h-4 w-4" />
            {t("helperWords.backToHome")}
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
};