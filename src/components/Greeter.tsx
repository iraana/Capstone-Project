import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion, easeOut } from "framer-motion";
import { Sun, Moon, Thermometer, Loader2, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../supabase-client";
import { useTranslation } from "react-i18next";

export const Greeter = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [greetingKey, setGreetingKey] = useState("morning");
  const [isDaytime, setIsDaytime] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user!.id)
        .single();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });


  // Query to fetch the current weather for the Soo
  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=46.514352&longitude=-84.336238&current_weather=true"
      );
      const data = await res.json(); // Data equals response json from the API call
      return data.current_weather?.temperature; // Return the current temperature in Celsius
    },
    refetchInterval: 1000000, // Refetch every 1000 seconds
  });

  useEffect(() => {
    const computeGreeting = () => {
      const hour = new Date().getHours();
      setIsDaytime(hour >= 6 && hour < 20); // Consider daytime to be between 6am and 8pm

      if (hour >= 4 && hour < 12) // Between 4am and 12pm is morning
        setGreetingKey("morning");
      else if (hour >= 12 && hour < 16) // Between 12pm and 4pm is afternoon
        setGreetingKey("afternoon");
      else if (hour >= 16 && hour < 23) // Between 4pm and 11pm is evening
        setGreetingKey("evening");
      else // Between 11pm and 4am is late night
        setGreetingKey("late");
    };

    computeGreeting();
    const interval = setInterval(computeGreeting, 60000); // Update greeting every minute so it changes at the right time
    return () => clearInterval(interval);
  }, [profile]);

  // Weather messages based on temperature
  const getWeatherKey = (temp?: number) => {
    if (temp === undefined) return "default";
    if (temp <= -10) return "freezing";
    if (temp < 0) return "cold";
    if (temp < 10) return "chilly";
    if (temp < 20) return "mild";
    if (temp < 30) return "warm";
    return "scorcher";
  };

  const containerVariants = {
    initial: { opacity: 0, y: 6 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.36, ease: easeOut } },
  };

  const iconSpin = {
    animate: { rotate: 360, transition: { repeat: Infinity, duration: 1.4 } },
  };

  // If user is null, not logged in
  if (!user) {
    return (
      <motion.section
        className="mb-8 w-full text-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-700"
        role="alert"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 rounded-full bg-green-50 dark:bg-zinc-800">
            <LogIn className="w-6 h-6 text-green-500" aria-hidden="true" />
          </div>

          {/* Prompt to sign in */}
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {t("greeter.auth.title")}
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md">
            {t("greeter.auth.subtitle")}
          </p>
        </div>
      </motion.section>
    );
  }

  // If we have the user's first name, include it in the greeting
  const nameStr = profile?.first_name ? `, ${profile.first_name}` : "";

  return (
    <motion.section
      className="mb-8 w-full bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-700"
      role="region"
      aria-label="Welcome panel"
      initial={shouldReduceMotion ? undefined : "initial"}
      animate={shouldReduceMotion ? undefined : "enter"}
      variants={containerVariants}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="p-2 rounded-md bg-blue-50 dark:bg-zinc-800"
            aria-hidden="true"
          >
            {isDaytime ? (
              <Sun className="w-6 h-6 text-blue-500" />
            ) : (
              <Moon className="w-6 h-6 text-blue-400" />
            )}
          </span>

          <motion.h2
            className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100"
            aria-live="polite"
          >
            {t(`greeter.greetings.${greetingKey}`, { name: nameStr })}!
          </motion.h2>
        </div>

        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm"
          role="status"
        >
          {weatherLoading ? (
            <motion.span
              animate={shouldReduceMotion ? undefined : iconSpin.animate}
            >
              <Loader2 className="w-4 h-4" />
            </motion.span>
          ) : (
            <>
              <Thermometer className="w-4 h-4" />
              <span className="font-medium">
                {weather !== undefined ? `${Math.round(weather)}°C` : "—"}
              </span>
            </>
          )}
        </div>
      </div>

      <motion.p
        className="mt-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-medium"
      >
        {weatherLoading
          ? t("greeter.weather.checking")
          : t(`greeter.weather.${getWeatherKey(weather)}`)}
      </motion.p>
    </motion.section>
  );
};