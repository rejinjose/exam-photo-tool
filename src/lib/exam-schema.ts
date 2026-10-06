export type ImageFormat = "jpg" | "png";

const ALLOWED_FORMATS: readonly ImageFormat[] = ["jpg", "png"];

export interface SizeRule {
  minKB: number;
  maxKB: number;
  width: number;
  height: number;
  /** Validated against `ImageFormat` only once the preset is `verified`. */
  format: string;
}

export interface ExamPreset {
  id: string;
  name: string;
  body: string;
  photo: SizeRule;
  signature: SizeRule;
  notes: string;
  source: string;
  lastVerified: string;
  verified: boolean;
}

export interface ValidationError {
  presetId: string;
  message: string;
}

/**
 * Validates a list of exam presets.
 *
 * Duplicate ids, and verified presets missing `source`/`lastVerified`, are
 * always rejected. Dimension/range/format checks on `photo`/`signature` only
 * apply once a preset is `verified` -- an unverified placeholder (not yet
 * backed by an official notification) is allowed to carry zeroed values.
 */
export function validateExamPresets(presets: ExamPreset[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();

  for (const preset of presets) {
    if (seenIds.has(preset.id)) {
      errors.push({ presetId: preset.id, message: `Duplicate id "${preset.id}".` });
    }
    seenIds.add(preset.id);

    if (preset.verified && (!preset.source || !preset.lastVerified)) {
      errors.push({
        presetId: preset.id,
        message: "verified presets require both source and lastVerified.",
      });
    }

    if (preset.verified) {
      errors.push(...validateSizeRule(preset.id, "photo", preset.photo));
      errors.push(...validateSizeRule(preset.id, "signature", preset.signature));
    }
  }

  return errors;
}

function validateSizeRule(
  presetId: string,
  field: "photo" | "signature",
  rule: SizeRule,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (rule.minKB > rule.maxKB) {
    errors.push({
      presetId,
      message: `${field}.minKB (${rule.minKB}) is greater than ${field}.maxKB (${rule.maxKB}).`,
    });
  }

  if (rule.width <= 0 || rule.height <= 0) {
    errors.push({
      presetId,
      message: `${field} has non-positive dimensions (${rule.width}x${rule.height}).`,
    });
  }

  if (!ALLOWED_FORMATS.includes(rule.format as ImageFormat)) {
    errors.push({
      presetId,
      message: `${field}.format "${rule.format}" is not a supported format (${ALLOWED_FORMATS.join(", ")}).`,
    });
  }

  return errors;
}
