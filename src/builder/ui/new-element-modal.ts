import { css, CSSResultGroup, html, LitElement, PropertyDeclarations, SVGTemplateResult, TemplateResult } from 'lit'
import { FunctionalityEnum, GrapholEntity, Namespace, TypesEnum } from '../../model'
import * as UI from '../../ui'

const {
  ModalMixin, BaseMixin,
  icons,
  baseStyle,
  SizeEnum,
} = UI


export const datatypes = ['owl:real', 'owl:rational', 'xsd:decimal', 'xsd:integer',
'xsd:nonNegativeInteger', 'xsd:nonPositiveInteger',
'xsd:positiveInteger', 'xsd:negativeInteger', 'xsd:long',
'xsd:int', 'xsd:short', 'xsd:byte', 'xsd:unsignedLong',
'xsd:unsignedInt', 'xsd:unsignedShort', 'xsd:unsignedByte',
'xsd:double', 'xsd:float', 'xsd:string',
'xsd:normalizedString', 'xsd:token', 'xsd:language', 'xsd:Name',
'xsd:NCName', 'xsd:NMTOKEN', 'xsd:boolean', 'xsd:hexBinary',
'xsd:base64Binary',
'xsd:dateTime', 'xsd:dateTimeStamp', 'rdf:XMLLiteral',
'rdf:PlainLiteral', 'rdfs:Literal', 'xsd:anyURI']

export enum ModalTypeEnum {
  DIAGRAM = 'diagram',
  HIERARCHY = 'hierarchy',
  ISA = 'isa',
  RENAME_ENTITY = 'rename',
}

const modalIcons: { [x in ModalTypeEnum]: SVGTemplateResult } = {
  [ModalTypeEnum.DIAGRAM]: icons.diagrams,
  [ModalTypeEnum.HIERARCHY]: icons.subHierarchies,
  [ModalTypeEnum.ISA]: icons.addISAIcon,
  [ModalTypeEnum.RENAME_ENTITY]: icons.renameIcon,
}

export default class GscapeNewElementModal extends ModalMixin(BaseMixin(LitElement)) {

  public onCancel: () => void = () => { }

  public namespaces: Namespace[] = []
  public remainderToRename: string = ''
  public selectedNamespaceIndex?: number = 0

  private advancedMode: boolean = false
  private selectedDatatype: string = 'xsd:string'
  private selectedFunctionProperties: Set<FunctionalityEnum> = new Set()
  private numberOfInputs: number = 2
  private isValid: boolean = false
  private isHierarchyComplete: boolean = false
  private isHierarchyDisjoint: boolean = false

  static properties: PropertyDeclarations = {
    dialogTitle: { type: String },
    namespaces: { type: Array },
    advancedMode: { type: Boolean, state: true },
    selectedNamespaceIndex: { type: Number, state: true },
    isValid: { type: Boolean, state: true },
    isHierarchyComplete: { type: Boolean, state: true },
    isHierarchyDisjoint: { type: Boolean, state: true },
    numberOfInputs: { type: Number, state: true },
  }

  /**
   *
   * @param modalType The type of the modal, this value changes the form template.
   * it can be a TypesEnum for defining new Entities or ModalTypeEnum for other
   * types of elements to define or actions to perform
   * @param dialogTitle
   */
  constructor(public modalType: ModalTypeEnum | TypesEnum, public dialogTitle: string) {
    super()
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    css`
      :host {
        position: absolute;
      }
      .drawing-btn {
        position: absolute;
        top: 50px;
        left: 10px;
        border-radius: var(--gscape-border-radius-btn);
        border: 1px solid var(--gscape-color-border-subtle);
        background-color: var(--gscape-color-bg-default);
      }

      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%);
        max-width: 30%;
        min-width: 300px;
        max-height: calc(90% - 100px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 16px;
      }

      form {
        padding: 0 16px;
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: auto;
      }

      .header {
        margin: 2px 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .form-item > label {
        display: block;
        margin-bottom: 4px
      }

      .form-item input {
        display: block;
        width: 100%;
      }

      .buttons {
        display: flex;
        align-items: center;
        justify-content: right;
        gap: 8px;
        flex-wrap: wrap;
      }

      .dropdown {
        position: relative;
        border: solid 1px var(--gscape-color-border-subtle);
        border-radius: var(--gscape-border-radius);
      }

      .dropdown select {
        width: 100%;
      }

      .dropdown > * {
        box-sizing: border-box;
        height: 100%;
        border: none;
      }

      .dropdown input {
        position: absolute;
        width: calc(100% - 18px);
      }

      .dropdown select:focus, .dropdown input:focus {
        border-color: inherit;
        -webkit-box-shadow: none;
        box-shadow: none;
      }

      .chip {
        width: fit-content;
        border: 1px solid var(--gscape-color-neutral-muted);
        color: unset;
        background: var(--gscape-color-neutral);
      }

      .chip[selected] {
        border: 1px solid var(--gscape-color-accent);
        color: var(--gscape-color-accent);
        background: var(--gscape-color-accent-subtle);
      }

      #hierarchy-toggles {
        display: flex;
        justify-content: center;
      }

      #hierarchy-toggles > * {
        width: fit-content;
      }
    `
  ]

