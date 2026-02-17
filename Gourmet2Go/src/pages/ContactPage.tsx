import { motion, type Variants } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const ContactPage = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // min-h-screen removed because it created too much space 
  return (
    <main className="relative flex w-full flex-col items-center justify-start pt-16 px-4 bg-white dark:bg-zinc-900 overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] animate-pulse dark:bg-blue-500/10" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-green-500/20 blur-[100px] animate-pulse delay-1000 dark:bg-green-500/10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl pb-16"
      >

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-bold text-center bg-linear-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
        >
          Contact Us
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-center text-zinc-600 dark:text-zinc-400 mt-4 mb-12"
        >
          Have questions? We're here to help.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Contact Info */}
          
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Pickup Location */}
            <div className="flex items-start gap-4">
              <MapPin className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Pickup Location
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  443 Northern Ave, Sault Ste. Marie, ON
                  <br />
                  Room L1170
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <Phone className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Phone
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  (705) 123-4567
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Email
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  support@gourmet2go.ca
                </p>
              </div>
            </div>

            {/* Service Hours */}
            <div className="flex items-start gap-4">
              <Clock className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Service Hours
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Wednesdays & Thursdays
                  <br />
                  12:15 PM – 12:45 PM
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={itemVariants}
            className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-linear-to-r from-blue-600 to-green-500 px-4 py-2 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </motion.div>
    </main>
  );
};