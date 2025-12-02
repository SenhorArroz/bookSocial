import { Book } from "lucide-react";
import LoginButton from "../components/LoginButton";

export default function Home() {
	return (
		<>
			<main className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-8">
				<h1 className="text-5xl font-extrabold mb-12 tracking-tight sm:text-[5rem]">
					Gerenciador de <span className="text-purple-600">Livros</span>
				</h1>

				<div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-200 shadow-2xl">
					<div className="flex-1 space-y-6">
						<h2 className="text-3xl font-bold text-purple-700">Bem-vindo</h2>
						<p className="text-lg leading-relaxed text-slate-600">
							Este sistema reúne, em um único ambiente, todas as ferramentas
							necessárias para organizar e desenvolver livros. Ele permite
							cadastrar personagens e locais com nome, imagem e descrição; criar
							capítulos com numeração, título e um editor de texto próprio;
							registrar ideias e anotações; e armazenar ilustrações relacionadas
							ao projeto. A plataforma oferece organização e praticidade,
							facilitando o processo criativo do autor do início ao fim.
						</p>
					</div>

					<div className="flex-1 flex justify-center items-center p-4">
						<div className="relative group">
							<div className="absolute inset-0 bg-purple-200 blur-[60px] opacity-60 rounded-full group-hover:opacity-80 transition-opacity duration-500"></div>
							<Book
								className="w-48 h-48 md:w-64 md:h-64 text-purple-600 relative z-10 drop-shadow-lg transform group-hover:scale-105 transition-transform duration-500"
								strokeWidth={1.5}
							/>
						</div>
					</div>
				</div>
			</main>
			<LoginButton />
		</>
	);
}
