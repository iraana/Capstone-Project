import { Gallery } from "../components/Gallery"

export const GalleryPage = () => {
    return (
        <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
                Gallery
            </h1>
            <Gallery />
        </div>
    );
}