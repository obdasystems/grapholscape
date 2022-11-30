import Iri from "../iri";
import GrapholEntity from "./entity";
import { GrapholTypesEnum } from "./enums";

export default class ClassInstanceEntity extends GrapholEntity {

  dataProperties: Map<string, string | undefined> = new Map()

  constructor(iri: Iri, public parentClassIri: Iri) {
    super(iri, GrapholTypesEnum.CLASS_INSTANCE)
  }

  addDataProperty(dataPropertyIri: string) {
    this.dataProperties.set(dataPropertyIri, undefined)
  }

  addDataPropertyValue(dataPropertyIri: string, value: string) {
    this.dataProperties.set(dataPropertyIri, value)
  }
}