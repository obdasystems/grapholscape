import { css, html } from "lit"
import { Annotation } from "../../../model"
import { icons } from "../../../ui";

export function annotationsTemplate(annotations: Annotation[], handleEditAnnotation: (annotation?: Annotation) => void, handleDeleteAnnotation: (annotation: Annotation)=> void) {
  return html`
    <div class="annotations-list">
      ${annotations.map((a, i) => {
        return html`
          <div class="annotation-row" id=ann${i}>
            <div class="annotation-value">
              <b>${a.kind.charAt(0).toUpperCase() + a.kind.slice(1)}</b>
              <span class="language muted-text bold-text"> @${a.language} </span>
              <span> ${a.lexicalForm} </span>
            </div>
            <div class="annotation-buttons">
              <gscape-button
                type="subtle"
                size='s'
                id ="editAnnotation"
                @click=${() => handleEditAnnotation(a)}
              >
                <span slot="icon">${icons.editIcon}</span>
              </gscape-button>

              <gscape-button
                type="subtle"
                size='s'
                id ="deleteAnnotation"
                @click=${() => handleDeleteAnnotation(a)}
              >
                <span slot="icon">${icons.rubbishBin}</span>
              </gscape-button>
            </div>
          </div>
        `
      })}

      ${annotations.length === 0
        ? html`
          <div class="blank-slate">
            ${icons.blankSlateDiagrams}
            <div class="header">No annotations defined</div>
            <div class="description">Add new annotations by clicking the Add button.</div>
          </div>
        `
        : null
      }
    </div>
  `
}

export const annotationsTemplateStyle = css`
  .annotations-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .annotation-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--gscape-border-radius);
    border: solid 1px var(--gscape-color-border-subtle);
    padding: 4px 8px;
    background: var(--gscape-color-bg-inset);
  }

  .annotation-buttons {
    flex-shrink: 0;
  }
`
