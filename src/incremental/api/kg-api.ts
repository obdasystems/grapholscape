import QueryManager from '../queries/query-manager'
import * as QueriesTemplates from '../queries/query-templates'
import { MastroEndpoint, QueryStatusEnum, RequestOptions } from './model'
import { Highlights } from './swagger/models/Highlights'

export type ClassInstance = {
  iri: string,
  shortIri?: string,
  label?: {
    language?: string,
    value: string,
  },
}

// export type ObjectPropertyInstance = {
//   iri: string,
//   domain: ClassInstance,
//   range: ClassInstance,
// }

export interface IVirtualKnowledgeGraphApi {
  getInstances: (iri: string, onNewResults: (classInstances: ClassInstance[]) => void, onStop?: () => void, searchText?: string) => void,
  getInstancesByPropertyValue: (classIri: string, dataPropertyIri: string, dataPropertyValue: string, onNewResults: (classInstances: ClassInstance[]) => void, onStop?: () => void) => void,
  getInstancesNumber: (iri: string, onResult: (resultCount: number) => void, onStop?: () => void) => void,
  getHighlights: (iri: string) => Promise<Highlights>,
  getInstanceDataPropertyValues: (instanceIri: string, dataPropertyIri: string, onNewResults: (values: string[]) => void, onStop?: () => void) => void,
  getInstanceObjectPropertyRanges: (instanceIri: string, objectPropertyIri: string, isDirect: boolean, onNewResults: (classInstances: ClassInstance[]) => void, rangeClassIri?: string, propertyFilterIri?: string, textSearch?: string, onStop?: () => void) => void
  setEndpoint: (endpoint: MastroEndpoint) => void,
  instanceCheck: (instanceIri: string, classesToCheck: string[], onResult: (classIris: string[]) => void, onStop: () => void) => Promise<void>,
  stopAllQueries: () => void,
  getInstanceLabels: (instanceIri: string, onResult: (result: { value: string, lang?: string }[]) => void) => Promise<void>

  pageSize: number
}

export default class VKGApi implements IVirtualKnowledgeGraphApi {
  private queryManager: QueryManager
  public language: string

  constructor(private requestOptions: RequestOptions, endpoint: MastroEndpoint, public pageSize: number) {
    this.setEndpoint(endpoint)
  }

  async getInstances(iri: string, onNewResults: (classInstances: ClassInstance[]) => void, onStop?: () => void, searchText?: string, pageSize?: number) {
    const _pageSize = pageSize || this.pageSize
    const queryCode = QueriesTemplates.getInstances(iri, searchText)
    const queryPoller = await this.queryManager.performQuery(queryCode, _pageSize)
    queryPoller.onNewResults = (result => {
      onNewResults(result.results.map(res => this.getClassInstanceFromQueryResult(res)))
    })

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()

    return queryPoller.executionId
  }

  async getNewResults(executionId: string,
    pageNumber: number,
    onNewResults: (classInstances: ClassInstance[]) => void,
    onStop?: () => void,
    pageSize?: number) {

    const _pageSize = pageSize || this.pageSize
    const queryPoller = await this.queryManager.getQueryResults(executionId, _pageSize, pageNumber)

    queryPoller.onNewResults = (result => {
      onNewResults(result.results.map(res => this.getClassInstanceFromQueryResult(res)))
      queryPoller.stop()
    })

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()
  }

  async getInstancesByPropertyValue(
    classIri: string,
    propertyIri: string,
    propertyValue: string,
    onNewResults: (classInstances: ClassInstance[]) => void,
    onStop?: (() => void),
    pageSize?: number) {

    const _pageSize = pageSize || this.pageSize
    const queryCode = QueriesTemplates.getInstancesByPropertyValue(classIri, propertyIri, propertyValue)
    const queryPoller = await this.queryManager.performQuery(queryCode, _pageSize)
    queryPoller.onNewResults = (result => {
      onNewResults(result.results.map(res => this.getClassInstanceFromQueryResult(res)))
    })

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()

    return queryPoller.executionId
  }


