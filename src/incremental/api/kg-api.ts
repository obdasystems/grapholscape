import { MastroEndpoint, QueryStatusEnum, RequestOptions } from '../queries/model'
import QueryManager from '../queries/query-manager'
import * as QueriesTemplates from '../queries/query-templates'
import { Branch, Highlights, OntologyGraphApi } from './swagger'

export type ClassInstance = {
  iri: string,
  label?: string,
}

// export type ObjectPropertyInstance = {
//   iri: string,
//   domain: ClassInstance,
//   range: ClassInstance,
// }

export interface IVirtualKnowledgeGraphApi {
  getInstances: (iri: string, onNewResults: (classInstances: ClassInstance[]) => void, onStop?: () => void, searchText?: string) => void,
  getInstancesNumber: (iri: string, onResult: (resultCount: number) => void) => void,
  getHighlights: (iri: string) => Promise<Highlights>,
  getInstanceDataPropertyValues: (instanceIri: string, dataPropertyIri: string, onNewResults: (values: string[]) => void, onStop?: () => void) => void,
}

export default class VKGApi implements IVirtualKnowledgeGraphApi {
  private static readonly LIMIT = 10 // How many results to show?
  private queryManager: QueryManager
  private lastIriForSuggestions: string // the last class iri for which suggestions has been asked
  private lastSuggestions: Highlights // last suggestions retrieved

  constructor(private requestOptions: RequestOptions, endpoint: MastroEndpoint) {
    this.queryManager = new QueryManager(requestOptions, endpoint)
  }

  async getInstances(iri: string, onNewResults: (classInstances: ClassInstance[]) => void, onStop?: () => void, searchText?: string) {
    const queryCode = QueriesTemplates.getInstances(iri, VKGApi.LIMIT, searchText)
    const queryPoller = await this.queryManager.performQuery(queryCode, VKGApi.LIMIT)
    queryPoller.start()
    queryPoller.onNewResults = (result => {
      onNewResults(result.results.map(res => {
        return { iri: res[0].value, label: res[1]?.value }
      }))
    })

    if (onStop) {
      queryPoller.onStop = onStop
    }
  }

  async getInstancesNumber(iri: string, onResult: (resultCount: number) => void, onStop?: () => void, searchText?: string) {
    const queryCode = QueriesTemplates.getInstances(iri, undefined, searchText)
    onResult(await this.queryManager.performQueryCount(queryCode))
  }

  async getHighlights(classIri: string) {
    const params = new URLSearchParams({ clickedClassIRI: classIri, version: this.requestOptions.version })
    const url = new URL(`${this.requestOptions.basePath}/owlOntology/${this.requestOptions.name}/highlights?${params.toString()}`)
    
    return await (await fetch(url, {
      method: 'get',
      headers: this.requestOptions.headers
    })).json()
  }

  async getInstanceDataPropertyValues(instanceIri: string, dataPropertyIri: string,
    onNewResults: (values: string[]) => void,
    onStop?: (() => void),
    onError?: (() => void)) {

    const queryCode = QueriesTemplates.getInstanceDataPropertyValue(instanceIri, dataPropertyIri)

    const pollPage = async (pageNumber: number) => {
      const queryPoller = await this.queryManager.performQuery(queryCode, VKGApi.LIMIT, pageNumber)
      queryPoller.start()
      queryPoller.onNewResults = (results) => {
        onNewResults(results.results.map(res => res[0].value))
      }

      // If stopped then we received all results for this page
      // if query has not finished, continue polling for next page
      // if has finished then return and call onStop
      queryPoller.onStop = async () => {
        const queryStatus = await this.queryManager.getQueryStatus(queryPoller.executionId)

        if (queryStatus.status === QueryStatusEnum.FINISHED) {
          if (onStop)
            onStop()
          
          return
        }

        if (!queryStatus.hasError) {
          pollPage(pageNumber + 1) // poll for another page
        } else {
          if (onError)
            onError()
        }
      }
    }

    pollPage(1)    
  }
  
}

// Stubbed API
// export let vKGApiStub: IVirtualKnowledgeGraphApi = {
//   getInstances: (iri: string) => {
//     return [
//       {
//         iri: `http://obdm.obdasystems.com/book/1`,
//         label: 'Harry Potter',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/2`,
//         label: 'It',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/3`
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/4`,
//         label: 'Divina Commedia',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/5`,
//         label: 'Promessi Sposi',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/6`,
//         label: 'Songs Of My Nightmares',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/7`,
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/8`,
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/9`,
//         label: 'Losing The Sun',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/10`,
//         label: 'Sailing Into The Void',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/11`,
//         label: 'Calling Myself',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/12`,
//         label: 'Bleeding At The Mountains',
//       },
//     ]
//   },
//   getInstancesNumber: function (iri: string, onResult) {
//     onResult(2)
//   },
//   // getObjectProperties: function (iri: string): Promise<Branch[]> {
//   //   throw new Error('Function not implemented.')
//   // }
// }