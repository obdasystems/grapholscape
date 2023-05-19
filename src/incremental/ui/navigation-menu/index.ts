import { WidgetEnum } from "../../../ui";
import { getEntityViewDataUnfolding, grapholEntityToEntityViewData } from "../../../util";
import IncrementalController from "../../controller";
import { GscapeInstanceExplorer } from "../instances-explorer";
import onHideMenu from "../on-hide-menu";
import showMenu from "../show-menu";
import GscapeNavigationMenu, { ObjectPropertyNavigationEvent } from "./navigation-menu";

export function NavigationMenuFactory(incrementalController: IncrementalController) {
  const navigationMenu = new GscapeNavigationMenu()

  incrementalController.grapholscape.widgets.set(WidgetEnum.NAVIGATION_MENU, navigationMenu)

  navigationMenu.requestUpdate()


  navigationMenu.addEventListener('onclassselection', (e: ObjectPropertyNavigationEvent) => {

    if (!e.detail.rangeClassIri) return

    e.detail.direct
      ? incrementalController.addIntensionalObjectProperty(e.detail.objectPropertyIri, e.detail.referenceClassIri, e.detail.rangeClassIri)
      : incrementalController.addIntensionalObjectProperty(e.detail.objectPropertyIri, e.detail.rangeClassIri, e.detail.referenceClassIri)

    setTimeout(() => {
      incrementalController.grapholscape.centerOnElement(e.detail.rangeClassIri!)
    }, 250)

    navigationMenu.popperRef = undefined
    navigationMenu.hide()
  })

  navigationMenu.addEventListener('onobjectpropertyselection', async (e: ObjectPropertyNavigationEvent) => {
    const instancesExplorer = incrementalController.grapholscape.widgets.get(WidgetEnum.INSTANCES_EXPLORER) as GscapeInstanceExplorer

    if (instancesExplorer) {
      const referenceEntity = incrementalController.classInstanceEntities.get(e.detail.referenceClassIri) // must be an instance to be here
      const objectPropertyEntity = incrementalController.grapholscape.ontology.getEntity(e.detail.objectPropertyIri)

      if (
        referenceEntity &&
        objectPropertyEntity &&
        !(instancesExplorer.referenceEntity?.value.iri.equals(referenceEntity.iri) &&
          instancesExplorer.referencePropertyEntity?.value.iri.equals(objectPropertyEntity.iri))
      ) {
        navigationMenu.hide()
        instancesExplorer.clear()
        instancesExplorer.areInstancesLoading = true
        instancesExplorer.referenceEntity = navigationMenu.referenceEntity
        instancesExplorer.referencePropertyEntity = grapholEntityToEntityViewData(objectPropertyEntity, incrementalController.grapholscape)
        instancesExplorer.isPropertyDirect = e.detail.direct

        // const dataProperties = await incrementalController.getDataPropertiesByClassInstance(referenceEntity.iri.fullIri)
        // instancesExplorer.searchFilterList = dataProperties
        //   .map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
        //   .sort((a, b) => a.displayedName.localeCompare(b.displayedName))

        instancesExplorer.classTypeFilterList = navigationMenu.objectProperties
          .find(op => op.entityViewData.value.iri.equals(e.detail.objectPropertyIri))
          ?.connectedClasses

        // if only one related class for this object property, then retrieve data properties for this related class
        // as it will be selected by default
        if (instancesExplorer.classTypeFilterList?.length === 1) {
          const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
            incrementalController.endpointController.highlightsManager
          )
          instancesExplorer.propertiesFilterList = (await incrementalController
            .getDataPropertiesByClasses([instancesExplorer.classTypeFilterList[0].entityViewData.value.iri.fullIri]))
            .map(dp => getEntityViewDataUnfolding(dp, incrementalController.grapholscape, hasUnfoldings))
        }

        instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesThroughObjectProperty(
          referenceEntity.iri.fullIri,
          e.detail.objectPropertyIri,
          e.detail.direct,
          true,
          e.detail.rangeClassIri ? [e.detail.rangeClassIri] : undefined
        )

        if (instancesExplorer.requestId) {
          incrementalController
            .endpointController
            ?.shouldQueryUseLabels(instancesExplorer.requestId)
            ?.then(async shouldAskForLabels => {
              if (!shouldAskForLabels) {
                instancesExplorer.shouldAskForLabels = shouldAskForLabels
                instancesExplorer.areInstancesLoading = true
                instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesThroughObjectProperty(
                  referenceEntity.iri.fullIri,
                  e.detail.objectPropertyIri,
                  e.detail.direct,
                  shouldAskForLabels,
                  e.detail.rangeClassIri ? [e.detail.rangeClassIri] : undefined
                )
              }
              
            })
        }
      }

      if (navigationMenu.popperRef) {
        showMenu(instancesExplorer, incrementalController)
      }
    }
  })

  navigationMenu.tippyWidget.setProps({
    onHide: () => onHideMenu(navigationMenu, incrementalController),
  })

  return navigationMenu
}