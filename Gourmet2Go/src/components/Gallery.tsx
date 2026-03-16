import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Loader } from "./Loader";

interface GalleryPost {
  id: number;
  image_url: string;
  caption: string;
  date: string;
}

export const Gallery = () => {
  // For the selected image in the lightbox
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Fetch gallery posts
  const { data: galleryPosts, isLoading, error } = useQuery({
    queryKey: ['galleryPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Gallery')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      return data as GalleryPost[];
    }
  });

  // useCallback caches the function
  const handleNext = useCallback(() => {
    // Only runs if galleryPosts exist
    if (galleryPosts) {
      // Move to next index, wrap around using modulo operator 
      // If selectedIndex is null, start at 0
      setSelectedIndex((prev) => (prev !== null ? (prev + 1) % galleryPosts.length : 0));
    }
  }, [galleryPosts]); // Function is recreated if galleryPosts changes

  const handlePrev = useCallback(() => {
    if (galleryPosts) {
      // Wrap around backwards 
      // If at the start, go to the end
      setSelectedIndex((prev) => (prev !== null ? (prev - 1 + galleryPosts.length) % galleryPosts.length : 0));
    }
  },[galleryPosts]);

  // Closes the lightbox
  const handleClose = () => setSelectedIndex(null);

  useEffect(() => {
    // Keyboard handler
    const handleKeyDown = (e: KeyboardEvent) => {
      // Does nothing if the light box is closed
      if (selectedIndex === null) return;
      // If escape, close
      if (e.key === "Escape") handleClose();
      // If right arrow, next
      if (e.key === "ArrowRight") handleNext();
      // If left arrow, previous
      if (e.key === "ArrowLeft") handlePrev();
    };

    // Attach listener when component mounts, detach when unmounts
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]); // Re-run effect if selectedIndex or handlers change

  useEffect(() => {
    if (selectedIndex !== null) {
      // Disables scrolling when the lightbox is open
      document.body.style.overflow = "hidden";
    } else {
      // Restores scrolling when the lightbox is closed
      document.body.style.overflow = "auto";
    }
    // Cleanup function to ensure scrolling is restored if the component unmounts while lightbox is open
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedIndex]);

  // Show my loader while loading
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader fullScreen/>
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-100 dark:border-red-900/50 text-center max-w-md">
          <p className="font-semibold text-lg">Failed to load gallery.</p>
          <p className="text-sm mt-2 opacity-80">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  // Return the gallery grid and lightbox
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {galleryPosts?.length === 0 ? (
        // If no images
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
          <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">No images have been added yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {galleryPosts?.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }} // Starts slightly below and transparent
              animate={{ opacity: 1, y: 0 }} // Staggered animation based on the index
              transition={{ delay: index * 0.05, duration: 0.4 }} // Smooth fade-in and slight upward movement
              className="group relative w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] flex-none aspect-4/3 overflow-hidden rounded-2xl cursor-pointer bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-500 flex items-center justify-center"
              onClick={() => setSelectedIndex(index)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectedIndex(index)}
              aria-label={`View larger image of ${post.caption}`}
              role="button"
            >
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy" // Lazy loading for better performance
              />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-8 h-8 scale-75 group-hover:scale-100" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedIndex !== null && galleryPosts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Image Lightbox"
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#00659B]"
              aria-label="Close lightbox"
              autoFocus
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 md:left-8 z-50 p-3 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#00659B]"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 md:right-8 z-50 p-3 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#00659B]"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>

            <div className="relative w-full max-w-5xl px-12 sm:px-24 flex flex-col items-center justify-center h-full" onClick={handleClose}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col items-center w-full"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <img
                    src={galleryPosts[selectedIndex].image_url}
                    alt={galleryPosts[selectedIndex].caption}
                    className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
                  />
                  
                  <div className="mt-6 text-center">
                    <p className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">
                      {galleryPosts[selectedIndex].caption}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Image {selectedIndex + 1} of {galleryPosts.length}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};