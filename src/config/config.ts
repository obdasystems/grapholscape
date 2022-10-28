import { GrapholscapeTheme, DefaultThemesEnum, RendererStatesEnum } from "../model"
import { WidgetEnum } from "../ui/util/widget-enum"

export enum Language {
  DE = 'de',
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  IT = 'it',
}

export enum EntityNameType {
  LABEL = 'label',
  PREFIXED_IRI = 'prefixedIri',
  FULL_IRI = 'fullIri'
}

export type WidgetsConfig = { [key in WidgetEnum]?: boolean }

export type ThemeConfig = GrapholscapeTheme | DefaultThemesEnum


export type GrapholscapeConfig =
  {
    themes?: ThemeConfig[],
    selectedTheme?: string,
    language?: Language | string,
    entityNameType?: EntityNameType,
    renderers?: RendererStatesEnum[],
    selectedRenderer?: RendererStatesEnum,
    widgets?: WidgetsConfig,
    initialRendererSelection?: boolean,
  }