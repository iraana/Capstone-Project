export const NotFoundPage = () => {
    return (
        <div>
            <h2 className="text-6xl font-bold text-center">
                404 - Page Not Found
            </h2>
            <p className="text-md text-center mt-15 mb-2">
                The page you are looking for does not exist.
            </p>
            <a href="/" className="block text-blue-500 text-md text-center underline">
                Go back to Home
            </a>
        </div>
    );
}