import { css, html } from "lit"
import { Namespace } from "../../../model"
import { icons } from "../../../ui";

export function ontologyNamespacesTemplate(namespaces: Namespace[]) {
    let numRows: number
    return html`
      <div class="header" style="margin: 8px 8px 8px 8px; display:flex; justify-content:space-between; align-items: center;">
        <span class="slotted-icon">Ontology namespaces</span>
        <gscape-button style = "border-radius: 50%;" size='s' id ="more" label="+" @click=${() => {}}></gscape-button>
      </div>
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
                    <td style="text-align: right">
                        <gscape-button style = "border-radius: 50%;" size='s' id ="editAnnotation" @click=${() => {}}><span slot="icon">${icons.editIcon}</span></gscape-button>
                        <gscape-button style = "border-radius: 50%;" size='s' id ="deleteAnnotation" @click=${() => {}}><span slot="icon">${icons.rubbishBin}</span></gscape-button>
                    </td>
                  </tr>
                `
              })}
          `
        })}
      </table>
      `
  }
  

export const namespacesTemplateStyle = css`
  table {
    border-spacing: 0;
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

  table > caption {
    margin-top: 8px;
    font-weight: 600;
  }
`