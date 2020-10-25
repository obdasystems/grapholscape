import {html} from 'lit-element'

export default (occurrences, onNodeNavigation) => {
  return html`${occurrences && occurrences.length > 0 ?
    html`
      <table class="details_table">
        <tbody>
        ${occurrences.map( occurrence => {
          return html`
            <tr>
              <th>${occurrence.diagram_name}</th>
              <td node_id="${occurrence.id}" class="clickable" @click="${onNodeNavigation}">${occurrence.id_xml}</td>
            </tr>
          `
        })}
        </tbody>
      </table>
    ` :
    ''
  }`
}