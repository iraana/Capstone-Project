import { Analytics } from "../../components/admin/Analytics"

export const AnalyticsPage = () => {
    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-5">
                Analytiks
            </h2>
            <div>
                <Analytics />
            </div>
        </div>
    )
}