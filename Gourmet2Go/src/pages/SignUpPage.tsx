import { SignUp } from "../components/SignUp"

export const SignUpPage = () => {
    return (
        <div className="h-[140vh] bg-black text-white p-4">
            <h2 className="text-6xl font-bold text-center mt-10 mb-6 pb-20">
                Sign Up
            </h2>
            <div className="flex items-center justify-center">
                <SignUp />
            </div>
        </div>
    );
}