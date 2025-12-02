import { z } from "zod";
import { hash } from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Instale: npm i uuid && npm i -D @types/uuid

export const userRouter = createTRPCRouter({
	register: publicProcedure
		.input(
			z.object({
				name: z.string().min(1, "O nome é obrigatório"),
				email: z.string().email("Email inválido"),
				password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
				description: z.string().optional(),
				photo: z.string().optional(), // Recebe o Base64 do Frontend
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// 1. Verificar duplicação
			const existingUser = await ctx.db.user.findUnique({
				where: { email: input.email },
			});

			if (existingUser) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Este email já está registrado.",
				});
			}

			// 2. Criptografar senha
			const hashedPassword = await hash(input.password, 12);

			// 3. Lógica de Upload (Salvar Arquivo Físico)
			let imagePath = null; // Caminho final para o banco

			if (input.photo) {
				try {
					// A string vem como "data:image/png;base64,iVBORw0KGgo..."
					// Precisamos separar o cabeçalho dos dados reais
					const matches = input.photo.match(
						/^data:([A-Za-z-+\/]+);base64,(.+)$/,
					);

					if (matches && matches.length === 3 && matches[2]) {
						const fileType = matches[1]; // ex: image/png
						const buffer = Buffer.from(matches[2], "base64");

						// Gerar nome único
						const extension = fileType?.split("/")[1] || "png";
						const fileName = `${uuidv4()}.${extension}`;

						// Definir onde salvar (Pasta public/uploads na raiz do projeto)
						// Certifique-se de criar a pasta "uploads" dentro de "public" manualmente ou via código
						const uploadDir = path.join(process.cwd(), "public", "uploads");

						// Garante que a pasta existe
						if (!fs.existsSync(uploadDir)) {
							fs.mkdirSync(uploadDir, { recursive: true });
						}

						// Escreve o arquivo no disco
						fs.writeFileSync(path.join(uploadDir, fileName), buffer);

						// O caminho a ser salvo no banco (acessível via navegador)
						imagePath = `/uploads/${fileName}`;
					}
				} catch (error) {
					console.error("Erro ao salvar imagem:", error);
					// Opcional: throw new TRPCError(...) se a imagem for obrigatória
				}
			}

			// Fallback para avatar padrão se não houver upload
			if (!imagePath) {
				imagePath = `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=random`;
			}

			// 4. Criar utilizador salvando o CAMINHO
			const user = await ctx.db.user.create({
				data: {
					name: input.name,
					email: input.email,
					password: hashedPassword,
					description: input.description,
					image: imagePath, // Salva "/uploads/uuid.png"
				},
			});

			return {
				status: 201,
				message: "Conta criada com sucesso!",
				userId: user.id,
			};
		}),
});
