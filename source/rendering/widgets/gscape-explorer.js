import { LitElement, html, css } from 'lit-element'
import GscapeWidget from './gscape-widget'
import GscapeHeader from './gscape-header'
import { theme } from './themes'

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
    return [
      super.styles,
      css`
        :host {
          left:50%;
          top:10px;
          width:320px;
          transform: translate(-50%, 0);
        }

        .widget-body {
          overflow:auto;
        }

        .row{
          line-height: 0;
          display: flex;
          align-items: center;
          padding:2px 0;
        }

        .row:hover{
          background-color: var(--theme-gscape-accent, ${theme.accent});
          color: var(--theme-gscape-primary, ${theme.primary});
        }

        .row-label{
          padding-left:5px;
          cursor:pointer;
          width:100%;
        }

        mwc-icon:hover{
          color: var(--theme-gscape-primary, ${theme.primary});
          cursor:pointer;
        }

        .type-img{
          display: block;
          width: 18px;
          height: 18px;
          text-align: center;
          line-height: 18px;
        }

        .type-img-A{
          background-color: #C7DAAD;
          color: #4B7900;
          border: solid 1px #4B7900;
        }

        .type-img-R{
          background-color: #AACDE1;
          color: #065A85;
          border: solid 1px #065A85; 
        }
        
        .type-img-C{
          background-color: #F9F3A6;
          color: #B08D00;
          border: solid 1px #B08D00; 
        }
      `
    ]
  }

  constructor(predicates, diagrams) {
    super(true, true)
    this.predicates = predicates
    this.diagrams = diagrams
  }

  render() {
    function addSubRow(key) {
      console.log(this.shadowRoot.querySelector('#'+key))
    }

    function getTypeImg(type) {
      let letter = type.charAt(0).toUpperCase()

      return html`
        <div class="type-img type-img-${letter}">${letter}<div>
      `
    }

    let addedPredicates = []

    return html`
      <gscape-head></gscape-head>

      <div class="widget-body hide">
      ${this.predicates.map( predicate => {
        
        let label = predicate.data('label').replace(/\r?\n|\r/g, '')
        let key = label.concat(predicate.data('type'))

        if (addedPredicates.includes(predicate)) {
          console.log(key)
        }
        else {
          addedPredicates.push(predicate)
          let diagram = this.diagrams[predicate.data('diagram_id')]
                    
          return html`
            <div>
              <div id="${key}" class="row">
                <span><mwc-icon>keyboard_arrow_right</mwc-icon></span>
                <span>${getTypeImg(predicate.data('type'))}</span>
                <div class="row-label">${label}</div>
              </div>
              <!--
              <div class="sub-rows-wrapper">
                <div class="sub-row">- ${diagram.name} - ${predicate.data('id_xml')}</div>
              </div>
              -->
            </div>
          `
        }
      })}
      </div>
    `
  }
  
  firstUpdated() {
    super.firstUpdated()
    this.shadowRoot.querySelector('gscape-head').title = 'Explorer'
  }
}

customElements.define('gscape-explorer', GscapeExplorer)