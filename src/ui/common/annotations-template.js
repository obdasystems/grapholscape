import {html} from 'lit'

export default (entity) => {
  return html`
    ${entity.annotations && Object.keys(entity.annotations).length > 0 ?
      html`
        <div class="section">
          <div class="section-header">Annotations</div>
          <table class="details_table annotations">
          ${Object.keys(entity.annotations).map( kind => {
            if (kind === 'comment') return html``
            let annotation = entity.annotations[kind]
            return html`
              <tbody class="annotation-row">
                ${Object.keys(annotation).map( (language, count)  => {
                  return html`
                    ${annotation[language].map( value => {
                      return html`
                        <tr>
                          ${count == 0 ? html`<th rowspan="3">${kind.charAt(0).toUpperCase() + kind.slice(1)}</th>` : ''}
                          <td class="language">${language}</td>
                          <td>${value}</td>
                        </tr>
                      `
                    })}
                  `
                })}
              </tbody>
            `
          })}
          </table>
        </div>
      ` : ''
    }
  `
}