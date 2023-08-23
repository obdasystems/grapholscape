import { css, html } from "lit"
import { Namespace } from "../../../model"
import { icons } from "../../../ui";


export function namespacesTemplate(namespaces: Namespace[],  handleEditNamespace: (namespace?: Namespace, prefix?: string) => void, handleDeleteNamespace: (namespace: Namespace, prefix: string)=> void) {
    let numRows: number
    return html`
      <div>
      ${namespaces.length === 0
        ? html`
          <div class="blank-slate">
            ${icons.blankSlateDiagrams}
            <div class="header">No namespaces defined</div>
            <div class="description">Add new namespaces by clicking the Add button.</div>
          </div>
        `
        : null
      }
      <table>
        ${namespaces.map(namespace => {
        numRows = namespace.prefixes.length
        return html`
              ${namespace.prefixes.map((prefix, i) => {
            return html`
                  <tr>
                    <th>${prefix}</th>
                    ${i === 0 
                    ? html`<td rowspan="${numRows}">${namespace.toString()}</td>`
                    : null
                }
                    <td style="flex-shrink: 0;">
                        <gscape-button style = "border-radius: 50%;" size='s' id ="editAnnotation" @click=${() => handleEditNamespace(namespace, prefix)}><span slot="icon">${icons.editIcon}</span></gscape-button>
                        <gscape-button style = "border-radius: 50%;" size='s' id ="deleteAnnotation" @click=${() => handleDeleteNamespace(namespace, prefix)}><span slot="icon">${icons.rubbishBin}</span></gscape-button>
                    </td>
                  </tr>
                `
        })}
          `
    })}
      </table>
      </div>
      `
}


export const namespacesTemplateStyle = css`
  table {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  th, td {
    padding: 2px;
  }

  td {
    padding-left: 8px;
  }

  th {
    text-align: left;
    border-right: solid 1px var(--gscape-color-border-subtle);
    padding-right: 8px;
  }

  tr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--gscape-border-radius);
    border: solid 1px var(--gscape-color-border-subtle);
    padding: 8px;
    background: var(--gscape-color-bg-inset);
  }

  table > caption {
    margin-top: 8px;
    font-weight: 600;
  }
`