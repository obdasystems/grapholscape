import { LitElement, PropertyDeclarations, CSSResultGroup, css, html } from "lit"
import incrementalStyle from "../../../core/rendering/incremental/incremental-style"
import { BaseMixin, IClassInstancesExplorer, EntityViewData, baseStyle } from "../../../ui"


export default class GscapeInstanceExplorer extends BaseMixin(LitElement) implements IClassInstancesExplorer {

  onInstanceSelection: (iri: string) => void
  onEntitySearch: (searchText: string) => void
  onEntitySearchByDataPropertyValue: (dataPropertyIri: string, searchText: string) => void
  areInstancesLoading: boolean
  instances: EntityViewData[] = []


  static properties: PropertyDeclarations = {
    areInstancesLoading: { type: Boolean },
    instances: { type: Object }
  }

  static styles: CSSResultGroup = [
    baseStyle,
    css`
      :host {
        position: absolute;
        display: block;
        max-width: 50%;
        max-height: 60%;
      }

      .gscape-panel {
        min-width: unset;
        max-width: unset;
        min-height: unset;
        max-height: unset;
        width: unset;
        height: 100%;
      }
    `
  ]

  render() {
    return html`
      <div class="gscape-panel">ok</div>
    `
  }
}

customElements.define('gscape-instances-explorer', GscapeInstanceExplorer)