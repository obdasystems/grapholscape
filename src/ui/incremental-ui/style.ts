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

  .search-box {
    display: flex;
    align-items: stretch;
    margin: 4px 0;
  }

  .search-box > select {
    max-width: 30%;
    padding: 8px;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: none;
    min-width: 100px;
  }

  .search-box > input {
    padding: 8px;
    min-width: 150px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    flex-grow: 2;
    flex-shrink: 0;
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