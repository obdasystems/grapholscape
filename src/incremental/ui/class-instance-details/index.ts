import { GrapholEntity, GrapholTypesEnum, LifecycleEvent } from '../../../model';
import { WidgetEnum } from '../../../ui';
import { GscapeEntityDetails } from '../../../ui/entity-details';
import grapholEntityToEntityViewData from '../../../util/graphol-entity-to-entity-view-data';
import IncrementalController from '../../controller';
import { IncrementalEvent } from '../../lifecycle';
import GscapeClassInstanceDetails from './class-instance-details';

export { default as GscapeClassInstanceDetails} from './class-instance-details'

export function ClassInstanceDetailsFactory(incrementalController: IncrementalController) {
  const classInstanceDetails = new GscapeClassInstanceDetails()
  const entityDetailsWidget = incrementalController.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails | undefined

  if (entityDetailsWidget)
    entityDetailsWidget.incrementalSection = classInstanceDetails

  incrementalController.grapholscape.widgets.set(WidgetEnum.CLASS_INSTANCE_DETAILS, classInstanceDetails)


  incrementalController.grapholscape.on(LifecycleEvent.EntitySelection, async grapholEntity => {
    let dataProperties: GrapholEntity[] | undefined

    if (grapholEntity.is(GrapholTypesEnum.CLASS)) {
      dataProperties = await incrementalController.getDataPropertiesByClass(grapholEntity.iri.fullIri)
      classInstanceDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
      classInstanceDetails.parentClasses = undefined
      classInstanceDetails.show()
    } else {
      classInstanceDetails.hide()
    }
  })

  incrementalController.on(IncrementalEvent.ClassInstanceSelection, async classInstanceEntity => {

    entityDetailsWidget?.setGrapholEntity(classInstanceEntity)

    // classInstanceDetails.dataProperties = (await incrementalController.getDataPropertiesByClassInstance(classInstanceEntity.iri.fullIri))
    //   .map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))

    if (classInstanceEntity.parentClassIri) {
      const parentClassEntity = incrementalController.grapholscape.ontology.getEntity(classInstanceEntity.parentClassIri.fullIri)
      if (parentClassEntity)
        classInstanceDetails.parentClasses = [grapholEntityToEntityViewData(parentClassEntity, incrementalController.grapholscape)]
    }
    

    classInstanceDetails.show()
  })
  classInstanceDetails.onParentClassSelection = (parentClassIri: string) => {
    // incrementalController.addInstanceParentClass()
  }

  return classInstanceDetails
}