import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative overflow-hidden bg-slate-50">
            {/* Professional Geometric Background (CSS) */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
            </div>

            <div className="flex w-full max-w-sm flex-col gap-6 relative z-10 animate-enter">
                <a href="#" className="flex items-center gap-2 self-center font-medium text-foreground mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <span className="text-xl font-bold">HR</span>
                    </div>
                    <span className="text-2xl tracking-tight font-bold">Acme Inc.</span>
                </a>
                <div className="bg-white p-1 rounded-xl shadow-xl border border-border/50">
                    <div className="bg-white rounded-lg p-6">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
