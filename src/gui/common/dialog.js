import { html , css } from 'lit'
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
      `
    ]
  }

  constructor() {
    super()
    this.draggable = true
    this.text = []
    this.type = 'error'
  }

  render() {
    return html`
    <gscape-head
      title="${this.type}"
      icon="close"
      class="${this.type.toLowerCase()} drag-handler">
    </gscape-head>
    <div class="widget-body ${this.type.toLowerCase()}">
      ${this.text.map( text => html`<p>${text}</p>`)}
    </div>
    `
  }

  // override
  show(type, message) {
    super.show()

    this.type = type
    if (typeof(message) == 'string')
      this.text = [message]
    else
      this.text = message
  }

  clickHandler() {
    this.hide()
    this._onClick()
  }

  firstUpdated() {
    super.firstUpdated()

    this.hide()
    this.header.onClick = this.hide.bind(this)
  }
}

customElements.define('gscape-dialog', GscapeDialog)