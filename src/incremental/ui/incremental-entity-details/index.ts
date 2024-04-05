import { GrapholEntity, LifecycleEvent, RendererStatesEnum, TypesEnum } from '../../../model';
import { WidgetEnum } from '../../../ui';
import { GscapeEntityDetails } from '../../../ui/entity-details';
import { grapholEntityToEntityViewData } from '../../../util';
import IncrementalBase, { IIncremental } from '../../i-incremental';
import IncrementalEntityDetails from './incremental-entity-details';

export function IncrementalEntityDetailsFactory(ic: IncrementalBase) {
  const incrementalEntityDetails = new IncrementalEntityDetails()
  const entityDetailsWidget = ic.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails | undefined

  if (entityDetailsWidget) {
    entityDetailsWidget.incrementalSection = incrementalEntityDetails
  }

  ic.grapholscape.widgets.set(WidgetEnum.INCREMENTAL_ENTITY_DETAILS, incrementalEntityDetails)

  ic.grapholscape.on(LifecycleEvent.EntitySelection, async grapholEntity => {
    incrementalEntityDetails.dataProperties = []

    if (!grapholEntity.is(TypesEnum.CLASS) && !grapholEntity.is(TypesEnum.OBJECT_PROPERTY)) {
      incrementalEntityDetails.hide()
      incrementalEntityDetails.entity = undefined
      return
    }

    incrementalEntityDetails.entity = grapholEntity

    if (grapholEntity.is(TypesEnum.CLASS) && ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      let dataProperties: GrapholEntity[] | undefined
      dataProperties = await ic.getDataPropertiesHighlights([grapholEntity.iri.fullIri], false)
      incrementalEntityDetails.dataProperties = dataProperties.map(dp => grapholEntityToEntityViewData(dp, ic.grapholscape))
    }

    incrementalEntityDetails.show()
  })

  return incrementalEntityDetails
}