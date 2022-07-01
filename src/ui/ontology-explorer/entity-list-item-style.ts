import { css } from "lit";

export default css`
  details.entity-list-item > summary::marker {
    display: inline-block;
  }

  details.entity-list-item > summary > .entity-icon {
    position: absolute;
  }

  details.entity-list-item > summary > .entity-name {
    margin-left: 24px;
  }

  details.entity-list-item > .summary-body {
    background-color: var(--gscape-color-bg-inset);
    white-space: normal;
    padding: 4px 16px;
  }

  details.entity-list-item[open] {
    border: solid 1px var(--gscape-color-border-subtle);
    border-radius: var(--gscape-border-radius);
    margin-bottom: 8px;
  }
`