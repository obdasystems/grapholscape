import { html } from "lit"
import Grapholscape from '../../core'
import { GrapholElement, GrapholEntity } from "../../model"
import { RendererStatesEnum } from "../../model/renderers/i-render-state"

export type DiagramViewData = { id: number, name: string }
export type OccurrenceIdViewData = { originalId: string, realId: string }

export default function (grapholEntity: GrapholEntity, grapholscape: Grapholscape): Map<DiagramViewData, OccurrenceIdViewData[]> {
  const result = new Map<DiagramViewData, OccurrenceIdViewData[]>()

  grapholEntity.occurrences.get(RendererStatesEnum.GRAPHOL)?.forEach(occurrence => {
    addOccurrenceViewData(occurrence)
  })

  if (grapholscape.renderState && grapholscape.renderState !== RendererStatesEnum.GRAPHOL) {
    grapholEntity.occurrences.get(grapholscape.renderState)?.forEach((occurrence) => {
      addOccurrenceViewData(occurrence)
    })
  }
  return result


  function addOccurrenceViewData(occurrence: GrapholElement) {
    if (!grapholscape.renderState)
      return

    const diagram = grapholscape.ontology.getDiagram(occurrence.diagramId) || grapholscape.renderer.diagram
    // const cyElement = diagram?.representations.get(grapholscape.renderState)?.cy?.$id(occurrence.elementId)

    if (diagram) {

      /**
       * In case of repositioned or transformed elements, show the original id
       */
      const occurrenceIdViewData: OccurrenceIdViewData = {
        realId: occurrence.id,
        originalId: occurrence.originalId || occurrence.id,
      }

      const d = Array.from(result).find(([diagramViewData, _]) => diagramViewData.id === diagram.id)
      let diagramViewData: DiagramViewData
      if (!d) {
        diagramViewData = { id: diagram.id, name: diagram.name }
        result.set(diagramViewData, [])
      } else {
        diagramViewData = d[0]
      }

      result.get(diagramViewData)?.push(occurrenceIdViewData)


      // for (let [diagramViewData, occurrencesIdViewData] of result.entries()) {
      //   if (diagramViewData.id === diagram.id) {
      //     occurrencesIdViewData.push(occurrenceIdViewData)
      //     break
      //   }
      // }
    }
  }
}


export function getEntityOccurrencesTemplate(occurrences: Map<DiagramViewData, OccurrenceIdViewData[]>, onNodeNavigation: (elementId: string, diagramId: number) => void) {

  function nodeNavigationHandler(e) {
    const target = e.target as HTMLElement
    const diagramId = target.parentElement?.getAttribute('diagram-id')
    const elementId = target.getAttribute('real-id')

    if (!diagramId || !elementId) return

    onNodeNavigation(elementId, parseInt(diagramId))
  }

  return html`
  ${Array.from(occurrences).map(([diagram, occurrencesIds]) => {
    return html`
      <div diagram-id="${diagram.id}" style="display: flex; align-items: center; gap: 2px; flex-wrap: wrap;">
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