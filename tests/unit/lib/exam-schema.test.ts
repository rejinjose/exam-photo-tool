import { describe, expect, it } from "vitest";
import { validateExamPresets, type ExamPreset, type SizeRule } from "../../../src/lib/exam-schema";

function sizeRule(overrides: Partial<SizeRule> = {}): SizeRule {
  return { minKB: 20, maxKB: 50, width: 200, height: 230, format: "jpg", ...overrides };
}

function preset(overrides: Partial<ExamPreset> = {}): ExamPreset {
  return {
    id: "ssc-chsl",
    name: "SSC CHSL",
    body: "Staff Selection Commission",
    photo: sizeRule(),
    signature: sizeRule({ width: 140, height: 60 }),
    notes: "",
    source: "https://ssc.example.gov/notification.pdf",
    lastVerified: "2026-01-01",
    verified: true,
    ...overrides,
  };
}

describe("validateExamPresets", () => {
  it("accepts a fully valid verified preset", () => {
    expect(validateExamPresets([preset()])).toEqual([]);
  });

  it("accepts an unverified placeholder with zeroed values", () => {
    const placeholder = preset({
      verified: false,
      source: "",
      lastVerified: "",
      photo: sizeRule({ minKB: 0, maxKB: 0, width: 0, height: 0, format: "" }),
      signature: sizeRule({ minKB: 0, maxKB: 0, width: 0, height: 0, format: "" }),
    });
    expect(validateExamPresets([placeholder])).toEqual([]);
  });

  it("rejects minKB greater than maxKB on a verified preset", () => {
    const bad = preset({ photo: sizeRule({ minKB: 50, maxKB: 20 }) });
    const errors = validateExamPresets([bad]);
    expect(errors).toContainEqual(
      expect.objectContaining({ presetId: "ssc-chsl", message: expect.stringContaining("minKB") }),
    );
  });

  it("rejects non-positive dimensions on a verified preset", () => {
    const bad = preset({ photo: sizeRule({ width: 0, height: 230 }) });
    const errors = validateExamPresets([bad]);
    expect(errors).toContainEqual(
      expect.objectContaining({
        presetId: "ssc-chsl",
        message: expect.stringContaining("non-positive dimensions"),
      }),
    );
  });

  it("rejects an unknown format on a verified preset", () => {
    const bad = preset({ photo: sizeRule({ format: "bmp" }) });
    const errors = validateExamPresets([bad]);
    expect(errors).toContainEqual(
      expect.objectContaining({ presetId: "ssc-chsl", message: expect.stringContaining("format") }),
    );
  });

  it("rejects a verified preset missing source and lastVerified", () => {
    const bad = preset({ source: "", lastVerified: "" });
    const errors = validateExamPresets([bad]);
    expect(errors).toContainEqual(
      expect.objectContaining({
        presetId: "ssc-chsl",
        message: expect.stringContaining("source and lastVerified"),
      }),
    );
  });

  it("rejects duplicate ids", () => {
    const errors = validateExamPresets([preset(), preset({ name: "SSC CHSL (dup)" })]);
    expect(errors).toContainEqual(
      expect.objectContaining({ presetId: "ssc-chsl", message: expect.stringContaining("Duplicate id") }),
    );
  });
});
