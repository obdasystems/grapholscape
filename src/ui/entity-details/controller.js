import { entityModelToViewData } from '../../util/model-obj-transformations'

/**
 * @param {import('./index').default} entityDetailsComponent
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function(entityDetailsComponent, grapholscape) {
  entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)

  grapholscape.onEntitySelection(entity => {
    let entityViewData = entityModelToViewData(entity, grapholscape.languages)
    entityDetailsComponent.entity = entityViewData
    entityDetailsComponent.show()
  })
}