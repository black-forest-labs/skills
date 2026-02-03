export type ImpactLevel =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM-HIGH"
  | "MEDIUM"
  | "LOW-MEDIUM"
  | "LOW";

export interface CodeExample {
  label: string;
  description?: string;
  code: string;
  language?: string;
  additionalText?: string;
}

export interface Rule {
  id: string;
  title: string;
  section: number;
  subsection?: number;
  impact: ImpactLevel;
  impactDescription?: string;
  explanation: string;
  examples: CodeExample[];
  references?: string[];
  tags?: string[];
}

export interface Section {
  number: number;
  title: string;
  impact: ImpactLevel;
  impactDescription?: string;
  introduction?: string;
  rules: Rule[];
}

export interface SkillMetadata {
  version: string;
  organization: string;
  date: string;
  abstract: string;
  references?: string[];
}

export interface SkillDocument {
  version: string;
  organization: string;
  date: string;
  abstract: string;
  sections: Section[];
  references?: string[];
}
