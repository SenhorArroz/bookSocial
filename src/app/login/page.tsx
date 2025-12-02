import Link from "next/link";
import LoginsButtons from "../../components/LoginsButtons";
import { Metadata } from "next";


export const metadata: Metadata = {
	title: "Login",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function LoginPage() {
	return (
		// 1. Container principal: Tela cheia, fundo cinza claro, conteúdo centralizado
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			{/* 2. Cabeçalho: Título e Link para Registro */}
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				{/* Você pode colocar um <Image src="/logo.png" ... /> aqui */}
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
					Entre na sua <span className="text-purple-600">conta</span>
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Ou{" "}
					<Link
						href="/register"
						className="font-medium text-purple-600 transition-colors"
					>
						crie uma nova
					</Link>
				</p>
			</div>

			{/* 3. Card Branco: Onde os botões ficam */}
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
					{/* Componente de Botões importado */}
					<LoginsButtons />

					{/* Rodapé opcional dentro do card (ex: Termos) */}
					<div className="mt-6">
						<div className="relative">
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
