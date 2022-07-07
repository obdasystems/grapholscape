import { css, html, LitElement } from 'lit'
import { minus, owl_icon, plus } from '../assets/icons'
import { BaseMixin } from '../common/base-widget-mixin'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle from '../style'

export default class GscapeOwlVisualizer extends BaseMixin(DropPanelMixin(LitElement)) {
  title = "OWL 2 Translation"
  owlText: string = ''

  static properties = {
    owlText: { type: String, attribute: false }
  }

  static styles = [
    baseStyle,
    css`
      :host {
        bottom: 10px;
        position: absolute;
        max-width: calc(90% - 64px);
        left: 50%;
        transform: translate(-50%);
      }

      .gscape-panel {
        max-width: unset;
        width: 100%;
        box-sizing: border-box;
      }

      .owl-text {
        padding: 15px 10px;
        font-family: "Lucida Console", Monaco, monospace;
        overflow: auto;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .owl_class{
        color: #b58900;
      }

      .owl_object-property{
        color: #268bd2;
      }

      .owl_data-property{
        color: #859900;
      }

      .owl_value-domain{
        color: #2aa198;
      }

      .owl_individual{
        color: #6c71c4;
      }

      .owl_value {
        color: #d33682;
      }

      .axiom_predicate_prefix{
        color:#cb4b16;
      }

      .owl_error {
        color: var(--theme-gscape-error);
      }

      .axiom_predefinite_obj {
        color: #00c0a0;
      }
      
      .top-bar {
        display: flex;
        flex-direction: row-reverse;
        line-height: 1;
      }

      .translated-down {
        position: absolute;
        right: 0;
      }

    `,
  ]

  render() {
    if (!this.owlText) return
    return html`
      <div class="top-bar ${this.isPanelClosed() ? null : 'translated-down' }">
        <gscape-button 
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? this.title : ''}"
        > 
          ${this.isPanelClosed()
            ? html`
                <span slot="icon">${owl_icon}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : html`<span slot="icon">${minus}</span>`
          }
        </gscape-button>
      </div>

      <div class="gscape-panel" id="drop-panel">
        <div class="owl-text"></div>
      </div>
    `
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  togglePanel = () => {
    super.togglePanel()
    this.requestUpdate()
  }

  updated() {
    const owlTextDiv = this.shadowRoot?.querySelector('.owl-text')

    if (owlTextDiv)
      owlTextDiv.innerHTML = this.owlText
  }

}

customElements.define('gscape-owl-visualizer', GscapeOwlVisualizer)