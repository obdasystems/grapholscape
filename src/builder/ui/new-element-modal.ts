import { css, CSSResultGroup, html, LitElement, PropertyDeclarations, SVGTemplateResult, TemplateResult } from 'lit'
import { Language } from '../../config'
import { FunctionalityEnum, Namespace, TypesEnum } from '../../model'
import * as UI from '../../ui'
import { subHierarchies, superHierarchies } from '../../ui/assets'
import modalSharedStyles from './modal-shared-styles'

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
  private inputs: {
    name?: string,
    datatype?: string,
    functionProperties?: Set<FunctionalityEnum>
  }[] = [{ datatype: 'xsd:string' }]
  private isValid: boolean = false
  private deriveLabel: boolean = true
  private convertCamel: boolean = true
  private convertSnake: boolean = false
  private isHierarchyComplete: boolean = false
  private isHierarchyDisjoint: boolean = false
  private isaDirection: 'superclass' | 'subclass' = 'subclass'

  static properties: PropertyDeclarations = {
    dialogTitle: { type: String },
    namespaces: { type: Array },
    advancedMode: { type: Boolean, state: true },
    selectedNamespaceIndex: { type: Number, state: true },
    isValid: { type: Boolean, state: true },
    deriveLabel: {type: Boolean, state: true},
    convertCamel: {type: Boolean, state: true},
    convertSnake: {type: Boolean, state: true}, 
    isHierarchyComplete: { type: Boolean, state: true },
    isHierarchyDisjoint: { type: Boolean, state: true },
    inputs: { type: Array, state: true },
    isaDirection: { type: String, state: true },
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
    modalSharedStyles,
    css`
      :host {
        position: absolute;
      }

      #hierarchy-toggles {
        display: flex;
        justify-content: center;
      }

      #hierarchy-toggles > * {
        width: fit-content;
      }

      .form-item.data-property-row {
        display: flex;
        align-items: center;
        gap: 8px;
        overflow: auto;
      }

      .movedown-chip {
        position: relative;
        top: 9px;
      }

      #advanced-settings.area {
        padding: 16px;
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
      let eventsDetail: ConfirmEventDetail[] = []

      switch(this.modalType) {
        case TypesEnum.CLASS:
        case TypesEnum.INDIVIDUAL:
          if (this.selectedNamespaceValue && this.mainInputValue) {
            this.inputs.filter(i => i.name && i.name.length > 0).forEach(input => {
              eventsDetail.push({
                iri: this.selectedNamespaceValue! + input.name,
                namespace: this.selectedNamespaceValue,
                type: this.modalType,
                deriveLabel: this.deriveLabel,
                convertCamel: this.convertCamel,
                convertSnake: this.convertSnake,
                lang: this.labelLanguage,
              } as NewEntityDetail)
            })
          }
          break

        case TypesEnum.DATA_PROPERTY:
          if (this.selectedNamespaceValue && this.mainInputValue) {
            this.inputs.filter(i => i.name && i.name.length > 0).forEach(input => {
                eventsDetail.push({
                iri: this.selectedNamespaceValue! + input.name,
                namespace: this.selectedNamespaceValue,
                type: this.modalType,
                deriveLabel: this.deriveLabel,
                convertCamel: this.convertCamel,
                convertSnake: this.convertSnake,
                lang: this.labelLanguage,
                isFunctional: input.functionProperties?.has(FunctionalityEnum.FUNCTIONAL) || false,
                datatype: input.datatype,
              } as NewDataPropertyDetail)
            })
          }
          break

        case TypesEnum.OBJECT_PROPERTY:
          if (this.selectedNamespaceValue && this.mainInputValue) {
            eventsDetail = [{
              iri: this.selectedNamespaceValue + this.mainInputValue,
              namespace: this.selectedNamespaceValue,
              type: this.modalType,
              deriveLabel: this.deriveLabel,
              convertCamel: this.convertCamel,
              convertSnake: this.convertSnake,
              lang: this.labelLanguage,
              functionProperties: Array.from(this.inputs[0].functionProperties || []),
            } as NewObjectPropertyDetail]
          }
          break

        case ModalTypeEnum.DIAGRAM:
          if (this.mainInputValue) {
            eventsDetail = [{
              diagramName: this.mainInputValue,
            } as NewDiagramDetail]
          }
          break

        case ModalTypeEnum.RENAME_ENTITY:
          const selectedBtn = evt?.currentTarget as Element | undefined
          eventsDetail = [{
            newIri: this.selectedNamespaceValue + (this.mainInputValue || this.remainderToRename),
            namespace: this.selectedNamespaceValue,
            isRefactor: selectedBtn?.id === 'refactor' || false
          } as RenameEntityDetail]
          break

        case ModalTypeEnum.HIERARCHY:
          const newClassesNames = (
            this.inputs.filter(i => i.name && i.name.length > 0) as { name: string }[]
            ).map(i => i.name)
          if (this.selectedNamespaceValue && newClassesNames.length >= 2) {
            eventsDetail = [{
              inputClassesIri: newClassesNames.map(iri => this.selectedNamespaceValue + iri),
              namespace: this.selectedNamespaceValue,
              isComplete: this.isHierarchyComplete,
              isDisjoint: this.isHierarchyDisjoint,
              deriveLabel: this.deriveLabel,
              convertCamel: this.convertCamel,
              convertSnake: this.convertSnake,
              lang: this.labelLanguage,
            } as NewSubHierarchyDetail]
          }
          break
        
        case ModalTypeEnum.ISA:
          if (this.selectedNamespaceValue && this.mainInputValue) {
            eventsDetail = [{
              iri: this.selectedNamespaceValue + this.mainInputValue,
              namespace: this.selectedNamespaceValue,
              type: TypesEnum.CLASS,
              deriveLabel: this.deriveLabel,
              convertCamel: this.convertCamel,
              convertSnake: this.convertSnake,
              lang: this.labelLanguage,
              isaDirection: this.isaDirection,
            } as NewIsaDetail]
          }
          break
      }

      eventsDetail.forEach(event => {
        this.dispatchEvent(new CustomEvent('confirm', {
          bubbles: true,
          composed: true,
          detail: event
        }))
      })
    }
  }

  private handleCancel = () => {
    this.onCancel()
    this.remove()
  }

  private validate() {
    // const mainInputLength = this.mainInputValue?.length || 0
    const atLeastOneInput = this.inputs.some(i => i.name && i.name.length > 0)
    const nameSpaceInputLength = this.selectedNamespaceValue?.length || 0
    switch(this.modalType) {
      case TypesEnum.CLASS:
      case TypesEnum.DATA_PROPERTY:
      case TypesEnum.OBJECT_PROPERTY:
      case TypesEnum.INDIVIDUAL:
      case ModalTypeEnum.ISA:
        this.isValid = atLeastOneInput && nameSpaceInputLength > 0
        break

      case ModalTypeEnum.RENAME_ENTITY:
        if (this.advancedMode) {
          // in advanced mode, you can also rename/refactor only the namespace
          this.isValid = nameSpaceInputLength > 0
        } else {
          // In basic mode, you must rename remainder to submit
          this.isValid = atLeastOneInput && nameSpaceInputLength > 0
        }

        break

      case ModalTypeEnum.DIAGRAM:
        this.isValid = this.mainInputValue? this.mainInputValue.length > 0 : false
        break

      case ModalTypeEnum.HIERARCHY:
        this.isValid =
          this.inputs.filter(i => i.name && i.name.length > 0).length >= 2
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

  private handleDataTypeSelection(e: Event, i = 0) {
    const selectTarget = e.currentTarget as HTMLSelectElement

    if (selectTarget && this.inputs[i]) {
      this.inputs[i].datatype = selectTarget.value
    }
  }

  private handleLanguageSelection(e: Event) {
    const selectTarget = e.currentTarget as HTMLSelectElement
    if (selectTarget) {
        const languageInput = this.shadowRoot?.querySelector('#newlan') as HTMLInputElement
        const value = selectTarget.value
        languageInput.value = value
        ? value
        : ''
        languageInput.focus()
    }    

    this.validate()

}

  private handleFunctionPropertyClick(e: Event, i: number, property: FunctionalityEnum) {
    const input = this.inputs[i]

    if (input) {
      if (input.functionProperties?.has(property)) {
        input.functionProperties.delete(property)
      } else {
        if (input.functionProperties)
          input.functionProperties.add(property)
        else
          input.functionProperties = new Set([property])
      }
    }

    this.requestUpdate()
  }

  private handleInputChange(e, i = 0) {
    this.inputs[i].name = e.currentTarget.value

    this.validate()
  }

  private handleAddInput() {
    switch (this.modalType) {
      case TypesEnum.DATA_PROPERTY:
        this.inputs = this.inputs.concat({ name: '', datatype: 'xsd:string' })
        break
      default:
        this.inputs = this.inputs.concat({})
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

  private getMainInput(i: number = 0) {
    return html`
      <div class="form-item">
        ${i === 0 ? html`<label for="input-0">Name:</label>` : null}
        <input
          id="input-${i}"
          type="text"
          @input=${(e) => this.handleInputChange(e, i)}
          required
          placeholder=${this.remainderToRename}
        />
      </div>
    `
  }

  private getLabelSettings() {

    const toggleLabel = (e: Event) => {
      e.preventDefault()
      this.deriveLabel = !this.deriveLabel
    }

    const toggleCamelCase = (e: Event) => {
      e.preventDefault()
      this.convertCamel = !this.convertCamel
    }

    const toggleSnakeCase = (e: Event) => {
      e.preventDefault()
      this.convertSnake = !this.convertSnake
    }

    return html`
      <div id = 'label-settings' class="form-item">
        <label id="label-label" for="label">Label:</label>
        <gscape-toggle
          class="actionable"
          label="Derive label from input"
          @click=${toggleLabel}
          ?checked=${this.deriveLabel}>
        </gscape-toggle>
        ${this.deriveLabel ? html`
        <label id="language-label" for="language">Language:</label>
        <div class="dropdown">
            <input id="newlan" type="text"/>
            <select id="language" onchange=${this.handleLanguageSelection} name="language" required>
                ${Object.values(Language).sort().map((n, i) => {
                    return html`<option value="${n.toString()}"; >${n.toString()}</option>`
                })}
                <option value=""></option>
            </select>
        </div><br>
        <span
          id='camelCase'
          class="chip actionable"
          @click=${toggleCamelCase}
          ?selected=${this.convertCamel}
        >
          ${this.convertCamel ? html`&#10003; ` : null} Convert camelCase
        </span>
        <span
          id='snake_case'
          class="chip actionable"
          @click=${toggleSnakeCase}
          ?selected=${this.convertSnake}
        >
          ${this.convertSnake ? html`&#10003; ` : null} Convert snake_case
        </span>
        
        `
         : null}
      </div>
    `
  }

  private newDataPropertyForm() {
    return html`

      ${this.inputs.map((input, i) => {
        return html`
          <div class="form-item data-property-row" input-index=${i}>
            ${this.getMainInput(i)}

            <div>
              ${i === 0 ? html`<label>Datatype:</label>` : null}
              <select id="datatype" name="datatype" required @change=${(e) => this.handleDataTypeSelection(e, i)}>
                ${datatypes.sort().map(datatype => html`
                  <option value=${datatype} ?selected=${input.datatype === datatype} >${datatype}</option>
                `)}
              </select>
            </div>

            <div class="${i === 0 ? 'movedown-chip' : null}">
              ${this.getFunctionPropertyChip(FunctionalityEnum.FUNCTIONAL, i)}
            </div>
          </div>
        `
      })}

      <gscape-button style="align-self: center;" title="Add Subclass" @click=${this.handleAddInput} size=${SizeEnum.S}>
        <span slot="icon">${icons.plus}</span>
      </gscape-button>

      ${this.getAdvancedSection()}
    `
  }

  private newOBjectPropertyForm() {
    return html`
      ${this.getMainInput()}
      
      <div id="function-properties" class="form-item">
        <label>Properties</label>
        <div>
          ${this.advancedMode 
            ? Object.values(FunctionalityEnum).map(f => this.getFunctionPropertyChip(f))
            : html`
              ${this.getFunctionPropertyChip(FunctionalityEnum.FUNCTIONAL)}
              ${this.getFunctionPropertyChip(FunctionalityEnum.INVERSE_FUNCTIONAL)}
            `
          }
        </div>
      </div>

      ${this.getAdvancedSection()}
    `
  }

  private newISAForm() {

    const toggleISADirection = () => {
      this.isaDirection = this.isaDirection === 'subclass' ? 'superclass' : 'subclass'
    }

    return html`
      ${this.getMainInput()}

      <div class="form-item" style="align-self: center">
        <gscape-button
          label=${`As ${this.isaDirection.charAt(0).toUpperCase().concat(this.isaDirection.slice(1))}`}
          size=${SizeEnum.S}
          type='subtle'
          @click=${toggleISADirection}
        >
          <span slot="icon">
            ${this.isaDirection === 'superclass'
              ? superHierarchies
              : subHierarchies
            }
          </span>
        </gscape-button>
      </div>

      ${this.getAdvancedSection()}
    `
  }

  private newEntityForm() {
    return html`
      ${this.inputs.map((input, i) => html`
        ${this.getMainInput(i)}
      `)}

      <gscape-button style="align-self: center;" title="Add Subclass" @click=${this.handleAddInput} size=${SizeEnum.S}>
        <span slot="icon">${icons.plus}</span>
      </gscape-button>

      ${this.getAdvancedSection()}
    `
  }

  private renameEntityForm() {
    return html`
      ${this.getMainInput()}
      ${this.getAdvancedSection()}
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

    for (let i = 0; i < this.inputs.length; i += 1) {
      inputs.push(html`
        <input
          class="subclass-input"
          style="margin-bottom: 8px;"
          type="text"
          @input=${(e) => this.handleInputChange(e, i)}
          name="input"
        />
      `)
    }

    // const onAdd = () => this.numberOfInputs += 1
    const toggleComplete = (e: Event) => {
      e.preventDefault()
      this.isHierarchyComplete = !this.isHierarchyComplete
    }
    const toggleDisjoint = (e: Event) => {
      e.preventDefault()
      this.isHierarchyDisjoint = !this.isHierarchyDisjoint
    }

    return html`
      <div class="form-item">
        <label>Sub Classes:</label>
        ${inputs}
      </div>

      <gscape-button style="align-self: center;" title="Add Subclass" @click=${this.handleAddInput} size=${SizeEnum.S}>
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
      ${this.getAdvancedSection()}
    `
  }

  private getAdvancedSection() {
    if (this.advancedMode) {
      if(this.modalType === ModalTypeEnum.RENAME_ENTITY) {
        return html`
          <div class="hr" style="margin: 16px auto"></div>
          <div id="advanced-settings" class="area">
            ${this.getNamespacesTemplate()}
        `
      } else {
        return html`
          <div class="hr" style="margin: 16px auto"></div>
          <div id="advanced-settings" class="area">
            ${this.getNamespacesTemplate()}
            ${this.getLabelSettings()}
          </div>
        `
      }
    }
  }

  private getForm() {
    switch(this.modalType) {
      case TypesEnum.DATA_PROPERTY:
        return this.newDataPropertyForm()

      case TypesEnum.OBJECT_PROPERTY:
        return this.newOBjectPropertyForm()

      case TypesEnum.INDIVIDUAL:
      case TypesEnum.CLASS:
        return this.newEntityForm()

      case ModalTypeEnum.RENAME_ENTITY:
        return this.renameEntityForm()

      case ModalTypeEnum.ISA:
        return this.newISAForm()

      case ModalTypeEnum.DIAGRAM:
        return this.newDiagramForm()

      case ModalTypeEnum.HIERARCHY:
        return this.newSubHierarchyForm()

      default:
        return null
    }
  }

  private getFunctionPropertyChip(property: FunctionalityEnum, i = 0) {
    return html`
      <span
        id=${property}
        class="chip actionable"
        @click=${(e) => this.handleFunctionPropertyClick(e, i, property)}
        ?selected=${this.inputs[i].functionProperties?.has(property)}
      >
        ${this.inputs[i].functionProperties?.has(property) ? html`&#10003; ` : null} ${property}
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
    switch(this.modalType) {
      case ModalTypeEnum.DIAGRAM:
        return (this.shadowRoot?.querySelector('#input') as HTMLInputElement).value
      default:
        return this.inputs.find(i => i.name && i.name.length > 0)?.name
    }
  }

  private get labelLanguage() {
    return (this.shadowRoot?.querySelector('#newlan') as HTMLInputElement | undefined)?.value
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
        <div class="modal-body">
          <form
            id="new-element-form"
            action= "javascript:void(0);"
            autocomplete="off"
          >
            ${this.getForm()}
          </form>
        </div>
        <div class="bottom-buttons" id="buttons">
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

          <gscape-button
            id="ok"
            type="primary"
            label="${this.modalType === ModalTypeEnum.RENAME_ENTITY ? 'Rename' : 'Ok'}"
            @click=${this.handleConfirm}
            ?disabled=${!this.isValid}
          ></gscape-button>
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
export type NewEntityDetail = { iri: string, type: TypesEnum, namespace: string, deriveLabel: boolean, convertCamel: boolean, convertSnake: boolean, lang: string}

/**
 * Trigged event for a new ISA.
 * Event.detail include class `iri` and `isaType` which user can choose
 */
export type NewIsaDetail = NewEntityDetail & { type: TypesEnum.CLASS, isaDirection: 'subclass' | 'superclass' }

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
  deriveLabel: boolean, 
  convertCamel: boolean, 
  convertSnake: boolean, 
  lang: string
}

/**
 * Trigged event for a rename entity.
 * Event.detail include `newIri` and `isRefactor`
 */
export type RenameEntityDetail = { newIri: string, namespace: string, isRefactor: boolean }

customElements.define('gscape-new-element', GscapeNewElementModal)