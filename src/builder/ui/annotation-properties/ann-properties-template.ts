import { css, html } from "lit"
import { icons } from "../../../ui";
import AnnotationProperty from "../../../model/annotation-property";

export function propertiesTemplate(annProperties: AnnotationProperty[], handleEditProperty: (annProperty?: AnnotationProperty) => void, handleDeleteProperty: (annProperty: AnnotationProperty)=> void) {
  return html`
    <div class="annotations-list">
      ${annProperties.map((a, i) => {
        return html`
          <div class="annotation-row" id=ann${i}>
            <div class="annotation-value">
              <span> ${a.fullIri} </span>
            </div>
            <div style="flex-shrink: 0;">
                <gscape-button type="subtle" size='s' id ="editAnnotation" @click=${() => handleEditProperty(a)}><span slot="icon">${icons.editIcon}</span></gscape-button>
                <gscape-button type="subtle" size='s' id ="deleteAnnotation" @click=${() => handleDeleteProperty(a)}><span slot="icon">${icons.rubbishBin}</span></gscape-button>
            </div>
          </div>
        `
      })}

      ${annProperties.length === 0
        ? html`
          <div class="blank-slate">
            ${icons.blankSlateDiagrams}
            <div class="header">No annotation properties defined</div>
            <div class="description">Add new annotation properties by clicking the Add button.</div>
          </div>
        `
        : null
      }
    </div>
  `
}


