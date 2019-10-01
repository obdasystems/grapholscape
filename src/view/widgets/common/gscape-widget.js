import { LitElement, html, css } from 'lit-element'
import * as theme from '../../style/themes'

export default class GscapeWidget extends LitElement {
  static get properties() {
    if( this.collapsible ) {
      return {}
    }

    return {}
  }
  
  static get styles() {
    let colors = theme.gscape

    return [[css`
      :host, .gscape-panel{
        display: block;
        position: absolute;
        color: var(--theme-gscape-on-primary, ${colors.on_primary});
        background-color:var(--theme-gscape-primary, ${colors.primary});
        box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
        border-radius: 8px;
        transition: opacity 0.2s;
        scrollbar-width: thin;
      }

      :host(:hover){
        box-shadow: 0 4px 8px 0 var(--theme-gscape-shadows, ${colors.shadows});
      }

      .hide {
        display:none;
      }

      .widget-body {
        width: 100%;
        margin-top:35px;
        max-height:450px;
        border-top:solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        overflow:auto;
        scrollbar-width: inherit;
      }

      .gscape-panel {
        position: absolute;
        bottom: 40px;
        width: auto;
        padding:10px;
        overflow: unset;
        border: none;
      }

      .gscape-panel::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 16px;
        margin-left: -8px;
        border-width: 8px;
        border-style: solid;
        border-color: #ddd transparent transparent transparent;
      }

      .gscape-panel-title{
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }

      .details_table{
        padding: 12px 6px 0 6px;
        border-spacing: 0;
      }

      .details_table th {
        color: var(--theme-gscape-secondary, ${colors.secondary});
        border-right: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        font-weight: bold;
        text-align:left;
      }
      
      .details_table th, td {
        padding:5px 8px;
        white-space: nowrap;
      }

      /* width */
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: #f0f0f0; 
      }
      
      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #cdcdcd; 
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #888; 
      }
      
    `], colors]
  }

  constructor(draggable, collapsible) {
    super();
    this.draggable = draggable
    this.collapsible = collapsible

    if (collapsible) 
      this.collapsed = true

    this.onselectstart = () => { false }
  }

  render () {
    return html``
  }

  toggleBody() {
    if (this.collapsible) {
      if (this.header) {
        let collapsed = this.header.collapsed
        this.header.collapsed = !collapsed
      }

      if (this.body)
        this.body.classList.toggle('hide')
    }
  }

  collapseBody() {
    if (this.collapsible) {
      if (this.header)
        this.header.collapsed = true
      
      if (this.body)
        this.body.classList.add('hide')
    }
  }

  showBody() {
    if(this.collapsible) {
      if (this.header)
        this.header.collapsed = false
      
      if (this.body)
        this.body.classList.remove('hide')
    }
  }

  firstUpdated() {
    this.header = this.shadowRoot.querySelector('gscape-head')
    this.body = this.shadowRoot.querySelector('.widget-body')

    if (this.collapsible) {
      this.addEventListener('toggle-widget-body', this.toggleBody)
    }

    if (this.draggable) 
      this.makeDraggable()
  }

  makeDraggable() {
    let pos1 = 0
    let pos2 = 0
    let pos3 = 0
    let pos4 = 0
    
    const elmnt = this
    let drag_handler = this.shadowRoot.querySelector('.drag-handler')

    if (drag_handler)
      drag_handler.onmousedown = dragMouseDown
    else
      console.log(`No .drag-handler elem for a ${this.constructor.name} draggable instance`)

    function dragMouseDown(e) {
      e = e || window.event
      // get the mouse cursor position at startup:
      pos3 = e.clientX
      pos4 = e.clientY
      document.onmouseup = closeDragElement
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag
    }
  
    function elementDrag(e) {
      e = e || window.event
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX
      pos2 = pos4 - e.clientY
      pos3 = e.clientX
      pos4 = e.clientY
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
      elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null
      document.onmousemove = null
    }
  }

  show() {
    this.style.display = 'initial'
  }

  hide() {
    this.style.display = 'none'
  }

  blur() {
    this.collapseBody()
  }
}

//customElements.define('gscape-widget', GscapeWidget)