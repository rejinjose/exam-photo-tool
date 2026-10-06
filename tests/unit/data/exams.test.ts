import { describe, expect, it } from "vitest";
import { validateExamPresets, type ExamPreset } from "../../../src/lib/exam-schema";
import exams from "../../../src/data/exams.json";

describe("src/data/exams.json", () => {
  it("passes the validator", () => {
    expect(validateExamPresets(exams as ExamPreset[])).toEqual([]);
  });
});
