const stop = new Set(["the", "a", "an", "and", "or", "to", "for", "of", "in", "on", "is", "it", "my", "we", "you", "our", "with", "that", "this"]);

export function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !stop.has(word));
}

export function chunkDocument(document) {
  const parts = String(document.body || "")
    .split(/(?<=[.!?])\s+/)
    .map((text) => text.trim())
    .filter(Boolean);
  return parts.map((text, index) => ({
    id: `${document.id}-${index + 1}`,
    documentId: document.id,
    title: document.title,
    text,
  }));
}

export function retrieve(question, documents, limit = 3) {
  const wanted = new Set(tokens(question));
  const chunks = documents.flatMap(chunkDocument);
  if (wanted.size === 0) return [];
  return chunks
    .map((chunk) => {
      const words = tokens(chunk.text);
      const hits = words.filter((word) => wanted.has(word)).length;
      return { chunk, score: hits / wanted.size };
    })
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function answerQuestion(question, documents) {
  const asked = String(question || "").trim();
  if (!asked) return { ok: false, error: "Ask a question first." };
  const matches = retrieve(asked, documents);
  if (matches.length === 0) {
    return {
      ok: true,
      grounded: false,
      citations: [],
      answer: "Nothing in the library covers that yet. Add a document, or ask with words from a page you already stored.",
    };
  }
  return {
    ok: true,
    grounded: true,
    citations: matches.map((row) => ({ title: row.chunk.title, text: row.chunk.text })),
    answer: matches.map((row) => row.chunk.text).join(" "),
  };
}
