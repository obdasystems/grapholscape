import { css } from "lit";

export default css`
  .gscape-panel {
    overflow: auto;
  }

  .counter {
    color: var(--gscape-color-fg-default);
    border-color: var(--gscape-color-border-default);
    background-color: var(--gscape-color-neutral-subtle);
    position: absolute;
    margin-left: 18px;
    line-height: 1;
  }

  .section-body {
    position: relative;
  }

  .content-wrapper > * {
    margin: 8px 0;
  }
`