  /**
   * If the form is valid, dispatch the 'confirm' event setting
   * the `detail` field based on the modalType.
   * The form can be invalid in case the confirm is requested by
   * keyboard.
   * Can't be invalid if this is triggered by buttons cause they
   * are disabled if form is not valid.
   */
  private handleConfirm = async (evt?: Event) => {
    if (this.isValid) {
      await this.updateComplete
      let eventDetail: ConfirmEventDetail | undefined

      switch(this.modalType) {
        case TypesEnum.CLASS:
        case TypesEnum.INDIVIDUAL:
          if (this.selectedNamespaceValue && this.mainInputValue) {
            eventDetail = {
              iri: this.selectedNamespaceValue + this.mainInputValue,
              namespace: this.selectedNamespaceValue,
              type: this.modalType,
            } as NewEntityDetail
          }
          break

        case TypesEnum.DATA_PROPERTY:
          if (this.selectedNamespaceValue && this.mainInputValue) {
            eventDetail = {
              iri: this.selectedNamespaceValue + this.mainInputValue,
              namespace: this.selectedNamespaceValue,
              type: this.modalType,
              isFunctional: this.selectedFunctionProperties.has(FunctionalityEnum.FUNCTIONAL),
              datatype: this.selectedDatatype,
            } as NewDataPropertyDetail
          }
          break

        case TypesEnum.OBJECT_PROPERTY:
          if (this.selectedNamespaceValue && this.mainInputValue) {
            eventDetail = {
              iri: this.selectedNamespaceValue + this.mainInputValue,
              namespace: this.selectedNamespaceValue,
              type: this.modalType,
              functionProperties: Array.from(this.selectedFunctionProperties),
            } as NewObjectPropertyDetail
          }
          break

        case ModalTypeEnum.DIAGRAM:
          if (this.mainInputValue) {
            eventDetail = {
              diagramName: this.mainInputValue,
            } as NewDiagramDetail
          }
          break

        case ModalTypeEnum.RENAME_ENTITY:
          const selectedBtn = evt?.currentTarget as Element | undefined
          eventDetail = {
            newIri: this.selectedNamespaceValue + (this.mainInputValue || this.remainderToRename),
            namespace: this.selectedNamespaceValue,
            isRefactor: selectedBtn?.id === 'refactor' || false
          } as RenameEntityDetail
          break

        case ModalTypeEnum.HIERARCHY:
          const newClassesNames = this.hierarchyInputValues
          if (this.selectedNamespaceValue && newClassesNames.length >= 2) {
            eventDetail = {
              inputClassesIri: newClassesNames.map(iri => this.selectedNamespaceValue + iri),
              namespace: this.selectedNamespaceValue,
              isComplete: this.isHierarchyComplete,
              isDisjoint: this.isHierarchyDisjoint,
            } as NewSubHierarchyDetail
          }
      }

      if (eventDetail) {
        this.dispatchEvent(new CustomEvent('confirm', {
          bubbles: true,
          composed: true,
          detail: eventDetail
        }))
      }
    }
  }

  private handleCancel = () => {
    this.onCancel()
    this.remove()
  }

