import { css } from "lit";

export default css`
  div.entity-list-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
  }

  .entity-list-item {
    white-space: nowrap;
  }

  .entity-list-item:hover {
    background: var(--gscape-color-neutral-subtle);
    border-radius: var(--gscape-border-radius-btn);
  }

  div.entity-list-item > .entity-icon {
    flex-shrink: 0;
  }

  details.entity-list-item > summary {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .entity-list-item .entity-name {
    flex-grow: 2;
  }

  details.entity-list-item > .summary-body {
    background-color: var(--gscape-color-bg-inset);
    white-space: normal;
    padding: 4px 8px;
  }

  details.entity-list-item > summary {
    padding: 6px 8px 6px 4px;
  }

  details.entity-list-item[open] {
    border: solid 1px var(--gscape-color-border-subtle);
    border-radius: var(--gscape-border-radius);
    margin-bottom: 8px;
  }

  slot[name="accordion-body"]::slotted(*) {
    background-color: var(--gscape-color-bg-inset);
    white-space: normal;
    padding: 4px 8px;
  }
`