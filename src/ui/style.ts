import { css } from "lit"


export default css`
.gscape-panel {
  color: var(--theme-gscape-on-primary);
  background-color: var(--theme-gscape-primary);
  box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows);
  border-radius: 8px;
  scrollbar-width: thin;
  --gscape-icon-size: 24px;
}



.primary {
  color: var(--gscape-color-accent-fg);
}

.hide {
  display: none;
}
`