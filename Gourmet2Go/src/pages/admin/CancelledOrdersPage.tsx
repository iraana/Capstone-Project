import { CancelledOrders } from "../../components/admin/CancelledOrders"
import { NavLink } from "react-router"
import { ArrowLeft } from "lucide-react"

export const CancelledOrdersPage = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">

        <NavLink
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </NavLink>


         {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Cancelled Orders
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage cancelled orders.
          </p>
        </div>

        <CancelledOrders />

      </div>
    </div>
  )
}