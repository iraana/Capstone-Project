import { SignIn } from "../components/SignIn"

export const SignInPage = () => {
    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h2 className="text-6xl font-bold text-center mt-10 mb-6 pb-20">
                Sign In
            </h2>
            <div className="flex items-center justify-center">
                <SignIn />
            </div>
        </div>
    );
}