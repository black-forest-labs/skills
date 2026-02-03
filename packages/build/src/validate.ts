import { access, readdir, readFile } from "fs/promises";
import { SKILLS } from "./config.js";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function validate() {
  console.log("Validating AGENTS.md files...\n");
  let hasErrors = false;

  for (const [name, skill] of Object.entries(SKILLS)) {
    console.log(`Checking ${name}...`);

    // Check if rules directory exists
    if (!(await fileExists(skill.rulesDir))) {
      console.log(`  Skipped: rules directory not found`);
      continue;
    }

    // Check if AGENTS.md exists
    if (!(await fileExists(skill.outputFile))) {
      console.error(`  ERROR: AGENTS.md not found at ${skill.outputFile}`);
      hasErrors = true;
      continue;
    }

    // Count rule files
    const files = await readdir(skill.rulesDir);
    const ruleFiles = files.filter(
      (f) => f.endsWith(".md") && !f.startsWith("_") && f !== "README.md",
    );

    // Read AGENTS.md and count rules
    const agentsContent = await readFile(skill.outputFile, "utf-8");
    const ruleMatches = agentsContent.match(/^### \d+\.\d+ /gm);
    const agentsRuleCount = ruleMatches ? ruleMatches.length : 0;

    console.log(`  Rule files: ${ruleFiles.length}`);
    console.log(`  Rules in AGENTS.md: ${agentsRuleCount}`);

    if (ruleFiles.length !== agentsRuleCount) {
      console.warn(
        `  WARNING: Rule count mismatch - run 'pnpm build' to regenerate`,
      );
    } else {
      console.log(`  OK`);
    }
  }

  if (hasErrors) {
    console.error("\nValidation failed");
    process.exit(1);
  }

  console.log("\nValidation complete");
}

validate();
