"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react"; 
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../app/_components/loading"; 

const LoginsButtons = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para ler a URL
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Efeito para capturar erros vindos do Google (URL params)
  useEffect(() => {
    const errorUrl = searchParams.get("error");
    if (errorUrl === "OAuthAccountNotLinked") {
      setError("Este email já está registrado com outro método (senha). Faça login com senha para vincular.");
    } else if (errorUrl) {
      setError("Ocorreu um erro ao fazer login com o provedor.");
    }
  }, [searchParams]);

  // Lógica para Login com Email/Senha
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error === "Configuration") {
        setError("Erro de configuração no servidor.");
      } else if (result.error === "AccessDenied") {
        setError("Acesso negado.");
      } else if (result.error === "CredentialsSignin") {
        setError("Email ou senha incorretos.");
      } else {
        setError("Email ou senha incorretos.");
      }
      setIsLoading(false);
    } else {
      router.push("/dashboard"); 
      router.refresh(); 
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full">
      {/* Formulário de Email e Senha */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        
        {/* Exibe erro se houver */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loading /> : "Entrar"}
          </button>
        </div>
      </form>

      {/* Divisor Visual */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Ou continue com</span>
          </div>
        </div>
      </div>

      {/* Botão do Google */}
      <div className="mt-6">
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="flex w-full justify-center items-center gap-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
             <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.6c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
      </div>
    </div>
  );
};

export default LoginsButtons;