  async getInstancesNumber(iri: string, onResult: (resultCount: number) => void, onStop?: () => void, searchText?: string) {
    const queryCode = QueriesTemplates.getInstances(iri, searchText)
    this.queryManager.performQueryCount(queryCode, onStop)
      .then(result => onResult(result))
      .catch(_ => {
        if (onStop)
          onStop()
      })
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

    // const pollPage = async (pageNumber: number) => {
    //   const queryPoller = await this.queryManager.performQuery(queryCode, this.limit, pageNumber)

    //   if (queryPoller.status === QueryPollerStatus.STOPPED) {
    //     if (onStop)
    //       onStop()
    //     return
    //   }
    //   queryPoller.start()
    //   queryPoller.onNewResults = (results) => {
    //     onNewResults(results.results.map(res => res[0].value))
    //   }

    //   // If stopped then we need to decide wether to poll next page or not.
    //   // if query has not finished and queryPoller has not been stopped, continue polling for next page
    //   // if has finished or queryPoller has been stopped, then return and call onStop
    //   queryPoller.onStop = async () => {
    //     const queryStatus = await this.queryManager.getQueryStatus(queryPoller.executionId)

    //     if (queryStatus.status === QueryStatusEnum.FINISHED || queryPoller.status === QueryPollerStatus.STOPPED) {
    //       if (onStop)
    //         onStop()

    //       return
    //     }

    //     if (!queryStatus.hasError) {
    //       pollPage(pageNumber + 1) // poll for another page
    //     } else {
    //       if (onError)
    //         onError()
    //     }
    //   }
    // }

    // pollPage(1)

    const queryPoller = await this.queryManager.performQuery(queryCode, this.pageSize)
    queryPoller.onNewResults = (results) => {
      onNewResults(results.results.map(res => res[0].value))
    }

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()
  }

  async getInstanceObjectPropertyRanges(instanceIri: string, objectPropertyIri: string,
    isDirect: boolean,
    onNewResults: (classInstances: ClassInstance[]) => void,
    rangeClassIri?: string,
    propertyIriFilter?: string,
    textSearch?: string,
    onStop?: (() => void)
  ) {

    const queryCode = QueriesTemplates.getInstancesObjectPropertyRanges(instanceIri, objectPropertyIri, rangeClassIri, isDirect, propertyIriFilter, textSearch)

    const queryPoller = await this.queryManager.performQuery(queryCode, this.pageSize)
    queryPoller.onNewResults = (result) => {
      onNewResults(result.results.map(res => this.getClassInstanceFromQueryResult(res)))
    }

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()
    return queryPoller.executionId
  }

  async instanceCheck(instanceIri: string, classesToCheck: string[], onResult: (resultClass: string[]) => void, onStop?: () => void) {
    const poller = await this.queryManager.instanceCheck(instanceIri, classesToCheck)

    poller.onNewResults = (result) => {
      if (result.resultClasses && result.state === QueryStatusEnum.FINISHED) {
        onResult(result.resultClasses.map(entity => entity.entityIRI))
      }
    }

    if (onStop) {
      poller.onStop = onStop
    }

    poller.start()
  }

  stopAllQueries() {
    this.queryManager.stopRunningQueries()
  }

  setEndpoint(endpoint: MastroEndpoint) {
    this.queryManager = new QueryManager(this.requestOptions, endpoint)
  }

  async getInstanceLabels(instanceIri: string, onResult: (result: { value: string, language?: string }[]) => void) {
    const queryCode = QueriesTemplates.getInstanceLabels(instanceIri)

    const queryPoller = await this.queryManager.performQuery(queryCode, 100, 1, true)
    queryPoller.onNewResults = (result) => {
      onResult(result.results.map(r => {
        return {
          value: r[0].value,
          language: r[0].lang
        }
      }))
    }

    queryPoller.start()
  }

  private getClassInstanceFromQueryResult(result: { value: string, shortIRI?: string, lang?: string }[]): ClassInstance {
    return {
      iri: result[0].value,
      shortIri: result[0].shortIRI,
      label: result[1]?.value !== 'null' && result[1]?.lang === this.language
        ? {
          language: result[1].lang,
          value: result[1]?.value
        }
        : undefined
    }
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