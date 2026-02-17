import { CancelledOrders } from "../../components/admin/CancelledOrders"

export const CancelledOrdersPage = () => {
    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">Cancelled Orders</h2>
            <div>
                <CancelledOrders />
            </div>
        </div>
    )
}
