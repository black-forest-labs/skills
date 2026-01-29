import { access, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { DEFAULT_SKILL, SkillConfig, SKILLS } from "./config.js";
import { parseRuleFile, RuleFile } from "./parser.js";
import { ImpactLevel, Section, SkillMetadata } from "./types.js";

// Parse command line arguments
const args = process.argv.slice(2);
const upgradeVersion = args.includes("--upgrade-version");
const skillArg = args.find((arg) => arg.startsWith("--skill="));
const skillName = skillArg ? skillArg.split("=")[1] : null;
const buildAll = args.includes("--all");

/**
 * Increment a semver-style version string
 */
function incrementVersion(version: string): string {
  const parts = version.split(".").map(Number);
  parts[parts.length - 1]++;
  return parts.join(".");
}

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate markdown from rules
 */
function generateMarkdown(
  sections: Section[],
  metadata: SkillMetadata,
  skillConfig: SkillConfig,
): string {
  let md = `# ${skillConfig.title}\n\n`;
  md += `**Version ${metadata.version}**  \n`;
  md += `${metadata.organization}  \n`;
  md += `${metadata.date}\n\n`;
  md += `> **Note:**  \n`;
  md += `> This document is for AI agents and LLMs to follow when working with  \n`;
  md += `> ${skillConfig.description}. Humans may also find it useful,  \n`;
  md += `> but guidance here is optimized for automation and consistency.  \n\n`;
  md += `---\n\n`;
  md += `## Abstract\n\n`;
  md += `${metadata.abstract}\n\n`;
  md += `---\n\n`;
  md += `## Table of Contents\n\n`;

  // Generate TOC
  sections.forEach((section) => {
    const sectionAnchor = `${section.number}-${section.title.toLowerCase().replace(/\s+/g, "-")}`;
    md += `${section.number}. [${section.title}](#${sectionAnchor}) - **${section.impact}**\n`;
    section.rules.forEach((rule) => {
      const anchor = `${rule.id} ${rule.title}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      md += `   - ${rule.id} [${rule.title}](#${anchor})\n`;
    });
  });

  md += `\n---\n\n`;

  // Generate sections
  sections.forEach((section) => {
    md += `## ${section.number}. ${section.title}\n\n`;
    md += `**Impact: ${section.impact}${
      section.impactDescription ? ` (${section.impactDescription})` : ""
    }**\n\n`;
    if (section.introduction) {
      md += `${section.introduction}\n\n`;
    }

    section.rules.forEach((rule) => {
      md += `### ${rule.id} ${rule.title}\n\n`;
      md += `**Impact: ${rule.impact}${
        rule.impactDescription ? ` (${rule.impactDescription})` : ""
      }**\n\n`;
      md += `${rule.explanation}\n\n`;

      rule.examples.forEach((example) => {
        if (example.description) {
          md += `**${example.label}: ${example.description}**\n\n`;
        } else {
          md += `**${example.label}:**\n\n`;
        }
        if (example.code && example.code.trim()) {
          md += `\`\`\`${example.language || "text"}\n`;
          md += `${example.code}\n`;
          md += `\`\`\`\n\n`;
        }
        if (example.additionalText) {
          md += `${example.additionalText}\n\n`;
        }
      });

      if (rule.references && rule.references.length > 0) {
        md += `Reference: ${rule.references
          .map((ref) => `[${ref}](${ref})`)
          .join(", ")}\n\n`;
      }
    });

    md += `---\n\n`;
  });

  // Add references section
  if (metadata.references && metadata.references.length > 0) {
    md += `## References\n\n`;
    metadata.references.forEach((ref, i) => {
      md += `${i + 1}. [${ref}](${ref})\n`;
    });
  }

  return md;
}

/**
 * Build a single skill
 */
async function buildSkill(skillConfig: SkillConfig) {
  console.log(`\nBuilding ${skillConfig.name}...`);
  console.log(`  Rules directory: ${skillConfig.rulesDir}`);
  console.log(`  Output file: ${skillConfig.outputFile}`);

  // Check if rules directory exists
  if (!(await fileExists(skillConfig.rulesDir))) {
    console.log(`  Skipping: rules directory does not exist`);
    return;
  }

  // Read all rule files
  const files = await readdir(skillConfig.rulesDir);
  const ruleFiles = files
    .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f !== "README.md")
    .sort();

  if (ruleFiles.length === 0) {
    console.log(`  Skipping: no rule files found`);
    return;
  }

  const ruleData: RuleFile[] = [];
  for (const file of ruleFiles) {
    const filePath = join(skillConfig.rulesDir, file);
    try {
      const parsed = await parseRuleFile(filePath, skillConfig.sectionMap);
      ruleData.push(parsed);
    } catch (error) {
      console.error(`  Error parsing ${file}:`, error);
    }
  }

  // Group rules by section
  const sectionsMap = new Map<number, Section>();

  ruleData.forEach(({ section, rule }) => {
    if (!sectionsMap.has(section)) {
      sectionsMap.set(section, {
        number: section,
        title: `Section ${section}`,
        impact: rule.impact,
        rules: [],
      });
    }
    sectionsMap.get(section)!.rules.push(rule);
  });

  // Sort rules within each section
  sectionsMap.forEach((section) => {
    section.rules.sort((a, b) =>
      a.title.localeCompare(b.title, "en-US", { sensitivity: "base" }),
    );

    section.rules.forEach((rule, index) => {
      rule.id = `${section.number}.${index + 1}`;
      rule.subsection = index + 1;
    });
  });

  // Convert to array and sort
  const sections = Array.from(sectionsMap.values()).sort(
    (a, b) => a.number - b.number,
  );

  // Read section metadata if exists
  const sectionsFile = join(skillConfig.rulesDir, "_sections.md");
  if (await fileExists(sectionsFile)) {
    try {
      const sectionsContent = await readFile(sectionsFile, "utf-8");
      const sectionBlocks = sectionsContent
        .split(/(?=^## \d+\. )/m)
        .filter(Boolean);

      for (const block of sectionBlocks) {
        const headerMatch = block.match(
          /^## (\d+)\.\s+(.+?)(?:\s+\([^)]+\))?$/m,
        );
        if (!headerMatch) continue;

        const sectionNumber = parseInt(headerMatch[1]);
        const sectionTitle = headerMatch[2].trim();

        const impactMatch = block.match(/\*\*Impact:\*\*\s+(\w+(?:-\w+)?)/i);
        const impactLevel = impactMatch
          ? (impactMatch[1].toUpperCase().replace(/-/g, "-") as ImpactLevel)
          : "MEDIUM";

        const descMatch = block.match(
          /\*\*Description:\*\*\s+(.+?)(?=\n\n##|$)/s,
        );
        const description = descMatch ? descMatch[1].trim() : "";

        const section = sections.find((s) => s.number === sectionNumber);
        if (section) {
          section.title = sectionTitle;
          section.impact = impactLevel;
          section.introduction = description;
        }
      }
    } catch {
      console.warn("  Warning: Could not read _sections.md");
    }
  }

  // Read metadata
  let metadata: SkillMetadata;
  try {
    const metadataContent = await readFile(skillConfig.metadataFile, "utf-8");
    metadata = JSON.parse(metadataContent);
  } catch {
    metadata = {
      version: "1.0.0",
      organization: "Black Forest Labs",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      abstract: `Guide for ${skillConfig.description}, organized by category.`,
    };
  }

  // Upgrade version if requested
  if (upgradeVersion) {
    const oldVersion = metadata.version;
    metadata.version = incrementVersion(oldVersion);
    console.log(`  Upgrading version: ${oldVersion} -> ${metadata.version}`);

    await writeFile(
      skillConfig.metadataFile,
      JSON.stringify(metadata, null, 2) + "\n",
      "utf-8",
    );
    console.log(`  Updated metadata.json`);
  }

  // Generate markdown
  const markdown = generateMarkdown(sections, metadata, skillConfig);

  // Write output
  await writeFile(skillConfig.outputFile, markdown, "utf-8");

  console.log(
    `  Built AGENTS.md with ${sections.length} sections and ${ruleData.length} rules`,
  );
}

/**
 * Main build function
 */
async function build() {
  try {
    console.log("Building AGENTS.md from rules...");

    if (buildAll) {
      for (const skill of Object.values(SKILLS)) {
        await buildSkill(skill);
      }
    } else if (skillName) {
      const skill = SKILLS[skillName];
      if (!skill) {
        console.error(`Unknown skill: ${skillName}`);
        console.error(`Available skills: ${Object.keys(SKILLS).join(", ")}`);
        process.exit(1);
      }
      await buildSkill(skill);
    } else {
      await buildSkill(SKILLS[DEFAULT_SKILL]);
    }

    console.log("\nBuild complete");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
