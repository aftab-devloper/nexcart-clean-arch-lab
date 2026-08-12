import { NextRequest, NextResponse } from "next/server";
import { GroqDescriptionAdapter } from "../../../../modules/product/adapters/groq-description.adapter";
import { EnhanceDescriptionCommand } from "../../../../modules/product/application/enhance-description.command";

const aiDescriptionService = new GroqDescriptionAdapter();

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.description) {
    return NextResponse.json({ error: "name and description are required" }, { status: 400 });
  }

  const command = new EnhanceDescriptionCommand(aiDescriptionService);
  const enhanced = await command.execute(body);

  return NextResponse.json({ enhanced });
}