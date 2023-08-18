import { css, html } from "lit"
import { Annotation } from "../../../model"
import { icons } from "../../../ui";

export function ontologyAnnotationsTemplate(annotations: Annotation[], handleEditAnnotation: (annotation?)=> void, handleDeleteAnnotation: (annotation)=> void) {

    return html`
      <div class="header" style="margin: 8px 8px 8px 8px; display:flex; justify-content:space-between; align-items: center;">
        <span class="slotted-icon">Ontology annotations</span>
        <gscape-button style = "border-radius: 50%;" size='s' id ="more" label="+" @click=${() => handleEditAnnotation()}></gscape-button>
      </div>
      <div class=area style="min-height: 200px;">
            ${annotations.map((a, i) => {
            return html`<div style="margin: 8px 8px 8px 8px; display:flex; justify-content:space-between;" id=ann${i}>
                      <div class=annotation-row style="margin: 8px 8px 8px 8px;">
                          <b>${a.kind.charAt(0).toUpperCase() + a.kind.slice(1)}</b> 
                          <span class="language muted-text bold-text"> @${a.language} </span>
                          <span> ${a.lexicalForm} </span>
                      </div>    
                      <div>
                          <gscape-button style = "border-radius: 50%;" size='s' id ="editAnnotation" @click=${() => handleEditAnnotation(a)}><span slot="icon">${icons.editIcon}</span></gscape-button>
                          <gscape-button style = "border-radius: 50%;" size='s' id ="deleteAnnotation" @click=${() => handleDeleteAnnotation(a)}><span slot="icon">${icons.rubbishBin}</span></gscape-button>
                      </div>
                  </div>`
              })}
        </div>
      </div>
      `
  }
  