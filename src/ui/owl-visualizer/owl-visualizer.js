import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import { owl_icon } from '../assets/icons'

export default class GscapeOwlVisualizer extends GscapeWidget {
  static get properties() {
    return {
      owl_text: String,
    }
  }
  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super.styles[0],
      css`
        :host {
          left:50%;
          bottom:10px;
          transform: translate(-50%, 0);
          max-width:60%;
        }

        gscape-head {
          --title-text-align: center;
          --title-width: 100%;
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }

        .owl-text {
          padding: 15px 10px;
          font-family: "Lucida Console", Monaco, monospace;
          overflow: auto;
          white-space: nowrap;
          line-height: 1.5;
        }

        .owl_concept{
          color: #b58900;
        }

        .owl_role{
          color: #268bd2;
        }

        .owl_attribute{
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
          color: var(--theme-gscape-error, ${colors.error});
        }

        .axiom_predefinite_obj {
          color: #00c0a0;
        }

      `,
    ]
  }

  constructor() {
    super()
    this.collapsible = true
    this.hiddenDefault = true
    this.owl_text = ''
    this.header = new GscapeHeader()
    this.header.title = 'Owl Translation'
    this.header.left_icon = owl_icon
  }

  render() {
    return html`
      <div class="widget-body">
        <div class="owl-text"></div>
      </div>
      ${this.header}
    `
  }

  updated() {
    this.shadowRoot.querySelector('.owl-text').innerHTML = this.owl_text
  }

  // override
  blur() {
    this.hide()
  }

}

customElements.define('gscape-owl-visualizer', GscapeOwlVisualizer)