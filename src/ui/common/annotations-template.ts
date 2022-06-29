import {css, html, SVGTemplateResult} from 'lit'
import { Annotation, GrapholTypesEnum } from '../../model'
import { entityIcons } from '../assets/icons'
import style from '../style'

// export default (entity) => {
//   return html`
//     ${entity.annotations && Object.keys(entity.annotations).length > 0 ?
//       html`
//         <div class="section">
//           <div class="section-header">Annotations</div>
//           <table class="details_table annotations">
//           ${Object.keys(entity.annotations).map( kind => {
//             if (kind === 'comment') return html``
//             let annotation = entity.annotations[kind]
//             return html`
//               <tbody class="annotation-row">
//                 ${Object.keys(annotation).map(language  => {
//                   const numberAnnotationOfThisLanguage = annotation[language].length
//                   return html`
//                     ${annotation[language].map((value, count) => {
//                       return html`
//                         <tr>
//                           ${count == 0 ? html`<th rowspan="${numberAnnotationOfThisLanguage}">${kind.charAt(0).toUpperCase() + kind.slice(1)}</th>` : ''}
//                           <td class="language">${language}</td>
//                           <td>${value}</td>
//                         </tr>
//                       `
//                     })}
//                   `
//                 })}
//               </tbody>
//             `
//           })}
//           </table>
//         </div>
//       ` : ''
//     }
//   `
// }

export type ViewItemWithIri = {
  name: string,
  typeOrVersion: string,
  iri: string
}

export function itemWithIriTemplate(item: ViewItemWithIri) {
  return html`
    <div class="item-with-iri-info ellipsed">
      <div class="name" title="${item.name}">${item.name}</div>
      <div class="muted-text" title="${item.iri}">${item.iri}</div>
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
        
        if (annotation.property === 'comment' || propertiesAlreadyInserted.includes(property)) return null
        
        propertiesAlreadyInserted.push(property)
        
        return html`
          <div class="annotation">
            <div class="bold-text annotation-property">
              ${property.charAt(0).toUpperCase() + property.slice(1)}
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
    margin-bottom: 4px;
  }

  .annotations .language {
    margin-right: 6px
  }

  .annotation-row {
    padding: 0 8px;
  }
`