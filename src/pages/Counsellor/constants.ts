// Available languages in Sri Lanka
export const AVAILABLE_LANGUAGES = ["English", "Sinhala", "Tamil"] as const;

// Type for language values
export type Language = typeof AVAILABLE_LANGUAGES[number];
