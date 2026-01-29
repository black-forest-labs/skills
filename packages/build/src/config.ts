import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Base paths
export const SKILLS_DIR = join(__dirname, "../../..", "skills");
export const BUILD_DIR = join(__dirname, "..");

// Skill configurations
export interface SkillConfig {
  name: string;
  title: string;
  description: string;
  skillDir: string;
  rulesDir: string;
  metadataFile: string;
  outputFile: string;
  sectionMap: Record<string, number>;
}

export const SKILLS: Record<string, SkillConfig> = {
  "flux-best-practices": {
    name: "flux-best-practices",
    title: "FLUX Best Practices",
    description: "FLUX image generation prompting and workflows",
    skillDir: join(SKILLS_DIR, "flux-best-practices"),
    rulesDir: join(SKILLS_DIR, "flux-best-practices/rules"),
    metadataFile: join(SKILLS_DIR, "flux-best-practices/metadata.json"),
    outputFile: join(SKILLS_DIR, "flux-best-practices/AGENTS.md"),
    sectionMap: {
      core: 1,
      model: 2,
      flux2: 2,
      flux1: 2,
      t2i: 3,
      i2i: 4,
      json: 5,
      hex: 6,
      typography: 7,
      multi: 8,
      negative: 9,
    },
  },
  "bfl-api": {
    name: "bfl-api",
    title: "BFL API Integration",
    description: "BFL FLUX API integration patterns",
    skillDir: join(SKILLS_DIR, "bfl-api"),
    rulesDir: join(SKILLS_DIR, "bfl-api/rules"),
    metadataFile: join(SKILLS_DIR, "bfl-api/metadata.json"),
    outputFile: join(SKILLS_DIR, "bfl-api/AGENTS.md"),
    sectionMap: {
      endpoint: 1,
      auth: 2,
      polling: 3,
      rate: 4,
      error: 5,
      webhook: 6,
    },
  },
};

// Default skill
export const DEFAULT_SKILL = "flux-best-practices";
