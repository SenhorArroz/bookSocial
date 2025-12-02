import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // npm install bcryptjs @types/bcryptjs
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validar se usuário existe
    const exists = await db.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json({ message: "Email já cadastrado" }, { status: 400 });
    }

    // 2. Hash da senha (NUNCA salve senha pura)
    const hashedPassword = await hash(password, 10);

    // 3. Criar usuário
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Usuário criado" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro no servidor" }, { status: 500 });
  }
}