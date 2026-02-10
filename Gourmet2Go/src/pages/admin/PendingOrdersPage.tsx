import { PendingOrders } from "../../components/admin/PendingOrders"

export const PendingOrdersPage = () => {
    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">Pending Orders</h2>
            <div>
                <PendingOrders />
            </div>
        </div>
    )
}