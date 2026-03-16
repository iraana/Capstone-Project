import { VirtualTour } from "../components/VirtualTour"

export const VirtualTourPage = () => {
    return (
        <div className="bg-black w-full overflow-hidden">
            <main className="relative w-screen left-1/2 -translate-x-1/2 h-[calc(100vh-130px)] md:h-[calc(100vh-120px)]">
                <VirtualTour />
            </main>
        </div>
    )
}