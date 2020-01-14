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
          min-width:340px;
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

        .row:hover, .sub-row:hover {
          background-color: var(--theme-gscape-secondary, ${colors.secondary});
          color: var(--theme-gscape-on-secondary, ${colors.on_secondary});
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
          position:absolute;
          left: 30%;
          width: 50%;
          line-height:21px;
          box-sizing: border-box;
          background-color: var(--theme-gscape-primary, ${colors.primary});
          padding: 2px 5px;
          border:none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          float: left;
          margin: 8px 0px;
          transition: all .35s ease-in-out;
          color:inherit;
        }

        gscape-head input:focus {
          border-color: var(--theme-gscape-secondary, ${colors.secondary});
          left:0;
          margin: 8px 10px;
          width:80%;
        }
      `
    ]
  }

  constructor(predicates, diagrams) {
    super(true, true)
    this.diagrams = diagrams
    this.predicates = predicates

    this._onEntitySelect = null
    this._onNodeSelect = null
  }

  render() {
    function getTypeImg(type) {
      let letter = type.charAt(0).toUpperCase()

      return html`
        <div class="type-img type-img-${letter}">${letter}<div>
      `
    }


    return html`
      <gscape-head title="Explorer" collapsed="true" class="drag-handler">
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
              class="row" 
              type="${predicate.type}"
              label = "${predicate.label}"
            >
              <span><mwc-icon @click='${this.toggleSubRows}'>keyboard_arrow_right</mwc-icon></span>
              <span>${getTypeImg(predicate.type)}</span>
              <div class="row-label" @click='${this.handleEntitySelection}'>${predicate.label}</div>
            </div>

            <div class="sub-rows-wrapper hide">
            ${predicate.subrows.map( predicate_instance => {
              return html`
                <div class="sub-row" 
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
        if (row.getAttribute('label').toLowerCase().indexOf(word) > -1 ||
            row.getAttribute('type').toLowerCase().indexOf(word) > -1 ) {
          row.style.display = ''
        } else {
          row.style.display = 'none'
        }
      })
    })

    e.target.focus()
  }

  set onEntitySelect(f) {
    this._onEntitySelect = f
  }

  set onNodeNavigation(f) {
    this._onNodeSelect = f
  }

  get predicates() {
    return this._predicates
  }

  set predicates(predicates) {
    function getSubRowsObject(predicate) {
      return {
        id : predicate.id,
        id_xml : predicate.id_xml,
        diagram : {
          id : predicate.diagram_id,
          name : this.diagrams[predicate.diagram_id].name,
        }
      }
    }

    let getSubRowsObjectBound = getSubRowsObject.bind(this)
    let dictionary = []

    predicates.forEach(predicate => {
      let label = predicate.label.replace(/\r?\n|\r/g, '')
      let key = label.concat(predicate.type)    
      
      if (!(key in dictionary)) {
        dictionary[key] = {
          type : predicate.type,
          label : label,
          subrows : []          
        }
      }

      dictionary[key].subrows.push(getSubRowsObjectBound(predicate))
    })

    this._predicates = dictionary
  }

  handleEntitySelection(e) {
    let entity_id = e.target.parentNode.getAttribute('id')

    //let selector = `[label = '${label}'][type = '${type}']`
    // get the first instance of the selected entity
    //let predicate_instance = this.predicates.filter(selector)[0]

    this._onEntitySelect(entity_id, true)
  }

  handleNodeSelection(e) {
    this.toggleBody()

    let node_id = e.target.getAttribute('node_id')

    this._onNodeSelect(node_id)
  }

  blur() {
    super.blur()
    this.shadowRoot.querySelector('input').blur()
  }
}

customElements.define('gscape-explorer', GscapeExplorer)