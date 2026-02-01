import { NavLink } from "react-router-dom";

export interface MenuItem {
  dish_id: number;
  name: string;
  price: number;
  category: string;
}

interface MenuCardProps {
  date: string;
  items: MenuItem[];
  editable?: boolean;     
  empty?: boolean; 
  actionLabel?: "Add Menu" | "Edit Menu";
  actionLink?: string;     
}

export const MenuCard = ({
  date,
  items,
  editable = false,
  empty = false,
  actionLabel,
  actionLink,
}: MenuCardProps) => {
  // Get unique categories in the menu
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-72 flex flex-col justify-between">
      <h3 className="font-semibold text-lg mb-2">{date}</h3>

      {empty ? (
        <p className="text-gray-400 mb-4">No menu for this day</p>
      ) : (
        <>
          {categories.map((cat) => (
            <div key={cat} className="mb-3">
              <h4 className="font-medium">{cat}:</h4>
              <ul className="space-y-1 ml-2">
                {items
                  .filter((item) => item.category === cat)
                  .map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm text-gray-700">
                      <span>{item.name}</span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {editable && actionLink && actionLabel && (
        <NavLink
          to={actionLink}
          className="mt-2 inline-block text-center bg-[#00659B] text-white px-4 py-2 rounded hover:bg-[#005082]"
        >
          {actionLabel}
        </NavLink>
      )}
    </div>
  );
};
