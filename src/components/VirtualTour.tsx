export const VirtualTour = () => {
    return (
        <div className="w-full h-full bg-black">
            <iframe 
                title="Sault College Culinary Virtual Tour"
                className="block w-full h-full border-0 outline-none"
                src="https://virtualtour.saultcollege.ca/sault/culinary"
                allowFullScreen
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    )
}