  private validate() {
    const mainInputLength = this.mainInputValue?.length || 0
    const nameSpaceInputLength = this.selectedNamespaceValue?.length || 0
    switch(this.modalType) {
      case TypesEnum.CLASS:
      case TypesEnum.DATA_PROPERTY:
      case TypesEnum.OBJECT_PROPERTY:
      case TypesEnum.INDIVIDUAL:
      case ModalTypeEnum.ISA:
        this.isValid = mainInputLength > 0 && nameSpaceInputLength > 0
        break

      case ModalTypeEnum.RENAME_ENTITY:
        if (this.advancedMode) {
          // in advanced mode, you can rename/refactor only the namespace
          this.isValid = nameSpaceInputLength > 0
        } else {
          // In basic mode, you must rename remainder to submit
          this.isValid = mainInputLength > 0 && nameSpaceInputLength > 0
        }

        break

      case ModalTypeEnum.DIAGRAM:
        this.isValid = mainInputLength > 0
        break

      case ModalTypeEnum.HIERARCHY:
        this.isValid =
          this.hierarchyInputValues.length >= 2 &&
          nameSpaceInputLength > 0
        break
    }
  }

  private toggleAdvanced() {
    this.advancedMode = !this.advancedMode
  }

  private handleNamespaceSelection(e: Event) {
    const selectTarget = e.currentTarget as HTMLSelectElement
    if (selectTarget) {
      const namespaceInput = this.shadowRoot?.querySelector('#newnamespace') as HTMLInputElement
      const index = parseInt(selectTarget.value)
      this.selectedNamespaceIndex = !Number.isNaN(index) ? index : undefined;
      namespaceInput.value = this.selectedNamespaceIndex !== undefined
        ? this.namespaces[this.selectedNamespaceIndex].toString()
        : ''
      namespaceInput.focus()
    }

    this.validate()
  }

  private handleNamespaceInput(e: Event) {
    const inputTarget = e.currentTarget as HTMLInputElement

    if (inputTarget) {
      this.selectedNamespaceIndex = undefined
    }
    this.validate()
  }

  private handleDataTypeSelection(e: Event) {
    const selectTarget = e.currentTarget as HTMLSelectElement

    if (selectTarget) {
      this.selectedDatatype = selectTarget.value
    }
  }

  private handleFunctionPropertyClick(e: Event) {
    const chip = e.currentTarget as HTMLElement | null

    if (chip) {
      const property = chip.id as FunctionalityEnum
      if (this.selectedFunctionProperties.has(property)) {
        this.selectedFunctionProperties.delete(property)
      } else {
        this.selectedFunctionProperties.add(property)
      }

      this.requestUpdate()
    }
  }

  private getNamespacesTemplate() {
    return html`
      <div class="form-item">
        <label id="namespace-label" for="newnamespace">Namespace:</label>
        <div class="dropdown">
          <input
            id="newnamespace"
            value=${this.selectedNamespaceIndex !== undefined ? this.namespaces[this.selectedNamespaceIndex] : ''}
            @input=${this.handleNamespaceInput}
            type="text"
          />
          <select id="namespace" name="namespace" value=${this.selectedNamespaceValue} @change=${this.handleNamespaceSelection} required>
            ${this.namespaces?.map((n, i) => {
              return html`<option value=${i} ?selected=${i === this.selectedNamespaceIndex}>${n.toString()}</option>`
            })}
            <option value="" ?selected=${this.selectedNamespaceIndex === undefined}></option>
          </select>
        </div>
      </div>
    `
  }

  private newEntityForm() {
    return html`
      ${this.advancedMode ? this.getNamespacesTemplate() : null}

      <div class="form-item">
        <label for="input">Name:</label>
        <input
          id="input"
          type="text"
          @input=${this.validate}
          required
          placeholder=${this.remainderToRename}
        />
      </div>

      ${this.modalType === TypesEnum.DATA_PROPERTY
        ? html`
          <div class="form-item">
            <label id="datatype-label" for="datatype">Datatype:</label>
            <select id="datatype" name="datatype" required @change=${this.handleDataTypeSelection}>
              ${datatypes.sort().map(datatype => html`
                <option value=${datatype} ?selected=${this.selectedDatatype === datatype} >${datatype}</option>
              `)}
            </select>
          </div>

          <div class="form-item" style="margin-top: 4px">
            ${this.getFunctionPropertyChip(FunctionalityEnum.FUNCTIONAL)}
          </div>
        `
        : null
      }

      ${this.modalType === TypesEnum.OBJECT_PROPERTY
        ? html`
          <div id="function-properties" class="form-item">
            <label>Properties</label>
            <div>
              ${Object.values(FunctionalityEnum).map(f => this.getFunctionPropertyChip(f))}
            </div>
          </div>
        `
        : null
      }
    `
  }

