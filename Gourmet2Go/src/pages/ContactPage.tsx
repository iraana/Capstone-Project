import { motion, type Variants } from "framer-motion";
import { Phone, MapPin, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { supabase } from "../../supabase-client"; 

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage = () => {
  const[successMsg, setSuccessMsg] = useState<string | null>(null);
  const[errorMsg, setErrorMsg] = useState<string | null>(null);

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

    // Insert into Supabase
    const { error } = await supabase
      .from("contact_messages")
      .insert([{ 
        name: data.name, 
        email: data.email, 
        message: data.message,
        status: 'unread' 
      }]);

    if (error) {
      setErrorMsg("Failed to send message. Please try again later.");
    } else {
      setSuccessMsg("Your message has been sent successfully!");
      reset(); // Clear the form
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const inputClasses = (error: any) => `
    w-full rounded-lg border bg-white dark:bg-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 transition-all
    ${error ? "border-red-500 focus:ring-red-500/50" : "border-zinc-300 dark:border-zinc-600 focus:ring-blue-500"}
  `;

  return (
    <main className="relative flex w-full flex-col items-center justify-start pt-16 px-4 bg-white dark:bg-zinc-900 overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] animate-pulse dark:bg-blue-500/10" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-green-500/20 blur-[100px] animate-pulse delay-1000 dark:bg-green-500/10" />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 w-full max-w-4xl pb-16">
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-center bg-linear-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Contact Us
        </motion.h1>

        <motion.p variants={itemVariants} className="text-center text-zinc-600 dark:text-zinc-400 mt-4 mb-12">
          Have questions? We're here to help.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Pickup Location</h3>
                <p className="text-zinc-600 dark:text-zinc-400">443 Northern Ave, Sault Ste. Marie, ON<br />Room L1170</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Phone</h3>
                <p className="text-zinc-600 dark:text-zinc-400">(705) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Service Hours</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Wednesdays & Thursdays<br />12:15 PM – 12:45 PM</p>
              </div>
            </div>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Name</label>
              <input type="text" {...register("name")} className={inputClasses(errors.name)} placeholder="Your name" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Email</label>
              <input type="email" {...register("email")} className={inputClasses(errors.email)} placeholder="Your email" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Message</label>
              <textarea rows={4} {...register("message")} className={inputClasses(errors.message)} placeholder="Your message" />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>

            {successMsg && <div className="text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm text-center font-medium">{successMsg}</div>}
            {errorMsg && <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm text-center font-medium">{errorMsg}</div>}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-linear-to-r from-blue-600 to-green-500 px-4 py-2 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-70">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </motion.div>
    </main>
  );
};