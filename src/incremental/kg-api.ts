export type ClassInstance = {
  iri: string,
  label?: string,
}

export type ObjectPropertyInstance = {
  iri: string,
  domain: ClassInstance,
  range: ClassInstance,
}

export interface VirtualKnowledgeGraphApi {
  getInstances: (iri: string) => ClassInstance[],
  getInstancesNumber: (iri: string) => number,
  getInstanceObjectProperties: (iri: string) => ObjectPropertyInstance[],
}

export let vKGApi: VirtualKnowledgeGraphApi | undefined

export function setVirtualKnowledgeGraphApi(virtualKnowledgeGraphApi: VirtualKnowledgeGraphApi) {
  vKGApi = virtualKnowledgeGraphApi
}

// Stubbed API
export let vKGApiStub: VirtualKnowledgeGraphApi = {
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