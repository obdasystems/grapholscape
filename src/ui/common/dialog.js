import { html , css } from 'lit'
import { close } from '../assets/icons'
import GscapeHeader from './gscape-header'
import GscapeWidget from './gscape-widget'

export default class GscapeDialog extends GscapeWidget {

  static get properties() {
    return {
      text: { type : Array },
      type: { type : String },
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          top: 30%;
          left: 50%;
          max-width: 500px;
          transform: translate(-50%, 0);
        }

        .widget-body {
          padding : 10px;
          width: initial;
        }

        .widget-body.error {
          background : var(--theme-gscape-error, ${colors.error});
          color : var(--theme-gscape-on-error, ${colors.on_error});
        }

        gscape-head {
          --title-text-align : center;
          --title-width : 100%;
        }

        gscape-head.error {
          color : var(--theme-gscape-error, ${colors.error});
        }

        gscape-head.warning {
          color : var(--theme-gscape-warning, ${colors.warning});
        }

        p {
          white-space: pre;
        }
      `
    ]
  }

  constructor() {
    super()
    this.draggable = true
    this.collapsible = false
    this.text = []
    this.title = 'Message'
  }

  render() {
    return html`
    <gscape-head
      title="${this.title}"
      class="${this.title.toLowerCase()} drag-handler">
    </gscape-head>
    <div class="widget-body ${this.title.toLowerCase()}">
      <slot></slot>
      ${this.text.map( text => html`<p>${text}</p>`)}
    </div>
    `
  }

  /**
   * @param {{ type: string; text: string; }} newMessageObj
   */
  set message(newMessageObj) {
    this.title = newMessageObj.type,
    this.text = newMessageObj.text

    typeof(newMessageObj.text) === 'string' ? this.text = [newMessageObj.text] : this.text = newMessageObj.text
  }

  clickHandler() {
    this.hide()
    this._onClick()
  }

  firstUpdated() {
    super.firstUpdated()

    this.hide()
    this.header.icon = close
    this.header.onClick = this.hide.bind(this)
  }
}

customElements.define('gscape-dialog', GscapeDialog)