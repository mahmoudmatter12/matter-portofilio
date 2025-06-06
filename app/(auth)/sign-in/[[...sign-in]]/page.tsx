import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <SignIn
            redirectUrl={"/admin"}
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-sky-600 hover:bg-sky-700",
                    }
                }}
            />
        </div>
    );
}