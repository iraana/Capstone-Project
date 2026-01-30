import { AddDish } from "../../components/admin/AddDish"

export const AddDishPage = () => {
    return (
        <div>
            <h2 className="text-6xl font-bold text-center">
                Add New Dish
            </h2>
            <div className="mt-10">
                <AddDish />
            </div>
        </div>
    )
}