import { AddDish } from "../../components/admin/AddDish"

export const AddDishPage = () => {
    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">
                Add New Dish
            </h2>
            <div>
                <AddDish />
            </div>
        </div>
    )
}