import { ListDishes } from "../../components/admin/ListDishes"

export const ListDishesPage = () => {
    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12">All Dishes</h2>
            <div>
                <ListDishes />
            </div>
        </div>
    )
}