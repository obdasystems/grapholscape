import { css, html, nothing } from 'lit'
import { Annotation, DefaultAnnotationProperties, TypesEnum } from '../../model'
import { annotationIcons, entityIcons } from '../assets/icons'

export type ViewItemWithIri = {
  name: string,
  typeOrVersion: string[],
  iri: string
}

export function itemWithIriTemplate(item: ViewItemWithIri, onWikiLinkClick?: (iri: string) => void, useExternalLink = false) {
  function wikiClickHandler() {
    if (onWikiLinkClick) 
      onWikiLinkClick(item.iri)
  }

  return html`
    <div class="item-with-iri-info ellipsed">
      ${useExternalLink
        ? html`<a 
            href="${item.iri}"
            title="${item.name}"
            target="_blank"
          >
            ${item.name}
          </a>`
        : html`
          <div 
            class="name ${onWikiLinkClick ? 'link' : null}" 
            title="${item.name}"
            @click=${onWikiLinkClick ? wikiClickHandler : null }
          >
            ${item.name}
          </div>
        `
      }
      
      <div class="rtl"><div class="muted-text" style="text-align: center" title="iri: ${item.iri}"><bdo dir="ltr">${item.iri}</bdo></div></div>
      <div class="muted-text type-or-version">
        ${Array.from(item.typeOrVersion).map(text => {
          if (Object.values(TypesEnum).includes(text as TypesEnum)) {
            return html`
              <div class="type-or-version">
                ${entityIcons[text]}
                ${text || '-'}
              </div>
            `
          } else {
            return text || '-'
          }
        })}
      </div>
    </div>
  `
}

export const itemWithIriTemplateStyle = css`
  .item-with-iri-info {
    text-align:center;
    background-color: var(--gscape-color-bg-inset);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .item-with-iri-info .type-or-version {
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

  const annotationsToSkip = [
    DefaultAnnotationProperties.latitude,
    DefaultAnnotationProperties.longitude,
  ]

  console.log(annotationsToSkip)
  return html`
    <div class="annotations">
      ${annotations.filter(ann => !annotationsToSkip.find(a => a.equals(ann.property))).map(annotation => {
        
        const property = annotation.property
        
        if (DefaultAnnotationProperties.comment.equals(annotation.property) || propertiesAlreadyInserted.includes(property)) return null
        
        propertiesAlreadyInserted.push(property)
        let displayName: string
        if (Object.values(DefaultAnnotationProperties).find(x => x.equals(annotation.propertyIri.fullIri))) {
          displayName = annotation.kind.charAt(0).toUpperCase() + annotation.kind.slice(1)
        } else {
          displayName = annotation.propertyIri.prefixed
        }
        return html`
          <div class="annotation">
            <div class="bold-text annotation-property">
              <span class="slotted-icon">${annotationIcons[annotation.kind] ?? nothing}</span>
              <span>${displayName}</span>
            </div>
            ${annotations.filter(a => a.property === property).map(annotation => {
              return html`
                <div class="annotation-row">
                  ${annotation.language ? html`<span class="language muted-text bold-text">@${annotation.language}</span>` : null}
                  <span title="${annotation.value}">${annotation.value}</span>
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

  .comment {
    margin: 8px 0;
    display: block;
  }
`