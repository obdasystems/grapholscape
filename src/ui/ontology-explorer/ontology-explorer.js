import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import { explore, arrow_right, arrow_down } from '../assets/icons'
import { Type } from '../../model/node-enums'

const TYPE_IMG_TEXT = {}
TYPE_IMG_TEXT[Type.DATA_PROPERTY] = 'DP'
TYPE_IMG_TEXT[Type.CONCEPT] = 'C'
TYPE_IMG_TEXT[Type.OBJECT_PROPERTY] = 'OP'
TYPE_IMG_TEXT[Type.INDIVIDUAL] = 'I'

export default class GscapeExplorer extends GscapeWidget{

  static get properties() {
    return {
      predicates: { 
        type: Object,
        attribute: false,
      }
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          left:50%;
          top:10px;
          min-width:370px;
          max-width:450px;
          transform: translate(-50%, 0);
        }

        .widget-body {
          overflow:auto;
        }

        .row{
          display: flex;
          align-items: center;
          padding:4px 0;
          cursor:pointer;
        }

        .row-label{
          padding-left:5px;
          width:100%;
          white-space: nowrap;
        }

        .icon:hover{
          color: var(--theme-gscape-primary, ${colors.primary});
          cursor:pointer;
        }

        .type-img{
          width: 26px;
          height: 26px;
          box-sizing: border-box;
          border: solid 1px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .type-img-DP {
          background-color: var(--theme-graph-attribute, ${colors.attribute});
          color: var(--theme-graph-attribute-dark, ${colors.attribute_dark});
        }

        .type-img-OP {
          background-color: var(--theme-graph-role, ${colors.role});
          color: var(--theme-graph-role-dark, ${colors.role_dark});
        }

        .type-img-C {
          background-color: var(--theme-graph-concept, ${colors.concept});
          color: var(--theme-graph-concept-dark, ${colors.concept_dark});
        }

        .type-img-I {
          background-color: var(--theme-graph-individual, ${colors.individual});
          color: var(--theme-graph-individual-dark, ${colors.individual_dark});
        }

        .sub-row{
          background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
          padding: 4px 0 4px 34px;
          cursor: pointer;
        }

        .sub-rows-wrapper{
          padding: 2px 0;
        }

        .add-shadow{
          box-shadow: 0 2px 2px 0 var(--theme-gscape-shadows, ${colors.shadows});
        }

        gscape-head input {
          position:initial;
          left: 30%;
          width: 50%;
          padding: 0 10px;
          line-height:23px;
          box-sizing: border-box;
          background-color: var(--theme-gscape-primary, ${colors.primary});
          border:none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          transition: width .35s ease-in-out;
          color:inherit;
          flex-grow:2;
          font-size:inherit;
        }

        gscape-head input:focus {
          position:absolute;
          border-color: var(--theme-gscape-secondary, ${colors.secondary});
          left: 34px;
          margin: 0px 8px;
          width:75%;
        }
      `
    ]
  }

  constructor(predicates = []) {
    super()
    this.draggable = true
    this.collapsible = true
    this.predicates = predicates
    this.onNodeNavigation = (nodeID) => {}
  }

  render() {
    function getTypeImg(type) {
      let letter = type.charAt(0).toUpperCase()

      return html`
        
      `
    }


    return html`
      <gscape-head title="Explorer">
        <input
          type="text"
          autocomplete="off"
          @keyup="${this.search}"
          placeholder="Search Entities"
        />
      </gscape-head>

      <div class="widget-body hide">
      ${this.predicates.map( occurrences => {
        let entityData = occurrences[0]
        return html`
          <div>
            <div
              id="${entityData.id}"
              class="row highlight"
              type="${entityData.type}"
              title="${entityData.type}"
              displayed_name = "${entityData.displayed_name}"
              iri = "${entityData.iri.fullIri}"
              @click='${this.toggleSubRows}'
            >
              <span class="icon">
                ${entityData.areSubrowsOpen ? arrow_down : arrow_right}
              </span>
              <div>
                <div class="type-img type-img-${TYPE_IMG_TEXT[entityData.type]}">
                  <div>${TYPE_IMG_TEXT[entityData.type]}</div>
                </div>
              </div>
              <div class="row-label" >${entityData.displayed_name}</div>
            </div>

            <div class="sub-rows-wrapper hide">
            ${occurrences.map( entityInstance => {
              return html`
                <div class="sub-row highlight"
                  diagram_id="${entityInstance.diagram_id}"
                  node_id="${entityInstance.id}"
                  @click="${this.handleNodeSelection}"
                >
                  - ${entityInstance.diagram_name} - ${entityInstance.id_xml}
                </div>
              `
            })}
            </div>
          </div>
        `
      })}
      </div>
    `
  }

  toggleSubRows(e) {
    const iri = e.currentTarget.getAttribute('iri')

    e.currentTarget.parentNode
      .querySelector('.sub-rows-wrapper')
      .classList
      .toggle('hide')

    const entity = this.predicates.find( entityOccurr => entityOccurr[0].iri.fullIri === iri)
    entity[0].areSubrowsOpen = !entity[0].areSubrowsOpen

    e.currentTarget.classList.toggle('add-shadow')
    this.requestUpdate()
  }

  handleNodeSelection(e) {
    this.collapseBody()
    let node_id = e.target.getAttribute('node_id')
    this.onNodeNavigation(node_id)
  }

  // override
  blur() {
    super.blur()
    this.shadowRoot.querySelector('input').blur()
  }

  firstUpdated() {
    super.firstUpdated()
    this.header.left_icon = explore
    this.makeDraggableHeadTitle()
  }
}

customElements.define('gscape-explorer', GscapeExplorer)