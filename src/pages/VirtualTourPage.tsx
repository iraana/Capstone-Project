import { VirtualTour } from "../components/VirtualTour"

export const VirtualTourPage = () => {
    return (
    <main className="bg-black -mx-4 -mt-6 overflow-hidden">
            <div className="w-full h-[75vh] min-h-[600px]">
                <VirtualTour />
            </div>
    </main>
    )
}