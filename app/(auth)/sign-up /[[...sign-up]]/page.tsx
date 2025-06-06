import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-sky-600 hover:bg-sky-700",
                    }
                }}
            />
        </div>
    );
}