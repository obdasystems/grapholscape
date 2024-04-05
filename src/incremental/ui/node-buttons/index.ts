import { GrapholEntity, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../../model";
import { ViewObjectProperty, WidgetEnum } from "../../../ui";
import NodeButton from "../../../ui/common/button/node-button";
import { grapholEntityToEntityViewData } from "../../../util";
import { IIncremental } from "../../i-incremental";
import { IncrementalEvent } from "../../lifecycle";
import { ObjectPropertyConnectedClasses } from "../../neighbourhood-finder";
import GscapeNavigationMenu from "../navigation-menu/navigation-menu";
import showMenu from "../show-menu";
import { getButtonOffset, hideButtons, showButtons } from "./show-hide-buttons";

export { getButtonOffset, hideButtons, showButtons };

export function NodeButtonsFactory(ic: IIncremental) {

  if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    setHandlersOnIncrementalCytoscape(ic)
  }

  ic.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      setHandlersOnIncrementalCytoscape(ic)
    }
  })

  ic.on(IncrementalEvent.Reset, () => {
    if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      setHandlersOnIncrementalCytoscape(ic)
      ic
        .grapholscape
        .container
        .querySelectorAll('[data-tippy-root]') // take all the tippy widgets (loading badges basically)
        .forEach(tippy => tippy.remove())
    }
  })

}

function setHandlersOnIncrementalCytoscape(ic: IIncremental) {
  const cy = ic.grapholscape.incremental.diagram.representation?.cy
  if (!cy)
    return

  if (cy.scratch('_gscape-graph-incremental-handlers-set'))
    return

  // const btns = Array.from(nodeButtons.values()).flat()
  let lastSelectedNode
  cy.on('tap', 'node', e => {
    const grapholElem = ic.grapholscape.renderer.grapholElements?.get(e.target.id())
    if (grapholElem) {
      if (lastSelectedNode) {
        hideButtons(lastSelectedNode)
      }
      showButtons(e.target, ic.getNodeButtons(grapholElem, e.target))
      lastSelectedNode = e.target
    }
  })

  cy.on('tap', e => {
    if (e.target === cy && lastSelectedNode) {
      hideButtons(lastSelectedNode)
      lastSelectedNode = undefined
    }
  })

  cy.on('pan', e => {
    if (lastSelectedNode) {
      hideButtons(lastSelectedNode)
      lastSelectedNode = undefined
    }
  })

  cy.scratch('_gscape-graph-incremental-handlers-set', true)
}

async function handleObjectPropertyButtonClick(e: MouseEvent, incrementalController: IIncremental) {
  const targetButton = e.currentTarget as NodeButton
  const navigationMenu = incrementalController.grapholscape.widgets.get(WidgetEnum.NAVIGATION_MENU) as GscapeNavigationMenu

  if (!navigationMenu) return

  if (targetButton.node && targetButton.node.data().iri) {

    let referenceEnity: GrapholEntity | null | undefined
    let objectProperties: Map<GrapholEntity, ObjectPropertyConnectedClasses> = new Map()

    if (targetButton.node.data().type === TypesEnum.CLASS) {
      referenceEnity = incrementalController.grapholscape.ontology.getEntity(targetButton.node.data().iri)
      if (!referenceEnity)
        return

      navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
      navigationMenu.referenceEntityType = targetButton.node.data().type
      navigationMenu.canShowObjectPropertiesRanges = true


      objectProperties = await incrementalController.getObjectPropertiesHighlights([targetButton.node.data().iri], targetButton.node.data('type') === TypesEnum.INDIVIDUAL)
    }

    navigationMenu.objectProperties = Array.from(objectProperties).map(v => {
      const newV = grapholEntityToEntityViewData(v[0], incrementalController.grapholscape) as ViewObjectProperty
      // const viewIncrementalObjProp = newV as ViewObjectProperty
      newV.connectedClasses = v[1].list.map(classEntity => {
        return grapholEntityToEntityViewData(classEntity, incrementalController.grapholscape)
      })
      newV.direct = v[1].direct

      return newV
    })

    // TODO: check why sometimes here targetButton.node is undefined, happens only few times
    // it should be defined due to previous initial if
    if (targetButton.node) {
      showMenu(navigationMenu, incrementalController)
    }
  }
}