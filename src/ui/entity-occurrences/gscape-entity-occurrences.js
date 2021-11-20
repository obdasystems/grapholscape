import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import entityOccurrencesTemplate from './entityOccurrencesTemplate'

export default class GscapeEntityOccurrences extends GscapeWidget {

  static get properties() {
    return {
      occurrences: { type: Array }
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          top:50%;
          transform: translate(0, -50%);
          left:10px;
        }

        .widget-body {
          max-height: 250px;
        }

        gscape-head {
          --title-text-align: center;
          --title-width: 100%;
        }

        .details_table {
          margin:5px 0;
        }
      `
    ]
  }

  constructor() {
    super()
    this.draggable = true
    this.collapsible = true

    this.occurrences = []
    this.hiddenDefault = true
    this.onNodeNavigation = {}
  }

  render() {
    return html`
      <gscape-head title="Entity Occurrences" left_icon="visibility" class="drag-handler"></gscape-head>
      <div class="widget-body">
        ${entityOccurrencesTemplate(this.occurrences, this.handleNodeSelection)}
      </div>
    `
  }

  handleNodeSelection(e) {
    let node_id = e.target.getAttribute('node_id')
    this.onNodeNavigation(node_id)
  }

  firstUpdated() {
    super.firstUpdated()
    this.header.invertIcons()
  }

  //override
  blur() {
    this.hide()
  }
}

customElements.define('gscape-entity-occurrences', GscapeEntityOccurrences)