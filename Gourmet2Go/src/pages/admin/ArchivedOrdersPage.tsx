import { ArchivedOrders } from "../../components/admin/ArchivedOrders"

export const ArchivedOrdersPage = () => {
    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">Archived Orders</h2>
            <div>
                <ArchivedOrders />
            </div>
        </div>
    )
}