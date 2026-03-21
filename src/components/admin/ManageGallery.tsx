import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import { useState } from "react";
import { Loader } from "../Loader";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface GalleryPost {
  id: number;
  image_url: string;
  caption: string;
  date: string;
}

export const ManageGallery = () => {
  const[search, setSearch] = useState("");
  // For tracking which post is being edited
  const [editingId, setEditingId] = useState<number | null>(null);
  // For stroring the caption being edited
  const [editCaption, setEditCaption] = useState("");
  // React Query client for cache management
  const queryClient = useQueryClient();

  // Fetch gallery posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["galleryPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Gallery")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      return data as GalleryPost[];
    },
  });

  const updateCaption = useMutation({
    mutationFn: async ({ id, newCaption }: { id: number; newCaption: string }) => {
      const { error } = await supabase
        .from("Gallery")
        .update({ caption: newCaption }) // Update the caption with the new value
        .eq("id", id); // Where the id matches

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryPosts"] }); // Refetch posts after update
      setEditingId(null); // Exit edit mode
    },
  });

  const deletePost = useMutation({
    mutationFn: async (post: GalleryPost) => {
      // Splits the URL up by '/' and pop takes the last part which is the filename
      const rawFilename = post.image_url.split("/").pop();
      // Handles encoded characters like spaces (%20) and decodes them back to normal characters
      // If rawFilename is undefined, filename will be null
      const filename = rawFilename ? decodeURIComponent(rawFilename) : null;

      // If the file exists, delete it from the storage bucket
      if (filename) {
        const { error: storageError } = await supabase.storage
          .from("gallery-images")
          .remove([filename]);

        // We don't throw here because we want to try and delete the database record even if the storage deletion fails
        if (storageError) {
          console.error("Failed to delete image from storage:", storageError.message);
        }
      }

      // Deleting the database record
      const { error: dbError } = await supabase
        .from("Gallery")
        .delete()
        .eq("id", post.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryPosts"] }); // Refetch posts after deletion
    },
  });

  // Enter edit mode
  const startEditing = (post: GalleryPost) => {
    setEditingId(post.id); // Editing id is equal to the post id that is being edited
    setEditCaption(post.caption); // Pre-fills the input with the current caption
  };

  const handleSave = (id: number) => {
    if (editCaption.trim() === "") return; // Stops empty captions from being saved
    updateCaption.mutate({ id, newCaption: editCaption.trim() }); // Calls the mutation to update the caption
  };

  if (isLoading) return <Loader fullScreen />;
  if (error) return <p className="text-center mt-4 text-red-500">Error: {error.message}</p>;

  // Filters posts based on the search query
  const filteredPosts = posts?.filter((post) =>
    post.caption.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10 max-w-4xl mx-auto space-y-4 px-4">
      {/* Search input for filtering gallery posts */}
      <input
        type="text"
        placeholder="Search gallery posts by caption..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 rounded-lg border border-blue-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />

      {/* If no posts match the search query */}
      {filteredPosts?.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
          No gallery posts found.
        </p>
      )}

      {filteredPosts?.map((post) => (
        // Key is set to post.id to ensure each item is uniquely identified 
        <div
          key={post.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-blue-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md transition gap-4"
        >
          <div className="flex items-center gap-4 mb-2 sm:mb-0 w-full sm:w-auto overflow-hidden">
            <img
              src={post.image_url}
              alt={post.caption}
              className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-zinc-700 shrink-0"
            />

            {editingId === post.id ? (
              <input
                autoFocus
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave(post.id); // Save on Enter key
                  if (e.key === "Escape") setEditingId(null); // Cancel editing on Escape key
                }}
                className="flex-1 min-w-0 sm:w-64 rounded-md border border-blue-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter new caption..."
              />
            ) : (
              <div className="min-w-0">
                <p className="font-medium text-blue-900 dark:text-blue-400 truncate">
                  {post.caption}
                </p>
                {post.date && (
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {editingId === post.id ? (
              <>
                <button
                  disabled={updateCaption.isPending}
                  onClick={() => handleSave(post.id)}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50"
                >
                  <Check size={14} /> {updateCaption.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  disabled={updateCaption.isPending}
                  onClick={() => setEditingId(null)}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-50"
                >
                  <X size={14} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEditing(post)}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  <Edit2 size={14} /> Edit Caption
                </button>
                <button
                  disabled={deletePost.isPending}
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to delete this gallery post? This will permanently remove the image."
                      )
                    ) {
                      deletePost.mutate(post);
                    }
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                  title="Delete Post"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};