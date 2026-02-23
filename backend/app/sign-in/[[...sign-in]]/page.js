import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="login-container">
            <div className="relative z-10 text-center">
                <div className="login-logo">🚀</div>
                <h1 className="login-title">Fursa</h1>
                <p className="login-subtitle">Sign in to manage your job listings</p>
                <SignIn forceRedirectUrl="/dashboard" />
            </div>
        </div>
    );
}
