import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Dados recebidos no backend com sucesso: ", data);

    return NextResponse.json(
      { message: "Dados recebidos com sucesso!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao receber dados na rota de pdf! ", error);
    return NextResponse.json({ error: "Error!" }, { status: 500 });
  }
}
