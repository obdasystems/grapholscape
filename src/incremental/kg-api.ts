export type ClassInstance = {
  iri: string,
  label?: string,
}

export type ObjectPropertyInstance = {
  iri: string,
  domain: ClassInstance,
  range: ClassInstance,
}

export interface IVirtualKnowledgeGraphApi {
  getInstances: (iri: string, onNewResults: () => void, onStop:() => void, searchText?: string) => void,
  getInstancesNumber: (iri: string) => number,
  getInstanceObjectProperties: (iri: string) => ObjectPropertyInstance[],
}

export let vKGApi: IVirtualKnowledgeGraphApi | undefined

export function setVirtualKnowledgeGraphApi(virtualKnowledgeGraphApi: IVirtualKnowledgeGraphApi) {
  vKGApi = virtualKnowledgeGraphApi
}

export default class VKGApi implements IVirtualKnowledgeGraphApi{

  constructor(private requestOptions) { }

  getInstancesNumber: (iri: string) => number
  getInstanceObjectProperties: (iri: string) => ObjectPropertyInstance[]

  getInstances(iri: string, onNewResults: () => void, onStop:() => void, searchText?: string) {
    
  }
}

// Stubbed API
export let vKGApiStub: IVirtualKnowledgeGraphApi = {
  getInstances: (iri: string) => {
    return [
      {
        iri: `http://obdm.obdasystems.com/book/1`,
        label: 'Harry Potter',
      },
      {
        iri: `http://obdm.obdasystems.com/book/2`,
        label: 'It',
      },
      {
        iri: `http://obdm.obdasystems.com/book/3`
      },
      {
        iri: `http://obdm.obdasystems.com/book/4`,
        label: 'Divina Commedia',
      },
      {
        iri: `http://obdm.obdasystems.com/book/5`,
        label: 'Promessi Sposi',
      },
      {
        iri: `http://obdm.obdasystems.com/book/6`,
        label: 'Songs Of My Nightmares',
      },
      {
        iri: `http://obdm.obdasystems.com/book/7`,
      },
      {
        iri: `http://obdm.obdasystems.com/book/8`,
      },
      {
        iri: `http://obdm.obdasystems.com/book/9`,
        label: 'Losing The Sun',
      },
      {
        iri: `http://obdm.obdasystems.com/book/10`,
        label: 'Sailing Into The Void',
      },
      {
        iri: `http://obdm.obdasystems.com/book/11`,
        label: 'Calling Myself',
      },
      {
        iri: `http://obdm.obdasystems.com/book/12`,
        label: 'Bleeding At The Mountains',
      },
    ]
  },
  getInstancesNumber: function (iri: string): number {
    return 12
  },
  getInstanceObjectProperties: function (iri: string): ObjectPropertyInstance[] {
    throw new Error("Function not implemented.")
  }
}