import { type ChangeEvent, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../supabase-client.ts";
import init, { process_image } from "../../../../wasm-lib/pkg";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UploadCloud, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";

interface GalleryInput {
  caption: string;
}

const addToGallery = async (post: GalleryInput, imageFile: File) => {
  // File path generated using caption and timestamp
  const filePath = `${post.caption}-${Date.now()}.webp`;

  // Uploads the image into our storage bucket
  const { error: uploadError } = await supabase.storage
    .from("gallery-images")
    .upload(filePath, imageFile, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  // If the upload fails, throw an error
  if (uploadError) throw new Error(uploadError.message);

  // Gets the public URL for the image that was just uploaded
  const { data: publicURLData } = supabase.storage
    .from("gallery-images")
    .getPublicUrl(filePath);

  // Insert the gallery post and public image URL into the Gallery table
  const { data, error } = await supabase
    .from("Gallery")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  // If error, throw error
  if (error) throw new Error(error.message);
  
  return data;
};

export const AddToGallery = () => {
  const [caption, setCaption] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    init().then(() => setWasmReady(true)); // Loads the Rust WASM file
  },[]);

  // We extract mutateAsync to await the promise in our submit handler
  const { mutateAsync, isPending, reset } = useMutation({
    mutationFn: (data: { post: GalleryInput; imageFile: File }) => {
      return addToGallery(data.post, data.imageFile);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevents page refresh
    if (!selectedFile) return; // Don't submit if no file is selected

    const toastId = toast.loading("Uploading image to gallery...");

    try {
      // Calls the upload function
      await mutateAsync({
        post: { caption },
        imageFile: selectedFile,
      });

      toast.success("Image added to gallery successfully!", { id: toastId });
      
      // Reset form
      setCaption("");
      setSelectedFile(null);
      reset();

    } catch (error: any) {
      console.error("Error adding to gallery:", error);
      toast.error(error.message || "Failed to create post. Please try again.", { id: toastId });
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // If WASM isn't ready, alert the user using a toast warning
    if (!wasmReady) {
      toast.warning("Image processor is still loading, please try again in a moment.");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      // Get the original file
      const file = e.target.files[0];
      // Shows processing state
      setIsProcessing(true);

      try {
        // Converts the file into raw bytes
        const buffer = await file.arrayBuffer();
        const inputBytes = new Uint8Array(buffer);

        // Calls Rust to process the image
        // Inside Rust, it loads the image, resizes it, converts it to WebP, and returns the new image bytes
        const outputBytes = process_image(inputBytes);

        // Turn the Rust output bytes back into a JavaScript File object so it can be uploaded
        const newFile = new File([outputBytes as any], "processed_image.webp", {
          type: "image/webp",
        });

        // Saves the new file in state, which will trigger the preview to update and allow the user to submit the form
        setSelectedFile(newFile);
        // Catch errors
      } catch (err) {
        console.error("Error processing image via WASM:", err);
        toast.error("Failed to process image. Is it a valid image file?");
      } finally {
        // Is processing is set to false, regardless of success or failure
        setIsProcessing(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonTap = { scale: 0.995 };
  const buttonHover = { y: -2, boxShadow: "0px 8px 24px rgba(16,24,40,0.08)" };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-slate-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-md p-3 border border-gray-100 dark:border-zinc-800">
              <UploadCloud className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-tight">Add to Gallery</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Select an image and add a caption to create a new gallery entry.
              </p>
            </div>
          </div>
        </div>

        <motion.div variants={fieldVariants} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-slate-700 dark:text-zinc-200 mb-2">
              Caption
            </label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              placeholder="e.g., Miso ramen from Ichiraku"
              required
              aria-label="Caption"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700 dark:text-zinc-200 mb-2">
              Upload Image
            </label>

            <div className="flex items-center gap-3">
              <label
                htmlFor="image"
                className={`flex items-center gap-3 cursor-pointer rounded-md border border-dashed px-4 py-2 min-h-56px w-full ${
                  isProcessing ? "opacity-80 pointer-events-none" : "hover:border-sky-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
                    <ImageIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-700 dark:text-zinc-200">Select file</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400">
                      JPEG and PNG — will be converted to WebP
                    </div>
                  </div>
                </div>
                <input
                  key={selectedFile ? "has-file" : "empty"} 
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="sr-only" 
                />
              </label>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
              Images will be automatically converted to WebP and resized to 1280x960.
            </p>
          </div>

          {isProcessing && (
            <motion.div
              variants={fieldVariants}
              className="flex items-center gap-3 text-sm text-sky-600 dark:text-sky-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing image...</span>
            </motion.div>
          )}

          {selectedFile && !isProcessing && (
            <motion.div
              variants={fieldVariants}
              className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Image preview */}
              <div className="md:col-span-2">
                <motion.img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full max-h-72 object-contain rounded-md border border-gray-200 dark:border-zinc-700"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="rounded-md border border-gray-100 dark:border-zinc-700 p-3 bg-gray-50 dark:bg-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div>
                        <div className="text-sm font-medium">Ready to upload</div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-zinc-400">
                  Tip: Use a descriptive caption to make the image identifiable.
                </div>
              </div>
            </motion.div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <motion.button
              type="submit"
              disabled={isPending || isProcessing || !selectedFile}
              whileHover={!isPending && !isProcessing && selectedFile ? buttonHover : {}}
              whileTap={buttonTap}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Create Post</span>
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setSelectedFile(null)}
              whileTap={{ scale: 0.98 }}
              className="ml-2 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-slate-700 dark:text-zinc-200 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 disabled:opacity-50"
            >
              Clear
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.form>
  );
};