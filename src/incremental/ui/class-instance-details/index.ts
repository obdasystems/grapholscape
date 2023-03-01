import { GrapholEntity, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from '../../../model';
import { WidgetEnum } from '../../../ui';
import { GscapeEntityDetails } from '../../../ui/entity-details';
import grapholEntityToEntityViewData from '../../../util/graphol-entity-to-entity-view-data';
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
      dataProperties = await incrementalController.getDataPropertiesByClass(grapholEntity.iri.fullIri)
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
      incrementalController.endpointController?.stopRequests()

      if (classInstanceEntity.parentClassIri) {
        const parentClassEntity = incrementalController.grapholscape.ontology.getEntity(classInstanceEntity.parentClassIri.fullIri)
        if (parentClassEntity) {
          const dataProperties = await incrementalController.getDataPropertiesByClass(parentClassEntity.iri.fullIri)
          classInstanceDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
          classInstanceDetails.parentClasses = [grapholEntityToEntityViewData(parentClassEntity, incrementalController.grapholscape)]

          dataProperties.forEach(dp => {
            incrementalController.endpointController?.requestDataPropertyValues(classInstanceEntity.iri.fullIri, dp.iri.fullIri)
          })
        }
      }
    }

    classInstanceDetails.canShowDataPropertiesValues = true
    entityDetailsWidget?.setGrapholEntity(classInstanceEntity)
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