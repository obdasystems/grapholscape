import { css, html, nothing } from 'lit'
import { Annotation, AnnotationsKind, GrapholTypesEnum } from '../../model'
import { annotationIcons, authorIcon, commentIcon, entityIcons, labelIcon } from '../assets/icons'

export type ViewItemWithIri = {
  name: string,
  typeOrVersion: string,
  iri: string
}

export function itemWithIriTemplate(item: ViewItemWithIri, onWikiLinkClick?: (iri: string) => void) {
  function wikiClickHandler() {
    if (onWikiLinkClick) 
      onWikiLinkClick(item.iri)
  }

  return html`
    <div class="item-with-iri-info ellipsed">
      <div 
        class="name ${onWikiLinkClick ? 'link' : null}" 
        title="${item.name}"
        @click=${onWikiLinkClick ? wikiClickHandler : null }
      >
        ${item.name}
      </div>
      <div class="muted-text" title="iri: ${item.iri}">${item.iri}</div>
      <div class="muted-text type-or-version">
        ${Object.values(GrapholTypesEnum).includes(item.typeOrVersion as GrapholTypesEnum)
          ? entityIcons[item.typeOrVersion] : null }
        ${item.typeOrVersion || '-'}
      </div>
    </div>
  `
}

export const itemWithIriTemplateStyle = css`
  .item-with-iri-info {
    text-align:center;
    background-color: var(--gscape-color-bg-inset);
    white-space: nowrap;
  }

  .item-with-iri-info > .type-or-version {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .item-with-iri-info .name {
    font-size: 14px;
    font-weight: 600;
  }
`

export function annotationsTemplate(annotations: Annotation[]) {
  if (!annotations || annotations.length === 0) return null
  let propertiesAlreadyInserted: string[] = []
  return html`
    <div class="annotations">
      ${annotations.map(annotation => {
        
        const property = annotation.property
        
        if (property === 'comment' || propertiesAlreadyInserted.includes(property)) return null
        
        propertiesAlreadyInserted.push(property)
        
        return html`
          <div class="annotation">
            <div class="bold-text annotation-property">
              <span class="slotted-icon">${annotationIcons[property] ?? nothing}</span>
              <span>${property.charAt(0).toUpperCase() + property.slice(1)}</span>
            </div>
            ${annotations.filter(a => a.property === property).map(annotation => {
              return html`
                <div class="annotation-row">
                  <span class="language muted-text bold-text">@${annotation.language}</span>
                  <span title="${annotation.lexicalForm}">${annotation.lexicalForm}</span>
                </div>
              `
            })}
          </div>
        `            
      })}
    </div>
  `
}

export const annotationsStyle = css`
  .annotations {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .annotation-property {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .annotations .language {
    margin-right: 6px
  }

  .annotation-row {
    padding: 4px 8px;
  }
`