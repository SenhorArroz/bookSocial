"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react"; // Verifique se o caminho é este ou "~/utils/api" no seu projeto

// Componente simples de Loading (ou importe o seu)
const Loading = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function RegisterForm() {
  const router = useRouter();

  // ================= CONTROLLER (Lógica de Estado Local) =================
  // O tRPC não fornece 'step' ou 'formData', nós criamos aqui:
  
  const [step, setStep] = useState(1);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    photo: "", // Será uma string Base64
  });

  // Conexão com o Backend (apenas para enviar os dados)
  const registerMutation = api.user.register.useMutation({
    onSuccess: () => {
      // Sucesso: Redirecionar
      router.push("/login"); 
    },
  });

  // Variáveis auxiliares
  const isLoading = registerMutation.isPending; // (Use .isLoading se tRPC < v11)
  const error = registerMutation.error?.message;

  // --- Handlers (Funções de controle) ---

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Preview visual imediato
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);

    // 2. Converter para Base64 (para enviar ao Backend)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, photo: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    // Validação do Passo 1
    if (!formData.name || !formData.email || !formData.password) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmitFinal = (e: FormEvent) => {
    e.preventDefault();
    
    // Remove o campo de confirmação antes de enviar, pois o backend não espera ele
    const { confirmPassword, ...dataToSend } = formData;
    
    // Chama o backend
    registerMutation.mutate(dataToSend);
  };

  // ================= VIEW (JSX) =================
  return (
    <div className="space-y-4">
      {/* Barra de Progresso */}
      <div className="flex justify-between items-center mb-6">
        <div
          className={`h-2 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-purple-600" : "bg-gray-200"}`}
        ></div>
        <div className="mx-2 text-xs text-gray-500 font-medium">
          Passo {step} de 2
        </div>
        <div
          className={`h-2 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`}
        ></div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md animate-pulse">
          {error}
        </div>
      )}

      {/* ================= PASSO 1 ================= */}
      {step === 1 && (
        <form
          onSubmit={handleNextStep}
          className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Próximo
          </button>
        </form>
      )}

      {/* ================= PASSO 2 ================= */}
      {step === 2 && (
        <form
          onSubmit={handleSubmitFinal}
          className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
            <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="mb-4">
                {avatarPreviewUrl ? (
                  <img
                    src={avatarPreviewUrl}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">?</div>
                )}
              </div>

              <div className="text-center">
                <div className="mt-2 flex text-sm leading-6 text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 hover:text-purple-500">
                    <span>Enviar arquivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG até 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição / Bio</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Fale um pouco sobre si..."
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex w-1/3 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-2/3 justify-center rounded-md bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loading /> : "Concluir Cadastro"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}