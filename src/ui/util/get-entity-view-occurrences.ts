import { html } from "lit"
import Grapholscape from "../../core/grapholscape"
import { GrapholEntity } from "../../model"
import { EntityOccurrence } from "../../model/graphol-elems/entity"
import { RendererStatesEnum } from "../../model/renderers/i-render-state"

export type DiagramViewData = { id: number, name: string }
export type OccurrenceIdViewData = { originalId: string, realId: string }

export default function(grapholEntity: GrapholEntity, grapholscape: Grapholscape): Map<DiagramViewData, OccurrenceIdViewData[]> {
  const result = new Map<DiagramViewData, OccurrenceIdViewData[]>()

  grapholEntity.occurrences.get(RendererStatesEnum.GRAPHOL)?.forEach(occurrence => {
    addOccurrenceViewData(occurrence)
  })

  if (grapholscape.renderState !== RendererStatesEnum.GRAPHOL) {
    grapholEntity.occurrences.get(grapholscape.renderState)?.forEach((occurrence) => {
      addOccurrenceViewData(occurrence)
    })
  }
  return result


  function addOccurrenceViewData(occurrence: EntityOccurrence) {
    const diagram = grapholscape.ontology.getDiagram(occurrence.diagramId)
    const cyElement = diagram?.representations.get(grapholscape.renderState)?.cy?.$id(occurrence.elementId)

    if (diagram && cyElement && !cyElement.empty()) {
      if (!Array.from(result.keys()).find(d => d.id === diagram.id)) {
        result.set({ id: diagram.id, name: diagram.name }, [])
      }

      /**
       * In case of repositioned or transformed elements, show the original id
       */
      const occurrenceIdViewData: OccurrenceIdViewData = {
        realId: occurrence.elementId,
        originalId: cyElement.data().originalId,
      }

      for (let [diagramViewData, occurrencesIdViewData] of result.entries()) {
        if (diagramViewData.id === diagram.id) {
          occurrencesIdViewData.push(occurrenceIdViewData)
          break
        }
      }
    }
  }
}


export function getEntityOccurrencesTemplate(occurrences: Map<DiagramViewData, OccurrenceIdViewData[]>, onNodeNavigation: (occurrence: EntityOccurrence) => void) {
  
  function nodeNavigationHandler(e) {
    const target = e.target as HTMLElement
    const diagramId = target.parentElement?.getAttribute('diagram-id')
    const elementId = target.getAttribute('real-id')
  
    if (!diagramId || ! elementId) return
  
    onNodeNavigation({
      diagramId: parseInt(diagramId),
      elementId: elementId
    })
  }

  return html`
  ${Array.from(occurrences).map(([diagram, occurrencesIds]) => {
    return html`
      <div diagram-id="${diagram.id}">
        <span class="diagram-name">${diagram.name}</span>
        ${occurrencesIds.map(occurrenceId => html`
          <gscape-button
            label="${occurrenceId.originalId || occurrenceId.realId}"
            real-id="${occurrenceId.realId}"
            type="subtle"
            size="s"
            @click=${nodeNavigationHandler}
          ></gscape-button>
        `)}
      </div>
    `
  })}
  `
}