import { GrapholEntity, LifecycleEvent, RendererStatesEnum, TypesEnum } from '../../../model';
import { EntityViewData, WidgetEnum } from '../../../ui';
import { GscapeEntityDetails } from '../../../ui/entity-details';
import { grapholEntityToEntityViewData } from '../../../util';
import IncrementalController, { Count } from "../../controller";
import { IncrementalEvent } from '../../lifecycle';
import IncrementalEntityDetails from './incremental-entity-details';

export { default as GscapeClassInstanceDetails } from './incremental-entity-details';

export function ClassInstanceDetailsFactory(ic: IncrementalController) {
  const incrementalEntityDetails = new IncrementalEntityDetails()
  const entityDetailsWidget = ic.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails | undefined

  if (entityDetailsWidget)
    entityDetailsWidget.incrementalSection = incrementalEntityDetails

  ic.grapholscape.widgets.set(WidgetEnum.CLASS_INSTANCE_DETAILS, incrementalEntityDetails)

  incrementalEntityDetails.onComputeCount = (entity) => {
    incrementalEntityDetails.instancesCountLoading = true
    const entityType = entity.is(TypesEnum.OBJECT_PROPERTY)
      ? TypesEnum.OBJECT_PROPERTY
      : TypesEnum.CLASS
    ic.endpointController?.requestCountForEntity(entity.iri.fullIri, entityType)
      ?.then(count => {
        /**
         * Update value in widget only if user has NOT changed entity
         * while the query was still running.
         */
        if (incrementalEntityDetails.entity?.iri.equals(entity.iri)) {
          const countInMap: Count = {
            value: count,
            materialized: false,
          }
          ic.counts.set(entity.iri.fullIri, countInMap)
          incrementalEntityDetails.instancesCount = countInMap
        }
        
      }).finally(() => {
        incrementalEntityDetails.instancesCountLoading = false
      })
  }

  ic.grapholscape.on(LifecycleEvent.EntitySelection, async grapholEntity => {
    incrementalEntityDetails.instancesCount = undefined
    incrementalEntityDetails.dataProperties = []

    if (!grapholEntity.is(TypesEnum.CLASS) && !grapholEntity.is(TypesEnum.OBJECT_PROPERTY)) {
      incrementalEntityDetails.hide()
      incrementalEntityDetails.allowComputeCount = false
      incrementalEntityDetails.entity = undefined
      return
    }

    incrementalEntityDetails.entity = grapholEntity
    incrementalEntityDetails.allowComputeCount = grapholEntity.is(TypesEnum.OBJECT_PROPERTY)

    if (grapholEntity.is(TypesEnum.OBJECT_PROPERTY)) {
      ic.updateMaterializedCounts().then(() => {
        if (ic.counts.get(grapholEntity.iri.fullIri) !== undefined) {
          incrementalEntityDetails.instancesCount = ic.counts.get(grapholEntity.iri.fullIri)
        }
      })
    }

    if (grapholEntity.is(TypesEnum.CLASS) && ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      let dataProperties: GrapholEntity[] | undefined
      dataProperties = await ic.getDataPropertiesByClasses([grapholEntity.iri.fullIri])
      incrementalEntityDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, ic.grapholscape))
      incrementalEntityDetails.parentClasses = undefined
      incrementalEntityDetails.canShowDataPropertiesValues = false
    }

    incrementalEntityDetails.show()
  })

  ic.on(IncrementalEvent.ClassInstanceSelection, async classInstanceEntity => {
    if (!entityDetailsWidget?.grapholEntity || !entityDetailsWidget?.grapholEntity.iri.equals(classInstanceEntity.iri)) {
      ic.endpointController?.stopRequests('instances')
      incrementalEntityDetails.allowComputeCount = false
      const parentClassesIris = classInstanceEntity.parentClassIris.map(i => i.fullIri)
      let dataProperties: GrapholEntity[] = []
      if (classInstanceEntity.dataProperties.length > 0) {
        let dpEntity: GrapholEntity | undefined

        incrementalEntityDetails.dataProperties = []
        classInstanceEntity.dataProperties.forEach(dp => {
          dpEntity = ic.grapholscape.ontology.getEntity(dp.iri)

          if (dpEntity) {
            dataProperties.push(dpEntity)
            incrementalEntityDetails.addDataPropertyValue(dp.iri, dp.value)
          }
        })
      } else {
        dataProperties = await ic.getDataPropertiesByClasses(parentClassesIris)
        incrementalEntityDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, ic.grapholscape))
        dataProperties.forEach(dp => {
          ic.endpointController?.requestDataPropertyValues(classInstanceEntity.iri.fullIri, dp.iri.fullIri)
        })
      }

      incrementalEntityDetails.parentClasses = parentClassesIris.map(parentClassIri => {
        const parentClassEntity = ic.grapholscape.ontology.getEntity(parentClassIri)
        if (parentClassEntity)
          return grapholEntityToEntityViewData(parentClassEntity, ic.grapholscape)
      }).filter(entity => entity !== undefined) as EntityViewData[]
    }

    incrementalEntityDetails.canShowDataPropertiesValues = true
    const classInstanceNode = classInstanceEntity.getOccurrenceByType(TypesEnum.CLASS_INSTANCE, RendererStatesEnum.INCREMENTAL)
    entityDetailsWidget?.setGrapholEntity(classInstanceEntity, classInstanceNode)
    incrementalEntityDetails.show()
  })

  ic.on(IncrementalEvent.NewDataPropertyValues, (instanceIri, dataPropertyIri, newValues) => {
    if (entityDetailsWidget?.grapholEntity.iri.equals(instanceIri))
      newValues.forEach(v => incrementalEntityDetails.addDataPropertyValue(dataPropertyIri, v))
  })

  ic.on(IncrementalEvent.DataPropertyValuesLoadingFinished, (instanceIri, dataPropertyIri) => {
    if (entityDetailsWidget?.grapholEntity.iri.equals(instanceIri))
      incrementalEntityDetails.setDataPropertyLoading(dataPropertyIri, false)
  })

  return incrementalEntityDetails
}