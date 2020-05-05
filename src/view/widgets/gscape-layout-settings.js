import { html, css } from 'lit-element'
import GscapeWidget from './common/gscape-widget'
import GscapeHeader from './common/gscape-header'
import GscapeToggle from './common/gscape-toggle'
import { Icon } from '@material/mwc-icon'

export default class GscapeLayoutSettings extends GscapeWidget {

  static get properties() {
    return {
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          left: 50%;
          bottom: 10px;
          transform: translate(-50%, 0);
        }

        gscape-head span {
          display: flex;
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }

        gscape-head {
          --header-padding: 5px 8px;
          --title-padding: 0 30px 0 0;
          --btn-padding: 0 0 0 10px;
        }

        gscape-toggle {
          margin-left: 50px;
        }

        .wrapper {
          display:flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
        }

        .title {
          padding: 0 5px 0 0;
          font-weight:bold;
        }

        .toggles-wrapper {
          display: flex;
        }
      `,
    ]
  }

  constructor() {
    super()
    this.collapsible = false

    this.onDragAndPinChange = {}
    this.onLayoutRunChange = {}
  }

  render() {
    return html`
      <!-- in case of body
      <div class="widget-body hide">
      </div>
      <gscape-head title="Layout Settings" collapsed="true" class="drag-handler">
        <span>
          ${new GscapeToggle('layout-run', true, false, 'Layout Running', this.onLayoutRunToggle)}
          ${new GscapeToggle('layout-pin', false, false, 'Drag and Pin', this.onDragAndPinToggle)}
        </span>
      </gscape-head>
      -->

      <div class="wrapper">
        <span class="title">Layout Settings</span>
        <span class="toggles-wrapper">
          ${new GscapeToggle('layout-run', true, false, 'Layout Running', this.onLayoutRunToggle)}
          ${new GscapeToggle('layout-pin', false, false, 'Drag and Pin', this.onDragAndPinToggle)}
        </span>
      </div>

    `
  }
}



customElements.define('gscape-layout-settings', GscapeLayoutSettings)