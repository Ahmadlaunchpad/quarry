"use client";

import { useState } from "react";

export default function Ask({ documents }) {
  const [question, setQuestion] = useState("How do I request annual leave?");
  const [answer, setAnswer] = useState("The passage will be set here, with the document it came from.");
  const [citations, setCitations] = useState([]);
  const [busy, setBusy] = useState(false);

  async function onAsk(nextQuestion) {
    const text = nextQuestion || question;
    setQuestion(text);
    setBusy(true);
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: text }),
    });
    const data = await response.json();
    setAnswer(data.answer || data.error);
    setCitations(data.citations || []);
    setBusy(false);
  }

  return (
    <div className="layout">
      <aside>
        <p className="kicker">Shelves</p>
        {documents.map((document) => (
          <button key={document.id} type="button" onClick={() => onAsk(`What does ${document.title} say?`)}>
            <strong>{document.title}</strong>
            <span>{document.shelf}</span>
          </button>
        ))}
      </aside>
      <section className="sheet">
        <label htmlFor="question">Question</label>
        <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} />
        <button className="ask" type="button" onClick={() => onAsk()} disabled={busy}>
          {busy ? "Searching" : "Ask the library"}
        </button>
        <h2>Answer</h2>
        <p className="answer">{answer}</p>
        {citations.length > 0 && (
          <ol className="cites">
            {citations.map((cite) => (
              <li key={`${cite.title}-${cite.text.slice(0, 24)}`}>
                <strong>{cite.title}</strong>
                <span>{cite.text}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
