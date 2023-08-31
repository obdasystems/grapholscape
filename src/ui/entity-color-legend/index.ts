import { Grapholscape } from "../../core";
import { DefaultThemesEnum, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../model";
import { WidgetEnum } from "../util/widget-enum";
import GscapeEntityColorLegend, { ClassWithColor } from "./entity-color-legend";

export { GscapeEntityColorLegend };

export function initEntityColorLegend(grapholscape: Grapholscape) {
  const entityColorLegend = new GscapeEntityColorLegend()

  if (grapholscape.renderer.diagram) {
    setList(entityColorLegend, grapholscape)
    if (grapholscape.renderState === RendererStatesEnum.FLOATY || grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      entityColorLegend.onElementSelection = (elem) => grapholscape.centerOnElement(elem.id, undefined, 1.5)
    }
  }

  grapholscape.on(LifecycleEvent.ThemeChange, () => setList(entityColorLegend, grapholscape))
  grapholscape.on(LifecycleEvent.DiagramChange, () => setList(entityColorLegend, grapholscape))
  grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    if (rendererState === RendererStatesEnum.FLOATY) {
      setList(entityColorLegend, grapholscape)
      entityColorLegend.onElementSelection = (elem) => grapholscape.centerOnElement(elem.id, undefined, 1.5)
    } else {
      entityColorLegend.disable()
    }
  })

  grapholscape.widgets.set(WidgetEnum.ENTITY_COLOR_LEGEND, entityColorLegend)

  return entityColorLegend
}

export function setList(entityColorLegend: GscapeEntityColorLegend, grapholscape: Grapholscape) {
  if (
    grapholscape.renderState === RendererStatesEnum.INCREMENTAL ||
    (
      grapholscape.renderState &&
      (grapholscape.theme.id === DefaultThemesEnum.COLORFUL_LIGHT || grapholscape.theme.id === DefaultThemesEnum.COLORFUL_DARK)
    )
  ) {

    const diagramRepr = grapholscape.renderer.diagram?.representations.get(grapholscape.renderState)

    if (diagramRepr) {
      const elements: Map<string, ClassWithColor> = new Map()
      diagramRepr.cy.$(`[type = "${TypesEnum.CLASS}"]`).forEach(classNode => {
        elements.set(classNode.data('iri'), {
          id: classNode.id(),
          displayedName: classNode.data('displayedName'),
          iri: classNode.data('iri'),
          color: classNode.style('background-color'),
          filtered: false,
        })
      })

      if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL && grapholscape.incremental) {
        diagramRepr.cy.$(`[type = "${TypesEnum.CLASS_INSTANCE}"]`).forEach(instanceNode => {
          const instanceEntity = grapholscape.incremental?.classInstanceEntities.get(instanceNode.data().iri)

          if (instanceEntity) {
            instanceEntity.parentClassIris.forEach((parentClassIri, i) => {
              if (!elements.has(parentClassIri.fullIri)) {
                const parentClassEntity = grapholscape.ontology.getEntity(parentClassIri)
                if (parentClassEntity) {
                  elements.set(parentClassIri.fullIri, {
                    id: `${instanceNode.id()}-${i}`,
                    displayedName: parentClassEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language),
                    iri: parentClassEntity.fullIri,
                    color: parentClassEntity.color,
                    filtered: false,
                  })
                }
              }
            })
          }
        })
      }
      

      entityColorLegend.elements = Array.from(elements.values()).sort((a, b) => a.displayedName.localeCompare(b.displayedName))
      entityColorLegend.enable()

      if (entityColorLegend.elements.length <= 0)
        entityColorLegend.hide()
    }
  } else {
    entityColorLegend.disable()
  }
}