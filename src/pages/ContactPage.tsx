import { motion, type Variants } from "framer-motion";
import { Contact } from "../components/Contact"; 

export const ContactPage = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
     <main className="relative flex w-full flex-col items-center justify-start py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-900 min-h-screen overflow-hidden transition-colors duration-300">
     
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px] animate-pulse dark:bg-blue-600/10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-green-500/20 blur-[120px] animate-pulse delay-1000 dark:bg-green-600/10 pointer-events-none" />

      {/* Main Content Wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            variants={headerVariants}
             className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 tracking-tight"
          >
            Contact Us
          </motion.h1>

          <motion.p
            variants={headerVariants}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Have questions about Gourmet2Go or need help with your order? Send us a message and we'll get back to you shortly.
          </motion.p>
        </div>

        <Contact />

      </motion.div>
    </main>
  );
};