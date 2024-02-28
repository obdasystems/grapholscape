import { GrapholEntity, ClassInstanceEntity, TypesEnum } from "../model"
import { NodeButton, WidgetEnum, ViewObjectProperty } from "../ui"
import { grapholEntityToEntityViewData } from "../util"
import { IIncremental } from "./i-incremental"
import { ObjectPropertyConnectedClasses } from "./neighbourhood-finder"
import GscapeNavigationMenu from "./ui/navigation-menu/navigation-menu"
import showMenu from "./ui/show-menu"

export default async function objectPropertyButtonHandler(e: MouseEvent, incrementalController: IIncremental) {
  const targetButton = e.currentTarget as NodeButton
  const navigationMenu = incrementalController.grapholscape.widgets.get(WidgetEnum.NAVIGATION_MENU) as GscapeNavigationMenu

  if (!navigationMenu) return

  if (targetButton.node && targetButton.node.data().iri) {

    let referenceEnity: GrapholEntity | ClassInstanceEntity | null | undefined
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

    // else if (targetButton.node.data().type === TypesEnum.CLASS_INSTANCE) {
    //   referenceEnity = incrementalController.classInstanceEntities.get(targetButton.node.data().iri)
    //   if (!referenceEnity)
    //     return

    //   navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
    //   navigationMenu.referenceEntityType = targetButton.node.data().type
    //   navigationMenu.canShowObjectPropertiesRanges = false

    //   const parentClassesIris = (referenceEnity as ClassInstanceEntity).parentClassIris!.map(i => i.fullIri)
    //   objectProperties = await incrementalController.getObjectPropertiesByClasses(parentClassesIris)
    // }

    // const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
    //   incrementalController.endpointController?.highlightsManager
    // )

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