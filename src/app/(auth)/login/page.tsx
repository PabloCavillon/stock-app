import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] p-4 md:p-0 selection:bg-black selection:text-white">
      {/* Container ensures the form is centered and never gets too wide 
        on large screens (max-w-md).
      */}
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}