import { html } from "lit";
import { searchOff } from "../assets";

export default html`
  <div class="blank-slate">
    ${searchOff}
    <div class="header">Can't find any entity</div>
    <div class="description">Please try again with another search text.</div>
  </div>
`