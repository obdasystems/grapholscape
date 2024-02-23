import cytoscape from "cytoscape";
import { CSSResultGroup, LitElement, PropertyDeclarations, css, html } from "lit";
import { EntityViewData } from "../view-model";
import baseStyle from "../style";
import menuBaseStyle from "../../incremental/ui/menu-base-style";

export default class GscapeInstanceExplorer extends LitElement {
  refClass: EntityViewData
  refNode: cytoscape.NodeSingular

  dataProperties: EntityViewData[]
  objectProperties: EntityViewData[]
  subclasses: EntityViewData[]
  superclasses: EntityViewData[]
  
  static properties: PropertyDeclarations = {
    refClass: { type: Object, attribute: 'refclass' },
    refNode: { type: Object, attribute: 'refnode' },
    dataProperties: { type: Object, attribute: 'dataproperties' },
    objectProperties: { type: Object, attribute: 'objectproperties' },
    subclasses: { type: Object, attribute: 'refclass' },
    superclasses: { type: Object },
  }
  
  static styles?: CSSResultGroup = [
    baseStyle,
    menuBaseStyle,
    css``,
  ]

  render() {
    return html`
      <div class="gscape-panel">
        <div class="header">
          
        </div>
      </div>
    `
  }

}