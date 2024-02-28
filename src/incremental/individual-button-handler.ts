import { TypesEnum } from "../model"
import { NodeButton, WidgetEnum, ViewObjectProperty } from "../ui"
import { grapholEntityToEntityViewData } from "../util"
import { IIncremental } from "./i-incremental"
import { GscapeInstanceExplorer } from "./ui"
import showMenu from "./ui/show-menu"

export default async function individualButtonHandler(e: MouseEvent, ic: IIncremental) {
  const targetButton = e.currentTarget as NodeButton
  const instanceExplorer = ic.grapholscape.widgets.get(WidgetEnum.INSTANCES_EXPLORER) as GscapeInstanceExplorer

  if (!instanceExplorer)
    return

  if (targetButton.node && targetButton.node.data().iri) {
    const referenceEntity = ic.grapholscape.ontology.getEntity(targetButton.node.data().iri)
    const entityType = targetButton.node.data().type
    if (referenceEntity && entityType === TypesEnum.CLASS) {
      if (!instanceExplorer.referenceEntity ||
        !instanceExplorer.referenceEntity.value.iri.equals(referenceEntity.iri) ||
        instanceExplorer.numberOfInstancesReceived === 0) {
        instanceExplorer.clear()

        instanceExplorer.areInstancesLoading = true
        instanceExplorer.referenceEntity = grapholEntityToEntityViewData(referenceEntity, ic.grapholscape)
        instanceExplorer.referenceEntityType = targetButton.node.data().type

        // const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
        //   incrementalController.endpointController?.highlightsManager
        // )

        const dataProperties = await ic.getDataPropertiesHighlights([referenceEntity.iri.fullIri], false)
        const objectPropertiesMap = await ic.getObjectPropertiesHighlights([referenceEntity.iri.fullIri], false)
        const objectProperties = Array.from(objectPropertiesMap).map(v => {
          const newV = grapholEntityToEntityViewData(v[0], ic.grapholscape) as ViewObjectProperty
          // const viewIncrementalObjProp = newV as ViewObjectProperty
          newV.connectedClasses = v[1].list.map(classEntity => {
            return grapholEntityToEntityViewData(classEntity, ic.grapholscape)
          })
          newV.direct = v[1].direct
    
          return newV
        })

        instanceExplorer.propertiesFilterList = dataProperties
          .map(dp => grapholEntityToEntityViewData(dp, ic.grapholscape))
          .concat(objectProperties)
          .sort((a, b) => a.displayedName.localeCompare(b.displayedName))

        // instanceExplorer.requestId = await incrementalController.endpointController?.requestInstancesForClass(referenceEntity.iri.fullIri)

        // if (instanceExplorer.requestId) {
        //   incrementalController
        //     .endpointController
        //     ?.shouldQueryUseLabels(instanceExplorer.requestId)
        //     ?.then(async shouldAskForLabels => {
        //       if (!shouldAskForLabels) {
        //         instanceExplorer.shouldAskForLabels = shouldAskForLabels
        //         instanceExplorer.areInstancesLoading = true
        //         instanceExplorer.requestId = await incrementalController.endpointController
        //           ?.requestInstancesForClass(
        //             referenceEntity.iri.fullIri,
        //             shouldAskForLabels
        //           )
        //       }

        //     })
        // }
      }
    }

    // TODO: check why sometimes here targetButton.node is undefined, happens only few times
    // it should be defined due to previous initial if
    if (targetButton.node) {
      showMenu(instanceExplorer, ic)
    }
  }
}