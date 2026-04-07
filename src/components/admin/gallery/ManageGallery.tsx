import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../supabase-client.ts";
import { useState } from "react";
import { Loader } from "../../Loader.tsx";
import { Trash2, Edit2, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface GalleryPost {
  id: number;
  image_url: string;
  caption: string;
  date: string;
}

export const ManageGallery = () => {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [postToDelete, setPostToDelete] = useState<GalleryPost | null>(null); 
  
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
        .update({ caption: newCaption })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryPosts"] });
      setEditingId(null);
    },
  });

  const deletePost = useMutation({
    mutationFn: async (post: GalleryPost) => {
      const rawFilename = post.image_url.split("/").pop();
      const filename = rawFilename ? decodeURIComponent(rawFilename) : null;

      if (filename) {
        const { error: storageError } = await supabase.storage
          .from("gallery-images")
          .remove([filename]);

        if (storageError) {
          console.error("Failed to delete image from storage:", storageError.message);
        }
      }

      const { error: dbError } = await supabase
        .from("Gallery")
        .delete()
        .eq("id", post.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryPosts"] });
    },
  });

  const startEditing = (post: GalleryPost) => {
    setEditingId(post.id);
    setEditCaption(post.caption);
  };

  const handleSave = async (id: number) => {
    if (editCaption.trim() === "") {
      toast.error("Caption cannot be empty.");
      return; 
    }

    const toastId = toast.loading("Updating caption...");

    try {
      await updateCaption.mutateAsync({ id, newCaption: editCaption.trim() });
      toast.success("Caption updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update caption. Please try again.", { id: toastId });
    }
  };

  const handleDeleteClick = (post: GalleryPost) => {
    setPostToDelete(post);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    const post = postToDelete;
    setPostToDelete(null);
    const toastId = toast.loading("Deleting post...");

    try {
      await deletePost.mutateAsync(post);
      toast.success("Post deleted successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete post. Please try again.", { id: toastId });
    }
  };

  if (isLoading) return <Loader fullScreen />;
  if (error) return <p className="text-center mt-4 text-red-500 font-medium">Error: {error.message}</p>;

  const filteredPosts = posts?.filter((post) =>
    post.caption.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10 max-w-4xl mx-auto space-y-4 px-4 relative">
      <input
        type="text"
        placeholder="Search gallery posts by caption..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 rounded-lg border border-blue-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />

      {filteredPosts?.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
          No gallery posts found.
        </p>
      )}

      {filteredPosts?.map((post) => (
        <div
          key={post.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-blue-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md transition gap-4"
        >
          <div className="flex items-center gap-4 mb-2 sm:mb-0 w-full sm:w-auto">
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
                  if (e.key === "Enter") handleSave(post.id);
                  if (e.key === "Escape") setEditingId(null);
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
                  onClick={() => handleDeleteClick(post)}
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

      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delete Post</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Are you sure you want to permanently remove the image for: <br/>
                <span className="font-semibold text-zinc-900 dark:text-white block mt-2">"{postToDelete.caption}"?</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 rounded-xl transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};