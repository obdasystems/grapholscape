import { html } from "lit"
import { commentIcon } from "../assets"
import { AnnotatedElement } from "../../model"

export default function (annotatedElem: AnnotatedElement, selectedLanguage: string | undefined, languageSelectionHandler: (e: Event) => void) {
  const commentsLanguages = Array.from(new Set(
    annotatedElem.getComments().map(comment => comment.language)
  ))

  selectedLanguage = commentsLanguages.includes(selectedLanguage) ? selectedLanguage : commentsLanguages[0]

  return html`
    <div class="section">
      <div id="description-header" class="section-header">
        <span class="slotted-icon">${commentIcon}</span>
        <span class="bold-text">
          Description
        </span>
        <select id="language-select" class="btn btn-s" @change=${languageSelectionHandler}>
          ${commentsLanguages.map(language => {
            return html`
              <option value="${language}" ?selected=${selectedLanguage === language}>
                @${language}
              </option>
            `
          })}
        </select>
      </div>
      <div class="section-body">
        ${annotatedElem.getComments(selectedLanguage).map(comment =>
          html`<span class="comment">${comment.lexicalForm}</span>`
        )}
      </div>
    </div>
  `
}