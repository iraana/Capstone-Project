import { motion, type Variants } from 'framer-motion'; 
import { MoveLeft, Home, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router'; 

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-start pt-10 overflow-hidden bg-white dark:bg-zinc-900 px-4 transition-colors duration-300">
      
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] mix-blend-multiply dark:bg-blue-500/10 dark:mix-blend-screen animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-green-500/20 blur-[100px] mix-blend-multiply dark:bg-green-500/10 dark:mix-blend-screen animate-pulse delay-1000" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-green-50 shadow-sm dark:from-zinc-800 dark:to-zinc-800/50 border border-blue-100 dark:border-zinc-700">
            <FileQuestion className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-8xl font-black tracking-tighter sm:text-9xl bg-linear-to-r from-blue-600 to-green-500 bg-clip-text text-transparent select-none"
        >
          404
        </motion.h1>

        <motion.h2 
          variants={itemVariants}
          className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl"
        >
          Page not found
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="mx-auto mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400 sm:text-lg"
        >
          Couldn't find the specified page. Which dev should pay for this?
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700 dark:focus:ring-offset-zinc-900 sm:w-auto"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>

          {/* Home Button */}
          <a
            href="/"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </a>
        </motion.div>

    </motion.div>
    </main>
  );
};