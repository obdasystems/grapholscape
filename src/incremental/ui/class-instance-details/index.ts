import { GrapholEntity, LifecycleEvent, RendererStatesEnum, TypesEnum } from '../../../model';
import { EntityViewData, WidgetEnum } from '../../../ui';
import { GscapeEntityDetails } from '../../../ui/entity-details';
import { grapholEntityToEntityViewData } from '../../../util';
import IncrementalController from '../../controller';
import { IncrementalEvent } from '../../lifecycle';
import GscapeClassInstanceDetails from './class-instance-details';

export { default as GscapeClassInstanceDetails } from './class-instance-details';

export function ClassInstanceDetailsFactory(ic: IncrementalController) {
  const classInstanceDetails = new GscapeClassInstanceDetails()
  const entityDetailsWidget = ic.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails | undefined

  if (entityDetailsWidget)
    entityDetailsWidget.incrementalSection = classInstanceDetails

  ic.grapholscape.widgets.set(WidgetEnum.CLASS_INSTANCE_DETAILS, classInstanceDetails)


  ic.grapholscape.on(LifecycleEvent.EntitySelection, async grapholEntity => {
    let dataProperties: GrapholEntity[] | undefined


    if (grapholEntity.is(TypesEnum.CLASS) && ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      dataProperties = await ic.getDataPropertiesByClasses([grapholEntity.iri.fullIri])
      classInstanceDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, ic.grapholscape))
      classInstanceDetails.parentClasses = undefined
      classInstanceDetails.canShowDataPropertiesValues = false
      classInstanceDetails.show()
    } else {
      classInstanceDetails.hide()
    }
  })

  ic.on(IncrementalEvent.ClassInstanceSelection, async classInstanceEntity => {
    if (!entityDetailsWidget?.grapholEntity || !entityDetailsWidget?.grapholEntity.iri.equals(classInstanceEntity.iri)) {
      ic.endpointController?.stopRequests('instances')

      const parentClassesIris = classInstanceEntity.parentClassIris.map(i => i.fullIri)
      let dataProperties: GrapholEntity[] = []
      if (classInstanceEntity.dataProperties.length > 0) {
        let dpEntity: GrapholEntity | undefined

        classInstanceDetails.dataProperties = []
        classInstanceEntity.dataProperties.forEach(dp => {
          dpEntity = ic.grapholscape.ontology.getEntity(dp.iri)

          if (dpEntity) {
            dataProperties.push(dpEntity)
            classInstanceDetails.addDataPropertyValue(dp.iri, dp.value)
          }
        })
      } else {
        dataProperties = await ic.getDataPropertiesByClasses(parentClassesIris)
        classInstanceDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, ic.grapholscape))
        dataProperties.forEach(dp => {
          ic.endpointController?.requestDataPropertyValues(classInstanceEntity.iri.fullIri, dp.iri.fullIri)
        })
      }

      classInstanceDetails.parentClasses = parentClassesIris.map(parentClassIri => {
        const parentClassEntity = ic.grapholscape.ontology.getEntity(parentClassIri)
        if (parentClassEntity)
          return grapholEntityToEntityViewData(parentClassEntity, ic.grapholscape)
      }).filter(entity => entity !== undefined) as EntityViewData[]
    }

    classInstanceDetails.canShowDataPropertiesValues = true
    const classInstanceNode = classInstanceEntity.getOccurrenceByType(TypesEnum.CLASS_INSTANCE, RendererStatesEnum.INCREMENTAL)
    entityDetailsWidget?.setGrapholEntity(classInstanceEntity, classInstanceNode)
    classInstanceDetails.show()
  })

  ic.on(IncrementalEvent.NewDataPropertyValues, (instanceIri, dataPropertyIri, newValues) => {
    if (entityDetailsWidget?.grapholEntity.iri.equals(instanceIri))
      newValues.forEach(v => classInstanceDetails.addDataPropertyValue(dataPropertyIri, v))
  })

  ic.on(IncrementalEvent.DataPropertyValuesLoadingFinished, (instanceIri, dataPropertyIri) => {
    if (entityDetailsWidget?.grapholEntity.iri.equals(instanceIri))
      classInstanceDetails.setDataPropertyLoading(dataPropertyIri, false)
  })

  return classInstanceDetails
}