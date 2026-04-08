import { Phone, MapPin, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { supabase } from "../../supabase-client";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

export const Contact = () => {
  const { t } = useTranslation();

  const contactSchema = z.object({
    name: z
      .string()
      .min(2, t("contact.validation.nameRequired"))
      .max(35, t("contact.validation.nameMax")),
    email: z
      .string()
      .max(50, t("contact.validation.emailMax")),
    message: z
      .string()
      .min(10, t("contact.validation.messageMin"))
      .max(500, t("contact.validation.messageMax")),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          is_read: false,
        },
      ]);

    if (error) {
      setErrorMsg(t("contact.feedback.error"));
    } else {
      setSuccessMsg(t("contact.feedback.success"));
      reset();
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const inputClasses = (error: any) => `
    w-full rounded-lg border bg-white dark:bg-zinc-800 px-4 py-3 focus:outline-none focus:ring-2 transition-all
    ${
      error
        ? "border-red-500 focus:ring-red-500/50"
        : "border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500/20"
    }
  `;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
      
      <motion.div variants={itemVariants} className="space-y-8 p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {t("contact.info.pickupLocation")}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              {t("contact.info.addressLine1")}
              <br />
              {t("contact.info.addressLine2")}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
            <Phone size={24} />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {t("contact.info.phone")}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              (705) 123-4567
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {t("contact.info.serviceHours")}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              {t("contact.info.hoursDays")}
              <br />
              {t("contact.info.hoursTime")}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-700 space-y-5"
      >
        <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
          {t("contact.form.title")}
        </p>
        
        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
            {t("contact.form.name")}
          </label>
          <input
            type="text"
            {...register("name")}
            className={inputClasses(errors.name)}
            maxLength={35}
            placeholder={t("contact.form.placeholders.name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
            {t("contact.form.email")}
          </label>
          <input
            type="email"
            {...register("email")}
            className={inputClasses(errors.email)}
            maxLength={50}
            placeholder={t("contact.form.placeholders.email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
            {t("contact.form.message")}
          </label>
          <textarea
            rows={5}
            {...register("message")}
            className={inputClasses(errors.message)}
            placeholder={t("contact.form.placeholders.message")}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {successMsg && (
          <div className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-sm text-center font-medium border border-green-200 dark:border-green-800/30">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-sm text-center font-medium border border-red-200 dark:border-red-800/30">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-linear-to-r from-blue-600 to-green-500 px-4 py-3.5 text-white font-bold shadow-lg hover:from-blue-700 hover:to-green-600 active:scale-[0.98] transition-all disabled:opacity-70 mt-2"
        >
          {isSubmitting
            ? t("contact.form.button.sending")
            : t("contact.form.button.send")}
        </button>
      </motion.form>
      
    </div>
  );
};