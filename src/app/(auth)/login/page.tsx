import LoginForm from "@/components/auth/login-form";

/**
 * Login Page - ADN Cuarzo Studio
 * Minimalismo extremo: Centrado perfecto y fondo sutil.
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] p-4">
      <section className="w-full max-w-100 animate-in fade-in duration-700">
        <LoginForm />
      </section>
    </main>
  );
}