import { Language, ThemeConfig, WidgetsConfig } from "../config";
import { EntityNameType } from "../model";

export type OntologyDesignerConfig = {
  themes?: ThemeConfig[],
  selectedTheme?: string,
  language?: Language | string,
  entityNameType?: EntityNameType,
  widgets?: WidgetsConfig,
}