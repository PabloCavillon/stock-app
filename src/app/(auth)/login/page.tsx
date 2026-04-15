import LoginForm from "@/components/auth/login-form";


export const metadata = {
  title: 'Login', 
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-4">
      <section className="w-full max-w-100 animate-in fade-in duration-700">
        <LoginForm />
      </section>
    </main>
  );
}