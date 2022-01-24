import { LitElement, html, css } from 'lit'
import * as theme from '../../style/themes'

export default class GscapeWidget extends LitElement {
  static get properties() {
    return {
      isEnabled: { type: Boolean },
      hiddenDefault: { type: Boolean }
    }
  }

  static get styles() {
    let colors = theme.gscape

    return [[css`
      :host, .gscape-panel{
        font-family : "Open Sans","Helvetica Neue",Helvetica,sans-serif;
        display: block;
        position: absolute;
        color: var(--theme-gscape-on-primary, ${colors.on_primary});
        background-color:var(--theme-gscape-primary, ${colors.primary});
        box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
        border-radius: 8px;
        transition: opacity 0.2s;
        scrollbar-width: thin;
        --mdc-icon-button-size: 24px;
      }

      :host(:hover){
        box-shadow: 0 4px 8px 0 var(--theme-gscape-shadows, ${colors.shadows});
      }

      .hide {
        display:none;
      }

      .widget-body {
        width: 100%;
        max-height:450px;
        border-top:solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        overflow:auto;
        scrollbar-width: inherit;
      }

      .gscape-panel {
        position: absolute;
        right:0;
        bottom:0;
        width: auto;
        padding:10px;
        overflow: unset;
        margin-right: calc(100% + 8px);
        border-right: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
      }

      .gscape-panel::after {
        content: "";
        position: absolute;
        left: 100%;
        border-width: 8px;
        border-style: solid;
        border-color: transparent transparent transparent #ddd;
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
      }

      .gscape-panel-title{
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }

      .widget-body .section:last-of-type {
        margin-bottom: 12px;
      }

      .widget-body .section-header {
        text-align: center;
        font-weight: bold;
        border-bottom: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        color: var(--theme-gscape-secondary, ${colors.secondary});
        width: 85%;
        margin: auto;
        margin-bottom: 10px;
        padding-bottom: 5px;
      }

      .description {
        margin-bottom: 20px;
      }

      .description:last-of-type {
        margin-bottom: 0;
      }

      .description .language {
        min-width: 50px;
        display: inline-block;
        font-weight: bold;
        color: var(--theme-gscape-secondary, ${colors.secondary});
        margin: 5px;
      }

      .section { padding: 10px; }

      .details_table{
        border-spacing: 0;
      }

      .details_table th {
        color: var(--theme-gscape-secondary, ${colors.secondary});
        border-right: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        font-weight: bold;
        text-align:left;
        min-width: 50px;
      }

      .details_table th, td {
        padding:5px 8px;
        white-space: nowrap;
      }

      .highlight:hover {
        color: var(--theme-gscape-on-secondary, ${colors.on_secondary});
        background-color:var(--theme-gscape-secondary, ${colors.secondary});
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

      .clickable {
        font-weight:bold;
        text-decoration: underline;
      }

      .clickable:hover {
        cursor:pointer;
        color: var(--theme-gscape-secondary-dark, ${colors.secondary_dark});
      }

      .icon {
        height:24px;
        width:24px;
      }

    `], colors]
  }

  constructor() {
    super();
    this.draggable = false
    this.collapsible = false
    this.isEnabled = true
    this._hiddenDefault = false

    this.onselectstart = () => { false }
    this.onToggleBody = () => { }
  }

  render() {
    return html``
  }

  toggleBody() {
    if (this.collapsible) {
      if (this.header) {
        this.header.toggleIcon()
      }

      if (this.body)
        this.body.classList.toggle('hide')

      this.onToggleBody()
    }
  }

  collapseBody() {
    if (this.collapsible) {
      if (this.header && !this.isCollapsed)
        this.header.toggleIcon()

      if (this.body)
        this.body.classList.add('hide')
    }
  }

  showBody() {
    if (this.collapsible) {
      if (this.header && this.isCollapsed)
        this.header.toggleIcon()

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

    if (this.draggable) {
      let dragHandler = this.shadowRoot.querySelector('.drag-handler')
      if (dragHandler) this.makeDraggable(dragHandler)
    }
  }

  makeDraggableHeadTitle() {
    if (this.draggable) {
      setTimeout( () => {
        const headTitleDiv = this.header.shadowRoot.querySelector('.head-title')
        headTitleDiv.classList.add('drag_handler')
        this.makeDraggable(headTitleDiv)
      })     
    }
  }

  makeDraggable(drag_handler) {
    let pos1 = 0
    let pos2 = 0
    let pos3 = 0
    let pos4 = 0

    const elmnt = this

    if (drag_handler)
      drag_handler.onmousedown = dragMouseDown
    else
      console.warn(`No .drag-handler elem for a ${this.constructor.name} draggable instance`)

    function dragMouseDown(e) {
      e = e || window.event
      e.preventDefault()
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
    if (this.isEnabled) this.style.display = 'initial'
  }

  hide() {
    this.style.display = 'none'
  }

  enable() {
    this.isEnabled = true
    if (!this.hiddenDefault) this.show()
  }

  disable() {
    this.isEnabled = false
    this.hide()
  }

  blur() {
    this.collapseBody()
  }

  isCustomIcon(icon) {
    return typeof (icon) !== 'string'
  }

  get isVisible() {
    return this.style.display !== 'none'
  }

  set hiddenDefault(value) {
    this._hiddenDefault = value
    value ? this.hide() : this.show()
    this.requestUpdate()
  }

  get hiddenDefault() {
    return this._hiddenDefault
  }

  get isCollapsed() {
    if (this.body)
      return this.body.classList.contains('hide')
    else
      return true
  }
}

//customElements.define('gscape-widget', GscapeWidget)