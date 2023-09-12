import { GrapholscapeConfig } from "../config";
import { Grapholscape } from "../core";
import DisplayedNamesManager from "../core/displayedNamesManager";
import EntityNavigator from "../core/entity-navigator";
import ThemeManager from "../core/themeManager";
import { DefaultFilterKeyEnum, DefaultThemesEnum, getDefaultFilters, Ontology, RendererStatesEnum } from "../model";
import { DesignerLifeCycle } from "./lifecycle";

export default class DesignerCore extends Grapholscape {
  protected availableRenderers: RendererStatesEnum[] = [RendererStatesEnum.FLOATY];
  protected entityNavigator: EntityNavigator = new EntityNavigator(this)
  protected displayedNamesManager: DisplayedNamesManager = new DisplayedNamesManager(this)
  protected themesManager: ThemeManager
  readonly lifecycle: DesignerLifeCycle = new DesignerLifeCycle()

  constructor(ontology: Ontology, container: HTMLElement, config?: GrapholscapeConfig) {
    super()
    this.on = this.lifecycle.on
    this.ontology = ontology
    this.container = container
    this.renderer.container = container
    this.renderer.lifecycle = this.lifecycle
    this.themesManager = new ThemeManager(this)
    //this.renderer.renderState = new GrapholRendererState()
    if (!config?.selectedTheme) {
      this.themesManager.setTheme(DefaultThemesEnum.GRAPHOLSCAPE)
    }
    if (config) {
      this.setConfig(config)
    }

    this.renderer.filters = new Map()
    this.renderer.filters.set(DefaultFilterKeyEnum.DATA_PROPERTY, getDefaultFilters().DATA_PROPERTY)
    this.renderer.filters.set(DefaultFilterKeyEnum.INDIVIDUAL, getDefaultFilters().INDIVIDUAL)
  }
}