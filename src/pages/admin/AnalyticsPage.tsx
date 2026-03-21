import { Analytics } from "../../components/admin/analytics/Analytics"
import { NavLink } from "react-router"
import { ArrowLeft } from "lucide-react"

export const AnalyticsPage = () => {
    return (
        <div>
          <div className="mb-8">
            <NavLink
              to="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </NavLink>
          </div>
            <Analytics />
        </div>
    )
}