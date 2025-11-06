import Ask from "../components/Ask";
import { documents } from "../lib/corpus";

export default function HomePage() {
  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="mark">Quarry</p>
          <h1>Ask the library. See the page.</h1>
        </div>
        <p className="note">Answers are assembled only from stored passages. If the library is silent, Quarry says so.</p>
      </header>
      <Ask documents={documents.map(({ id, title, shelf }) => ({ id, title, shelf }))} />
    </div>
  );
}
