import Link from "next/link";
import RegisterForm from "../_components/registerForm";
import { Metadata } from "next";


export const metadata: Metadata = {
	title: "Register",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Cabeçalho */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Crie sua <span className="text-purple-600">conta</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Já possui uma conta?{" "}
          <Link 
            href="/login" 
            className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
          >
            Faça login aqui
          </Link>
        </p>
      </div>

      {/* Card do Formulário */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          <RegisterForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Ao registrar, você aceita nossos Termos
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}