import { html, css } from 'lit-element'
import GscapeWidget from './common/gscape-widget'
import GscapeHeader from './common/gscape-header'

export default class GscapeExplorer extends GscapeWidget{

  static get properties() {
    return [
      super.properties,
      {
        predicates: Object
      }
    ]
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
          line-height: 0;
          display: flex;
          align-items: center;
          padding:4px 0;
        }

        .row-label{
          padding-left:5px;
          cursor:pointer;
          width:100%;
          white-space: nowrap;
        }

        mwc-icon:hover{
          color: var(--theme-gscape-primary, ${colors.primary});
          cursor:pointer;
        }

        .type-img{
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
        }

        .type-img-A{
          background-color: var(--theme-graph-attribute, ${colors.attribute});
          color: var(--theme-graph-attribute-dark, ${colors.attribute_dark});
          border: solid 1px var(--theme-graph-attribute-dark, ${colors.attribute_dark});
        }

        .type-img-R{
          background-color: var(--theme-graph-role, ${colors.role});
          color: var(--theme-graph-role-dark, ${colors.role_dark});
          border: solid 1px var(--theme-graph-role-dark, ${colors.role_dark});
        }

        .type-img-C{
          background-color: var(--theme-graph-concept, ${colors.concept});
          color: var(--theme-graph-concept-dark, ${colors.concept_dark});
          border: solid 1px var(--theme-graph-concept-dark, ${colors.concept_dark});
        }

        .type-img-I{
          background-color: var(--theme-graph-individual, ${colors.individual});
          color: var(--theme-graph-individual-dark, ${colors.individual_dark});
          border: solid 1px var(--theme-graph-individual-dark, ${colors.individual_dark});
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

  constructor(predicates, diagrams) {
    super()
    this.draggable = true
    this.collapsible = true
    this.diagrams = diagrams
    this.predicates = predicates

    this.onEntitySelect = {}
    this.onNodeNavigation = {}
  }

  render() {
    function getTypeImg(type) {
      let letter = type.charAt(0).toUpperCase()

      return html`
        <div class="type-img type-img-${letter}">${letter}<div>
      `
    }


    return html`
      <gscape-head title="Explorer" left_icon="explore" class="drag-handler">
        <input
          type="text"
          autocomplete="off"
          @keyup="${this.search}"
          placeholder="Search Entities"
        />
      </gscape-head>

      <div class="widget-body hide">
      ${Object.keys(this.predicates).map( key => {
        let predicate = this.predicates[key]
        return html`
          <div>
            <div
              id="${predicate.subrows[0].id}"
              class="row highlight"
              type="${predicate.type}"
              displayed_name = "${predicate.displayed_name}"
            >
              <span><mwc-icon @click='${this.toggleSubRows}'>keyboard_arrow_right</mwc-icon></span>
              <span>${getTypeImg(predicate.type)}</span>
              <div class="row-label" @click='${this.handleEntitySelection}'>${predicate.displayed_name}</div>
            </div>

            <div class="sub-rows-wrapper hide">
            ${predicate.subrows.map( predicate_instance => {
              return html`
                <div class="sub-row highlight"
                  diagram_id="${predicate_instance.diagram.id}"
                  node_id="${predicate_instance.id}"
                  @click="${this.handleNodeSelection}"
                >
                  - ${predicate_instance.diagram.name} - ${predicate_instance.id_xml}
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
    let row_wrapper = e.target.parentNode.parentNode.parentNode
    row_wrapper.querySelector('.sub-rows-wrapper').classList.toggle('hide')
    e.target.innerHTML = e.target.innerHTML == 'keyboard_arrow_right' ? 'keyboard_arrow_down' : 'keyboard_arrow_right'

    let row = row_wrapper.querySelector('.row')
    row.classList.toggle('add-shadow')
  }

  search(e) {
    if (e.keyCode == 27) {
      e.target.blur()
    }

    let value = e.target.value.toLowerCase()

    if (value === '')
      this.collapseBody()
    else
      this.showBody()

    var rows = this.shadowRoot.querySelectorAll('.row')

    rows.forEach( row => {
      value.split(' ').forEach(word => {
        let key = row.getAttribute('displayed_name') + row.getAttribute('type')
        let predicate = this.predicates[key]

        let found = false

        if (!predicate.labels) {
          // Graphol v2 has only one label for each entity
          if (predicate.label_v2.toLowerCase().indexOf(word) > -1 ||
              row.getAttribute('type').toLowerCase().indexOf(word) > -1) {
            row.style.display = ''
            found = true
          }
        } else {
          // Graphol v3 has multiple labels for multiples languages
          for ( let language in predicate.labels) {
            for ( let label of predicate.labels[language]) {
              if (label.toLowerCase().indexOf(word) > -1 || 
                row.getAttribute('type').toLowerCase().indexOf(word) > -1) {
                row.style.display = ''
                found = true
                break
              }
            }
  
            if (found) break
          }
        }
        
        if (!found) row.style.display = 'none'
      })
    })

    e.target.focus()
  }

  get predicates() {
    return this._predicates
  }

  set predicates(predicates) {
    function getSubRowsObject(predicate) {

      let diagram_name = this.diagrams.find(d => d.id == predicate.diagram_id).name
      return {
        id : predicate.id,
        id_xml : predicate.id_xml,
        diagram : {
          id : predicate.diagram_id,
          name : diagram_name,
        }
      }
    }

    let getSubRowsObjectBound = getSubRowsObject.bind(this)
    let dictionary = []

    predicates.forEach(predicate => {
      let displayed_name = predicate.displayed_name.replace(/\r?\n|\r/g, '')
      let key = displayed_name.concat(predicate.type)

      if (!(key in dictionary)) {
        dictionary[key] = {
          type : predicate.type,
          displayed_name : displayed_name,
          labels: predicate?.annotations?.label,
          label_v2: predicate.label, // for graphol v2, not having annotations for labels 
          subrows : []
        }
      }

      dictionary[key].subrows.push(getSubRowsObjectBound(predicate))
    })

    this._predicates = dictionary
  }

  handleEntitySelection(e) {
    let entity_id = e.target.parentNode.getAttribute('id')
    this.onEntitySelect(entity_id, true)
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
}

customElements.define('gscape-explorer', GscapeExplorer)