  private newDiagramForm() {
    return html`
      <div class="form-item">
        <label for="input">Diagram Name:</label>
        <input id="input"
          type="text"
          @input=${this.validate}
          name="input"
          required
        >
      </div>
    `
  }

  private newSubHierarchyForm() {
    const inputs: TemplateResult[] = []

    for (let i = 0; i < this.numberOfInputs; i += 1) {
      inputs.push(html`
        <input
          class="subclass-input"
          style="margin-bottom: 8px;"
          type="text"
          @input=${this.validate}
          name="input"
        />
      `)
    }

    const onAdd = () => this.numberOfInputs += 1
    const toggleComplete = (e: Event) => {
      e.preventDefault()
      this.isHierarchyComplete = !this.isHierarchyComplete
    }
    const toggleDisjoint = (e: Event) => {
      e.preventDefault()
      this.isHierarchyDisjoint = !this.isHierarchyDisjoint
    }

    return html`
      ${this.advancedMode ? this.getNamespacesTemplate() : null}

      <div class="form-item">
        <label>Sub Classes:</label>
        ${inputs}
      </div>

      <gscape-button style="align-self: center;" title="Add Subclass" @click=${onAdd} size=${SizeEnum.S}>
        <span slot="icon">${icons.plus}</span>
      </gscape-button>

      <div id ="hierarchy-toggles" class="form-item">
        <gscape-toggle
          class="actionable"
          label="Complete"
          @click=${toggleComplete}
          ?checked=${this.isHierarchyComplete}>
        </gscape-toggle>
        <gscape-toggle
          class="actionable"
          label="Disjoint"
          @click=${toggleDisjoint}
          ?checked=${this.isHierarchyDisjoint}>
        </gscape-toggle>
      </div>
    `
  }

  private getForm() {
    switch(this.modalType) {
      case TypesEnum.CLASS:
      case TypesEnum.DATA_PROPERTY:
      case TypesEnum.OBJECT_PROPERTY:
      case TypesEnum.INDIVIDUAL:
      case ModalTypeEnum.RENAME_ENTITY:
      case ModalTypeEnum.ISA:
        return this.newEntityForm()

      case ModalTypeEnum.DIAGRAM:
        return this.newDiagramForm()

      case ModalTypeEnum.HIERARCHY:
        return this.newSubHierarchyForm()

      default:
        return null
    }
  }

