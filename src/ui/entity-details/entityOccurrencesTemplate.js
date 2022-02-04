import {html} from 'lit'

export default (occurrences, onNodeNavigation) => {
  return html`${occurrences && occurrences.length > 0 ?
    html`
      <div class="section">
        <div class="section-header">Occurrences</div>
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
        </div>
      </div>
    ` :
    ''
  }`
}