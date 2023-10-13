import { css } from "lit";

export default css`
  .gscape-panel {
    overflow: auto;
  }

  .counter {
    position: absolute;
    margin-left: 18px;
  }

  .chip {
    line-height: 1;
  }

  .chip.data-property-value {
    color: var(--gscape-color-fg-default);
    border-color: var(--gscape-color-data-property-contrast);
    background-color: var(--gscape-color-data-property);
  }

  .neutral-chip {
    color: var(--gscape-color-fg-default);
    border-color: var(--gscape-color-border-default);
    background-color: var(--gscape-color-neutral-subtle);
  }

  .section-body {
    position: relative;
  }

  .content-wrapper > * {
    margin: 8px 0;
  }

  details.entity-list-item > .summary-body {
    white-space: normal;
  }

  .summary-body > .lds-ring {
    margin: 4px auto 8px;
  }

  .limit-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 0 8px;
  }

  .limit-box > input {
    padding: 4px 8px;
    max-width: 80px;
  }
`