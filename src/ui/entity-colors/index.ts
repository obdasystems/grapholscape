import { Grapholscape } from "../../core";
import { LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../model";
import { colorPalette } from "../assets";
import { GscapeButton } from "../common/button";
import getIconSlot from "../util/get-icon-slot";
import { WidgetEnum } from "../util/widget-enum";
import GscapeEntityColorLegend, { ClassWithColor } from "./entity-color-legend";

export { GscapeEntityColorLegend };

function initEntityColorLegend(grapholscape: Grapholscape) {
  const entityColorLegend = new GscapeEntityColorLegend()

  entityColorLegend['_previous_callback'] = (elem) => grapholscape.centerOnElement(elem.id, undefined, 1.5)
  entityColorLegend.onElementSelection = (elem) => grapholscape.centerOnElement(elem.id, undefined, 1.5)
 
  grapholscape.widgets.set(WidgetEnum.ENTITY_COLOR_LEGEND, entityColorLegend)

  return entityColorLegend
}

function initEntityColorButton(grapholscape: Grapholscape) {
  const colorButtonComponent = new GscapeButton()
  colorButtonComponent.asSwitch = true
  colorButtonComponent.appendChild(getIconSlot('icon', colorPalette))
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
    if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      colorButtonComponent.active = true
    } else if (grapholscape.renderState !== RendererStatesEnum.FLOATY) {
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