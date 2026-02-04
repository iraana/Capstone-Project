import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../../supabase-client';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router';

type Dish = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
};

const menuSchema = z.object({
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date'
  ),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  dishes: z
    .array(
      z.object({
        dish_id: z.number().min(1, 'Dish is required'),
        stock: z.number().min(1, 'Stock is required'),
      })
    )
    .min(1, 'Please add at least one dish')
    .refine(
      (dishes) => new Set(dishes.map((d) => d.dish_id)).size === dishes.length,
      'Each dish can only be added once'
    ),
});

type MenuFormValues = z.infer<typeof menuSchema>;

const getDayFromDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
  }) as MenuFormValues['day'];
};

export const AddMenu = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      day: 'Monday',
      dishes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dishes',
  });

  const { data: dishes = [] } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Dishes')
        .select('dish_id, name, price, category')
        .order('name');

      if (error) throw error;

      return data as Dish[];
    },
    refetchOnWindowFocus: true,
  });

  const onSubmit = async (data: MenuFormValues) => {
    setLoading(true);
    
    try {
      const day = getDayFromDate(data.date);
      const { data: menuData, error: menuError } = await supabase
        .from('MenuDays')
        .insert({
          date: data.date,
          day,
        })
        .select('menu_day_id')
        .single();

      if (menuError) throw menuError;

      const menuDayDishes = data.dishes.map((d) => ({
        menu_id: menuData.menu_day_id,
        dish_id: d.dish_id,
        stock: d.stock,
      }));

      const { error: dishesError } = await supabase
        .from('MenuDayDishes')
        .insert(menuDayDishes);

      if (dishesError) throw dishesError;

      setSuccessMsg('Menu saved successfully!');
      reset();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create menu');
    } finally {
      setLoading(false);
    }
  };


  const selectedDishIds = fields.map((_, i) => watch(`dishes.${i}.dish_id`));

  const availableDishes = dishes.filter(
    (dish) => !selectedDishIds.includes(dish.dish_id)
  );

  const selectedDishes = fields
    .map((_, index) => {
      const dishId = watch(`dishes.${index}.dish_id`);
      const stock = watch(`dishes.${index}.stock`);
      const dish = dishes.find((d) => d.dish_id === dishId);
      return dish ? { ...dish, stock, fieldIndex: index } : null;
    })
    .filter((d) => d !== null);

  const handleAddToMenu = (dish: Dish) => {
    append({ dish_id: dish.dish_id, stock: 1 });
  };

  const handleRemoveFromMenu = (fieldIndex: number) => {
    remove(fieldIndex);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          Add Menu for Selected Date
        </h1>

        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">Menu Date</label>
          <input
            type="date"
            {...register('date')}
            className="border rounded px-3 py-2"
          />
          
          {errors.date && (
            <p className="text-red-600 text-sm">{errors.date.message}</p>
          )}
        </div>



        <div>
          <h2 className="font-semibold text-lg mb-2">Current Menu Preview</h2>
          <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 dark:bg-zinc-700">
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
                <tr className="border-b border-gray-200" key={item.fieldIndex}>
                  <td className="px-3 py-2 text-center align-middle flex justify-center">
                    <button
                      type="button"
                      className="px-3 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleRemoveFromMenu(item.fieldIndex)}
                    >
                      ❌
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center align-middle">{item.name}</td>
                  <td className="px-3 py-2 text-center align-middle">{item.category}</td>
                  <td className="px-3 py-2 text-center align-middle">{item.price}</td>
                  <td className="px-3 py-2 text-center align-middle">
                    <input
                      type="number"
                      min={1}
                      {...register(`dishes.${item.fieldIndex}.stock`, {
                        valueAsNumber: true,
                      })}
                      className="w-16 px-2 py-1 text-sm border rounded text-center"
                    />
                    {errors.dishes?.[item.fieldIndex]?.stock && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.dishes[item.fieldIndex]?.stock?.message}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {errors.dishes?.message && (
            <div className="text-red-600 text-sm mt-2">{errors.dishes.message}</div>
          )}
        </div>

        <h2 className="font-semibold text-lg mt-6 mb-2">Available Menu Items</h2>

        <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 dark:bg-zinc-700">
            <tr>
              <th className="px-3 py-2 text-center align-middle">Dish</th>
              <th className="px-3 py-2 text-center align-middle">Category</th>
              <th className="px-3 py-2 text-center align-middle">Price</th>
              <th className="px-3 py-2 text-center align-middle">Action</th>
            </tr>
          </thead>
          <tbody>
            {availableDishes.map((item) => (
              <tr className="border-b border-gray-200" key={item.dish_id}>
                <td className="px-3 py-2 text-center align-middle">{item.name}</td>
                <td className="px-3 py-2 text-center align-middle">{item.category}</td>
                <td className="px-3 py-2 text-center align-middle">{item.price}</td>
                <td className="px-3 py-2 text-center align-middle flex justify-center gap-2">
                  <button
                    className="bg-[#00659B] text-white px-3 py-1 rounded hover:bg-[#005082]"
                    type="button"
                    onClick={() => handleAddToMenu(item)}
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
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Menu'}
          </button>
        </div>
      </div>
    </form>
  );
};