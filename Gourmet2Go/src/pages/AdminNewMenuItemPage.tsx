import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";


export const AdminNewMenuItemPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name || !price || !category) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    const { error: supabaseError } = await supabase
      .from("Dishes")
      .insert([{ name, category, price }]);

    setLoading(false);

    if (supabaseError) {
      console.error(supabaseError);
      setError("Failed to save item. Try again.");
    } else {
      navigate(-1); 
      console.log("Item saved successfully.");
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md">
      <h1 className="text-2xl font-bold text-gray-800">Create New Menu Item</h1>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Dish Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border px-3 py-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Category (Soups, Entrees, etc.)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Item"}
      </button>
    </div>
  );
};
