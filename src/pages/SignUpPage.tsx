import { SignUp } from "../components/SignUp"


export const SignUpPage = () => {
    return (
        <main className="bg-white dark:bg-zinc-950 transition-colors duration-300 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl"> 
                <h2 className="text-center text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white mb-10">
                    Sign Up
                </h2>
                <SignUp />
            </div>
        </main>
    );
}