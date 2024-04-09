import Iri from "../iri";
import GrapholEntity from "./entity";
import { DataPropertyValue, ClassInstanceEntity as IClassInstanceEntity, TypesEnum } from "../rdf-graph/swagger";

/** @internal */
export default class ClassInstanceEntity extends GrapholEntity implements IClassInstanceEntity {

  private _parentClassIris: Iri[] = []
  private _dataProperties: Map<string, Promise<DataPropertyValue[]>> = new Map()
  protected _manualTypes?: Set<TypesEnum> | undefined = new Set([TypesEnum.INDIVIDUAL])

  constructor(iri: Iri, parentClassIris: Iri[] = []) {
    super(iri)

    this._parentClassIris = parentClassIris
  }

  /**
   * Set the instance to be instance of a particular Class.
   * If it is already instance of such a class, no changes will be made.
   * @param parentClassIri the IRI of the Class
   */
  addParentClass(parentClassIri: Iri) {
    if (!this.hasParentClassIri(parentClassIri)) {
      this._parentClassIris?.push(parentClassIri)
    }
  }

  /**
   * Check if the instance is instance of a class with such an IRI
   * @param parentClassIri 
   * @returns 
   */
  hasParentClassIri(parentClassIri: string | Iri) {
    return this._parentClassIris.find(iri => iri.equals(parentClassIri)) !== undefined
  }

  get isRDFTypeUnknown() { return this._parentClassIris.length === 0 }
  get parentClassIris() { return Array.from(this._parentClassIris) }

  getDataPropertiesValues() {
    return this._dataProperties
  }

  getDataPropertyValues(dataPropertyIri: string) {
    return this._dataProperties.get(dataPropertyIri)
  }

  addDataProperty(iri: string, values: Promise<DataPropertyValue[]>) {
    this._dataProperties.set(iri, values)
  }

  set dataProperties(newProperties: DataPropertyValue[]) {
    newProperties.forEach(dpValue => {
      const existentDpValues = this._dataProperties.get(dpValue.iri)
      const newValues = new Promise<DataPropertyValue[]>(resolve => {
        if (existentDpValues)
          existentDpValues.then(values => resolve([...values, dpValue]))
        else
          resolve([dpValue])
      })
      this._dataProperties.set(dpValue.iri, newValues)
    })
  }

  /**
   * Do not use this to get data properties values, 
   * use getDataPropertiesValues or getDataPropertyValues and await for promises.
   */
  get dataProperties() { return [] }

  public json(): IClassInstanceEntity {
    const result = super.json() as IClassInstanceEntity

    result.parentClasses = this.parentClassIris.map(iri => iri.fullIri)

    return result
  }
}