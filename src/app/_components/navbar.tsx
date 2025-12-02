// src/_components/Navbar.tsx (ou onde estiver sua navbar)
import { auth } from "~/server/auth";

import UserAvatar from "./UserAvatar"; // Importe o componente que criamos acima
import Link from "next/link"; // Recomendado usar Link ao invés de <a>

export default async function Navbar() {
	// Busca a sessão no servidor (Server Side)
	const session = await auth();

	return (
		
		<div className="navbar bg-white text-slate-900 shadow-sm sticky top-0 z-50">
			<div>
				{/* 👇 O "DD" do React 👇 */}
				<div className="fixed bottom-0 left-0 w-full bg-black text-green-400 p-4 z-50 overflow-auto max-h-60 font-mono text-xs">
					<pre>{JSON.stringify(session, null, 2)}</pre>
				</div>
			</div>
			<div className="flex-1">
				<a className="btn btn-ghost text-xl">daisyUI</a>
				<button className="btn btn-ghost">Botão 1</button>
				<button className="btn btn-ghost">Botão 2</button>
			</div>
			<div className="flex gap-2">
				<div className="dropdown dropdown-end">
					<div
						tabIndex={0}
						role="button"
						// O trigger do dropdown envolve o nosso componente
					>
						{/* AQUI ESTÁ A MÁGICA: Passamos a imagem do server pro client */}
						<UserAvatar image={session?.user?.image} />
					</div>
					<ul
						tabIndex={-1}
						className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li>
							<a className="justify-between">Profile</a>
						</li>
						<li>
							<a>Settings</a>
						</li>
						<li>
							{/* O Logout no server side geralmente requer um form ou client component */}
							<Link href="/api/auth/signout">Logout</Link>
						</li>
					</ul>
				</div>
			</div>
			
		</div>
	);
}
