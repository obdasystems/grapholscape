import { LitElement, html, css } from 'lit-element'
import GscapeHeader from './gscape-header'
import { theme } from './themes'

export default class GscapeWidget extends LitElement {
  static get properties() {
    if( this.collapsible ) {
      return {
        collapsed: Boolean,
      }
    }

    return {}
  }
  
  static get styles() {
    return [css`
      :host{
        display: block;
        position: absolute;
        color: var(--theme-gscape-secondary, ${theme.secondary});
        background-color:var(--theme-gscape-primary, ${theme.primary});
        box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows, ${theme.shadows});
        border-radius: 8px;
        transition: opacity 0.2s;
      }

      :host(:hover){
        box-shadow: 0 4px 8px 0 var(--theme-gscape-shadows, ${theme.shadows});
      }

      .hide {
        display:none;
      }

      .widget-body {
        width: 100%;
        margin-top:35px;
        max-height:450px;
        border-top:solid 1px var(--theme-gscape-shadows, ${theme.shadows});
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
      }
    `]
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
      const collapsed = this.shadowRoot.querySelector('gscape-head').collapsed
      this.shadowRoot.querySelector('gscape-head').collapsed = !collapsed
      this.shadowRoot.querySelector('.widget-body').classList.toggle('hide')
    }
  }

  firstUpdated() {
    if (this.collapsible) 
      this.addEventListener('toggle-widget-body', this.toggleBody)

    
    if (this.draggable) 
      this.makeDraggable()
  }


  makeDraggable() {
    let pos1 = 0
    let pos2 = 0
    let pos3 = 0
    let pos4 = 0
    
    const elmnt = this
    this.shadowRoot.querySelector('gscape-head').onmousedown = dragMouseDown

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
  
}

//customElements.define('gscape-widget', GscapeWidget)