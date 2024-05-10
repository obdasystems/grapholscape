import { Grapholscape } from "../../core";
import { LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../model";
import { colors } from "../assets";
import { GscapeButton } from "../common/button";
import getIconSlot from "../util/get-icon-slot";
import { WidgetEnum } from "../util/widget-enum";
import GscapeEntityColorLegend, { ClassWithColor } from "./entity-color-legend";
import GscapeIncrementalFilters from "./incremental-filters";

export { GscapeEntityColorLegend, ClassWithColor };

function initEntityColorLegend(grapholscape: Grapholscape) {
  const entityColorLegend = new GscapeEntityColorLegend()
  const incrementalFilters = new GscapeIncrementalFilters(entityColorLegend)
  entityColorLegend['_previous_callback'] = (elem) => grapholscape.selectEntity(elem.iri, grapholscape.diagramId, 1.5)
  entityColorLegend.onElementSelection = (elem) => grapholscape.selectEntity(elem.iri, grapholscape.diagramId, 1.5)
 
  grapholscape.widgets.set(WidgetEnum.ENTITY_COLOR_LEGEND, entityColorLegend)
  grapholscape.widgets.set(WidgetEnum.INCREMENTAL_FILTERS, incrementalFilters)

  return entityColorLegend
}

function initEntityColorButton(grapholscape: Grapholscape) {
  const colorButtonComponent = new GscapeButton()
  colorButtonComponent.asSwitch = true
  colorButtonComponent.appendChild(getIconSlot('icon', colors))
  colorButtonComponent.style.order = '8'
  colorButtonComponent.style.marginTop = '10px'
  colorButtonComponent.title = 'Show Colors'
  //fitButtonComponent.style.position = 'initial'
  grapholscape.widgets.set(WidgetEnum.COLOR_BUTTON, colorButtonComponent)

  return colorButtonComponent
}

export function setColorList(entityColorLegend: GscapeEntityColorLegend, grapholscape: Grapholscape) {
  if (!grapholscape.renderState)
    return

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
      diagramRepr.cy.$(`[type = "${TypesEnum.INDIVIDUAL}"]`).forEach(instanceNode => {
        instanceNode.connectedEdges(`[type = "${TypesEnum.INSTANCE_OF}"]`).targets().forEach((parentClassNode, i) => {
          if (!elements.has(parentClassNode.data().iri)) {
            const parentClassEntity = grapholscape.ontology.getEntity(parentClassNode.data().iri)
            if (parentClassEntity) {
              elements.set(parentClassNode.data().iri, {
                id: `${instanceNode.id()}-${i}`,
                displayedName: parentClassEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language),
                iri: parentClassEntity.fullIri,
                color: parentClassEntity.color,
                filtered: false,
              })
            }
          }
        })
      })
    }
      

    entityColorLegend.elements = Array.from(elements.values()).sort((a, b) => a.displayedName.localeCompare(b.displayedName))
    // entityColorLegend.elements.length > 0
    //   ? entityColorLegend.show()
    //   : entityColorLegend.hide()
  }
}

export default function initColors(grapholscape: Grapholscape) {
  const colorButtonComponent = initEntityColorButton(grapholscape)
  const entityColorLegend = initEntityColorLegend(grapholscape)
  colorButtonComponent.onclick = () => {
    grapholscape.theme.useComputedColours = colorButtonComponent.active;
    (grapholscape.renderer.cy as any)?.updateStyle()
    colorButtonComponent.active
      ? entityColorLegend.show()
      : entityColorLegend.hide()
    setColorList(entityColorLegend, grapholscape)
  }

  grapholscape.on(LifecycleEvent.RendererChange, (renderer) => {
    setupColors(grapholscape)
    if (renderer === RendererStatesEnum.FLOATY) {
      entityColorLegend.onElementSelection = entityColorLegend['_previous_callback']
    }
  })
  grapholscape.on(LifecycleEvent.DiagramChange, () => {
    if (colorButtonComponent.active && colorButtonComponent.isVisible) {
      setColorList(entityColorLegend, grapholscape)
    }
  })
  grapholscape.on(LifecycleEvent.ThemeChange, () => setupColors(grapholscape))

  const setupColors = (grapholscape: Grapholscape) => {
    if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL || grapholscape.renderState === RendererStatesEnum.FLOATY) {
      colorButtonComponent.active = true
    } else {
      colorButtonComponent.hide()
      entityColorLegend.hide()
      return
    }

    colorButtonComponent.show()
    grapholscape.theme.useComputedColours = colorButtonComponent.active;
    (grapholscape.renderer.cy as any)?.updateStyle()
    colorButtonComponent.active
      ? entityColorLegend.show()
      : entityColorLegend.hide()
    setColorList(entityColorLegend, grapholscape)
  }

  setupColors(grapholscape)
}