import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="login-container">
            <div className="relative z-10 text-center">
                <div className="login-logo">🚀</div>
                <h1 className="login-title">Join Fursa</h1>
                <p className="login-subtitle">Create an account to start posting jobs</p>
                <SignUp forceRedirectUrl="/dashboard" />
            </div>
        </div>
    );
}
