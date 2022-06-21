import { RenderStatesEnum } from "../model"
import { DefaultThemes, DefaultThemesEnum } from "../model/theme"
import { ColourMap } from "../style/themes"
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

export type ThemeConfig = {
  id: string,
  name?: string,
  colours: ColourMap,
} | DefaultThemesEnum


export type GrapholscapeConfig =
  WidgetsConfig &
  {
    themes?: ThemeConfig[],
    selectedTheme?: string,
    language?: Language | string,
    entityNameType?: EntityNameType,
    renderers?: RenderStatesEnum[],
  }