import { GrapholEntity, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from '../../../model';
import { EntityViewData, WidgetEnum } from '../../../ui';
import { GscapeEntityDetails } from '../../../ui/entity-details';
import { grapholEntityToEntityViewData } from '../../../util';
import IncrementalController from '../../controller';
import { IncrementalEvent } from '../../lifecycle';
import GscapeClassInstanceDetails from './class-instance-details';

export { default as GscapeClassInstanceDetails } from './class-instance-details'

export function ClassInstanceDetailsFactory(incrementalController: IncrementalController) {
  const classInstanceDetails = new GscapeClassInstanceDetails()
  const entityDetailsWidget = incrementalController.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails | undefined

  if (entityDetailsWidget)
    entityDetailsWidget.incrementalSection = classInstanceDetails

  incrementalController.grapholscape.widgets.set(WidgetEnum.CLASS_INSTANCE_DETAILS, classInstanceDetails)


  incrementalController.grapholscape.on(LifecycleEvent.EntitySelection, async grapholEntity => {
    let dataProperties: GrapholEntity[] | undefined


    if (grapholEntity.is(GrapholTypesEnum.CLASS) && incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      dataProperties = await incrementalController.getDataPropertiesByClasses([grapholEntity.iri.fullIri])
      classInstanceDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
      classInstanceDetails.parentClasses = undefined
      classInstanceDetails.canShowDataPropertiesValues = false
      classInstanceDetails.show()
    } else {
      classInstanceDetails.hide()
    }
  })

  incrementalController.on(IncrementalEvent.ClassInstanceSelection, async classInstanceEntity => {
    if (!entityDetailsWidget?.grapholEntity || !entityDetailsWidget?.grapholEntity.iri.equals(classInstanceEntity.iri)) {
      incrementalController.endpointController?.stopRequests('instances')

      const parentClassesIris = classInstanceEntity.parentClassIris.map(i => i.fullIri)
      const dataProperties = await incrementalController.getDataPropertiesByClasses(parentClassesIris)
      classInstanceDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))

      classInstanceDetails.parentClasses = parentClassesIris.map(parentClassIri => {
        const parentClassEntity = incrementalController.grapholscape.ontology.getEntity(parentClassIri)
        if (parentClassEntity)
          return grapholEntityToEntityViewData(parentClassEntity, incrementalController.grapholscape)
      }).filter(entity => entity !== undefined) as EntityViewData[]

      dataProperties.forEach(dp => {
        incrementalController.endpointController?.requestDataPropertyValues(classInstanceEntity.iri.fullIri, dp.iri.fullIri)
      })
    }

    classInstanceDetails.canShowDataPropertiesValues = true
    const classInstanceNode = classInstanceEntity.getOccurrenceByType(GrapholTypesEnum.CLASS_INSTANCE, RendererStatesEnum.INCREMENTAL)
    entityDetailsWidget?.setGrapholEntity(classInstanceEntity, classInstanceNode)
    classInstanceDetails.show()
  })

  incrementalController.on(IncrementalEvent.NewDataPropertyValues, (instanceIri, dataPropertyIri, newValues) => {
    if (entityDetailsWidget?.grapholEntity.iri.equals(instanceIri))
      newValues.forEach(v => classInstanceDetails.addDataPropertyValue(dataPropertyIri, v))
  })

  incrementalController.on(IncrementalEvent.DataPropertyValuesLoadingFinished, (instanceIri, dataPropertyIri) => {
    if (entityDetailsWidget?.grapholEntity.iri.equals(instanceIri))
      classInstanceDetails.setDataPropertyLoading(dataPropertyIri, false)
  })

  return classInstanceDetails
}