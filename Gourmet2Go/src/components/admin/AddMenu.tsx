import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type MenuItem = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
  stock?: number;
}
 
const fetchAvailableDishes = async () => {
  const { data, error } = await supabase.from('Dishes')
    .select('*');
  
  if (error) {
    console.error("Error fetching dishes:", error);
    return [];
  }
  return data;
};

const menuDishSchema = z.object({
  dish_id: z.number().int().positive(),
  stock: z.number().int().min(1),
});

export const addMenuSchema = z.object({
  date: z.string().refine(
    (dateValue) => !isNaN(Date.parse(dateValue)),
    { message: "Invalid date format" }
  ),
  day: z.string().min(1, { message: "Day is required" }),
  dishes: z.array(menuDishSchema).min(1, { message: "At least one dish must be selected" })
});


type MenuFormData = z.infer<typeof addMenuSchema>;

export const AddMenu = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [availableDishes, setAvailableDishes] = useState<MenuItem[]>([]);
  const [loadingAvailableDishes, setLoadingAvailableDishes] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<MenuItem[]>([]);
  const {date} = useParams<{date: string}>();
  const [menuDate] = useState<string>(date || "");
  const [dishStock, setDishStock] = useState<Record<number, number>>({});

  const handleAddToMenu = (item: MenuItem, stock: number) => {
    if (selectedDishes.find(dish => dish.dish_id === item.dish_id)) {
      return; // already added
    }
    setSelectedDishes(previouslySelectedDishes => [{
      ...item,
      stock: stock || 1,
    }, 
    ...previouslySelectedDishes
    ]);
  };

  const handleRemoveFromMenu = (dishId: number) => {
    setSelectedDishes(previouslySelectedDishes => 
      previouslySelectedDishes.filter(dish => dish.dish_id !== dishId)
    );
  }

  useEffect(() => {
    const loadDishes = async () => {
      try {
        setLoadingAvailableDishes(true);
        const dishes = await fetchAvailableDishes();
        setAvailableDishes(dishes);
      }catch (error) {
        console.error("Error loading dishes:", error);
      } finally {
        setLoadingAvailableDishes(false);
      }
    };
    loadDishes();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<MenuFormData>({
    resolver: zodResolver(addMenuSchema),
  });

  useEffect(() => {
      if (!menuDate) return;

      const dayOfWeek = new Date(menuDate).toLocaleDateString('en-US', { weekday: 'long' });
      setValue('date', menuDate);
      setValue('day', dayOfWeek);
    }, [menuDate, setValue]);
    
  useEffect(() => {
    setValue('dishes', selectedDishes.map(dish => ({
      dish_id: dish.dish_id,
      stock: dish.stock ?? 1,
    })));
  }, [selectedDishes, setValue]);

  const onSubmit = async (data: MenuFormData) => {

    if (selectedDishes.length === 0) {
      setErrorMsg("Please add at least one dish to the menu.");
      setSuccessMsg(null);
      return;
    }
    
    const {data:menuData, error:MenuError} = await supabase.from('MenuDays')
      .insert({
        date: menuDate,
        day: data.day,
      })
      .select()
      .single();
    if (MenuError || !menuData) {
      setErrorMsg("Failed to create save menu.");
      setSuccessMsg(null);
      return;
    }

    const menuDayId = menuData.menu_day_id;

    const {error:MenuDishError} = await supabase.from('MenuDayDishes')
      .insert(
        data.dishes.map(dish => ({
          dish_id: dish.dish_id,
          menu_id: menuDayId,
          stock: dish.stock,
        }))
      );

    if (MenuDishError) {
      setErrorMsg("Failed to save menu dishes.");
      setSuccessMsg(null);
      return;
    }

    setSuccessMsg("Menu saved successfully!");
    setErrorMsg(null);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Add Menu for Selected Date
      </h1>

      <div>
        <h2 className="font-semibold text-lg mb-2">Current Menu Preview</h2>
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th></th>
              <th className="px-3 py-2 text-center align-middle">Dish</th>
              <th className="px-3 py-2 text-center align-middle">Category</th>
              <th className="px-3 py-2 text-center align-middle">Price</th>
              <th className="px-3 py-2 text-center align-middle">Stock</th>
            </tr>
          </thead>
          <tbody>
            {selectedDishes.map((item) => (
            <tr className="border-b border-gray-200" key={item.dish_id}>
                <td className="px-3 py-2 text-center align-middle flex justify-center">
                  <button
                    type="button"
                    className="px-3 py-1 rounded hover:bg-gray-200"
                    onClick={() => handleRemoveFromMenu(item.dish_id)}
                  >
                    ❌
                  </button>
                </td>
                <td className="px-3 py-2 text-center align-middle">{item.name}</td>
                <td className="px-3 py-2 text-center align-middle">{item.category}</td> 
                <td className="px-3 py-2 text-center align-middle">{item.price}</td>
                <td className="px-3 py-2 text-center align-middle">{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-semibold text-lg mt-6 mb-2">Available Menu Items</h2>

      <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-center align-middle">Dish</th>
            <th className="px-3 py-2 text-center align-middle">Category</th>
            <th className="px-3 py-2 text-center align-middle">Price</th>
            <th className="px-3 py-2 text-center align-middle">Stock</th>
            <th className="px-3 py-2 text-center align-middle">Action</th>
          </tr>
        </thead>
        <tbody>
          {availableDishes.map((item) => (
          <tr className="border-b border-gray-200" key={item.dish_id}>
              <td className="px-3 py-2 text-center align-middle">{item.name}</td>
              <td className="px-3 py-2 text-center align-middle">{item.category}</td>
              <td className="px-3 py-2 text-center align-middle">{item.price}</td>
              <td className="px-3 py-2 text-center align-middle">
                <input 
                  type="number" 
                  min={1}
                  value={dishStock[item.dish_id] ?? 1}
                  className="w-16 px-2 py-1 text-sm border rounded text-center" 
                  onChange={(e) =>
                    setDishStock(previousStock => ({
                      ...previousStock,
                      [item.dish_id]: Number(e.target.value),
                    })) 
                   }>
                </input>
              </td>
              <td className="px-3 py-2 text-center align-middle flex justify-center gap-2">
                <button className="bg-[#00659B] text-white px-3 py-1 rounded hover:bg-[#005082]"
                  type="button"
                  onClick={() => {
                    handleAddToMenu(item, dishStock[item.dish_id]);
                  }}
                >
                  Add to Menu
                </button>
                <NavLink
                  to={`/menu/item/edit/${item.dish_id}`}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Edit Item
                </NavLink>
            </td>
          </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4 mt-4">
        <NavLink
          to="/menu/item/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Menu Item
        </NavLink>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Menu
        </button>
      </div>
    </div>
  </form>
);
  
}