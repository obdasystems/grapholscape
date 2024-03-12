import { LifecycleEvent, RendererStatesEnum } from '../../model'
import { GscapeEntityColorLegend, GscapeEntitySelector, IBaseMixin, IncrementalInitialMenu, WidgetEnum, createEntitiesList, setColorList } from '../../ui'
import { GscapeExplorer } from '../../ui/ontology-explorer'
import IncrementalController from '../controller'
import { IncrementalEvent } from '../lifecycle'
import { CommandsWidgetFactory } from './commands-widget'
import { IncrementalEntityDetailsFactory } from './incremental-entity-details'
import { moveUpLeft } from './move-widget'
import { NavigationMenuFactory } from './navigation-menu'
import { NodeButtonsFactory } from './node-buttons'
import { manageWidgetsOnActivation, manageWidgetsOnDeactivation, onEmptyDiagram, onIncrementalStartup } from './ui-handlers'

export * from './commands-widget'
export * from './incremental-entity-details'
// export * from './instances-explorer'
export * from './move-widget'
export * from './navigation-menu'
export * from './node-buttons'
export * from './ui-handlers'
export { default as showMenu } from './show-menu'
// export * from './vkg-preferences'

export function initIncrementalUI(ic: IncrementalController) {
  IncrementalEntityDetailsFactory(ic)
  NavigationMenuFactory(ic)
  // InstanceExplorerFactory(ic)
  CommandsWidgetFactory(ic)
  NodeButtonsFactory(ic)

  let initialMenu = ic
    .grapholscape
    .widgets
    .get(WidgetEnum.INCREMENTAL_INITIAL_MENU) as IncrementalInitialMenu

  if (!initialMenu) {
    // initEntitySelector(incrementalController.grapholscape)
    initialMenu = new IncrementalInitialMenu(ic.grapholscape)
    ic.grapholscape.widgets.set(WidgetEnum.INCREMENTAL_INITIAL_MENU, initialMenu)
  }

  initialMenu.addEventListener('class-selection', (e: CustomEvent) => {
    ic.addClass(e.detail, true)
    moveUpLeft(initialMenu)
    initialMenu.closePanel()
  })

  ic.grapholscape.uiContainer?.appendChild(initialMenu)

  if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    onIncrementalStartup(ic)
  } else {
    manageWidgetsOnDeactivation(ic.grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>)
  }

  // CORE's lifecycle reactions 
  ic.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {

    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      onIncrementalStartup(ic)
    } else {
      manageWidgetsOnDeactivation(ic.grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>)
    }
  })

  ic.on(IncrementalEvent.DiagramUpdated, () => {
    const initialMenu = ic.grapholscape.widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU) as unknown as GscapeEntitySelector | undefined
    if (ic.grapholscape.renderer.cy?.elements().empty()) {
      onEmptyDiagram(ic.grapholscape)
    } else {
      if (initialMenu) {
        moveUpLeft(initialMenu)
      }

      const entityColorLegend = ic.grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend | undefined
      if (entityColorLegend) {
        setColorList(entityColorLegend, ic.grapholscape)
        entityColorLegend.enable()
      }
    }


    const ontologyExplorer = ic.grapholscape.widgets.get(WidgetEnum.ONTOLOGY_EXPLORER) as GscapeExplorer | undefined
    if (ontologyExplorer) {
      ontologyExplorer.entities = createEntitiesList(ic.grapholscape, ontologyExplorer.searchEntityComponent)
        .filter(e => e.viewOccurrences && e.viewOccurrences.size > 0)
    }
  })

  ic.on(IncrementalEvent.Reset, () => {
    if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      manageWidgetsOnActivation(
        ic.grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>,
        true
      )
      onEmptyDiagram(ic.grapholscape)
    }
  })
}