import { answerQuestion } from "../../../lib/rag";
import { documents } from "../../../lib/corpus";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const result = answerQuestion(body.question, documents);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
