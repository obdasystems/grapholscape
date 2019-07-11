import GscapeButton from './common/gscape-button';
import * as themes from './themes'

export default class GscapeSettings extends GscapeWidget {
  constructor() {
    super(false, true)

    this.btn = new GscapeButton()
    this.btn.onClick = this.toggleBody.bind(this)
  }

  render() {
    return html`
      ${this.btn}
      
      <div class="widget-body gscape-panel hide">
        <div class="gscape-panel-title">Settings</div>
        
        <div class="section"> 
          <span class="title"> Appearance </span>

          <div class="setting-entry">
            <span class="label"> Dark Mode </span>
        </div>
      </div>
    `
  }
}