import test from "node:test";
import assert from "node:assert/strict";
import { answerQuestion, chunkDocument } from "../lib/rag.js";
import { documents } from "../lib/corpus.js";

test("splits a document into cited passages", () => {
  const chunks = chunkDocument(documents[0]);
  assert.ok(chunks.length >= 1);
  assert.equal(chunks[0].title, "Leave policy");
});

test("answers from the leave policy", () => {
  const result = answerQuestion("How do I request annual leave?", documents);
  assert.equal(result.grounded, true);
  assert.equal(result.citations[0].title, "Leave policy");
  assert.match(result.answer, /five days/);
});

test("refuses a question the library cannot cover", () => {
  const result = answerQuestion("What is the office dog's name?", documents);
  assert.equal(result.grounded, false);
});