  private getFunctionPropertyChip(property: FunctionalityEnum) {
    return html`
      <span
        id=${property}
        class="chip actionable"
        @click=${this.handleFunctionPropertyClick}
        ?selected=${this.selectedFunctionProperties.has(property)}
      >
        ${this.selectedFunctionProperties.has(property) ? html`&#10003; ` : null} ${property}
      </span>
    `
  }

  // Set the standard keyup event listener on the whole component
  // equal to <gscape-new-element-modal @keyup=${...}>...</gscape-new-element-modal>
  private handleKeyUp = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') { // keyCode deprecated
      this.handleConfirm()
    } else if (evt.key === 'Escape') {
      this.handleCancel()
    }
  }

  private get hierarchyInputValues() {
    const values: string[] = []
    const inputs = (this.shadowRoot?.querySelectorAll('form input.subclass-input') || []) as HTMLInputElement[]
    for (let input of inputs) {
      if (input.value && input.value.length > 0) {
        values.push(input.value)
      }
    }

    return values
  }

  private get selectedNamespaceValue() {
    if (this.namespaces?.length > 0 &&
        this.selectedNamespaceIndex !== undefined &&
        this.namespaces[this.selectedNamespaceIndex])
      return this.namespaces[this.selectedNamespaceIndex].toString()
    else
      return (this.shadowRoot?.querySelector('#newnamespace') as HTMLInputElement | undefined)?.value
  }

  private get mainInputValue() {
    return (this.shadowRoot?.querySelector('#input') as HTMLInputElement | undefined)?.value
  }

  private get isAdvanceAllowed() {
    switch(this.modalType) {
      case TypesEnum.CLASS:
      case TypesEnum.DATA_PROPERTY:
      case TypesEnum.OBJECT_PROPERTY:
      case TypesEnum.INDIVIDUAL:
      case ModalTypeEnum.HIERARCHY:
      case ModalTypeEnum.ISA:
      case ModalTypeEnum.RENAME_ENTITY:
        return true

      default:
        return false
    }
  }

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('keyup', this.handleKeyUp)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  render() {
    const headerIcon = icons.entityIcons[this.modalType] || modalIcons[this.modalType]
    return html`
      <div class="gscape-panel">
        <div class="header">
          ${headerIcon ? html`<span class="slotted-icon">${headerIcon}</span>` : null}
          <span>${this.dialogTitle}</span>
        </div>
        <form
          id="new-element-form"
          action= "javascript:void(0);"
          autocomplete="off"
        >
          ${this.getForm()}
        </form>
        <div class="buttons" id="buttons">
            ${this.isAdvanceAllowed
              ? html`
                <span
                  class="actionable muted-text"
                  @click=${this.toggleAdvanced}
                  style="margin-right: auto; text-decoration: underline; align-self: end; flex-shrink: 0;"
                >
                  ${this.advancedMode ? "Base settings" : "Advanced settings"}
                </span>
              `
              : null
            }
            <gscape-button label="Cancel" type="subtle" size=${SizeEnum.S} @click=${this.handleCancel}></gscape-button>
            <gscape-button
              id="ok"
              label="${this.modalType === ModalTypeEnum.RENAME_ENTITY ? 'Rename' : 'Ok'}"
              @click=${this.handleConfirm}
              ?disabled=${!this.isValid}
            ></gscape-button>

            ${this.modalType === ModalTypeEnum.RENAME_ENTITY
              ? html`
                <gscape-button
                  id="refactor"
                  label="Refactor"
                  @click=${this.handleConfirm}
                  ?disabled=${!this.isValid}
                ></gscape-button>
              `
              : null
            }

        </div>
      </div>
    `
  }
}

export type ConfirmEventDetail =
  NewDiagramDetail |
  NewEntityDetail |
  NewIsaDetail |
  NewObjectPropertyDetail |
  NewDataPropertyDetail |
  RenameEntityDetail |
  NewSubHierarchyDetail

/**
 * Trigged event for a new diagram. detail field is an object
 * with only diagramName specified.
 */
export type NewDiagramDetail = { diagramName: string }

/**
 * Trigged event for a new entity
 * Event.detail includes `iri` and `type`
 */
export type NewEntityDetail = { iri: string, type: TypesEnum, namespace: string }

/**
 * Trigged event for a new ISA.
 * Event.detail include class `iri` and `isaType` which user can choose
 */
export type NewIsaDetail = NewEntityDetail & { type: TypesEnum.CLASS, isaType: 'subclass' | 'superclass' }

/**
 * Trigged event for a new Data Property.
 * Event.detail include `iri`, `datatype` and `isFunctional`
 */
export type NewDataPropertyDetail = NewEntityDetail & {
  datatype: string,
  isFunctional: boolean
}

/**
 * Trigged event for a new Object Property.
 * Event.detail include `iri`, `datatype` and `isFunctional`
 */
export type NewObjectPropertyDetail = NewEntityDetail & {
  functionProperties: FunctionalityEnum[]
}

/**
 * Trigged event for a new Object Property.
 * Event.detail include `inputClassesIri`, `isDisjoint` and `isComplete`
 */
export type NewSubHierarchyDetail = {
  inputClassesIri: string[],
  namespace: string,
  isDisjoint: boolean,
  isComplete: boolean,
}

/**
 * Trigged event for a rename entity.
 * Event.detail include `newIri` and `isRefactor`
 */
export type RenameEntityDetail = { newIri: string, namespace: string, isRefactor: boolean }

customElements.define('gscape-new-element', GscapeNewElementModal)