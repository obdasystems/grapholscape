import { css } from "lit";

export default css`
  div.entity-list-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    flex-wrap: var(--custom-wrap, initial);
    min-height: var(--custom-min-height, unset);
  }

  .entity-list-item {
    white-space: nowrap;
  }

  .entity-list-item:hover, .entity-list-item:focus {
    background: var(--gscape-color-neutral-subtle);
    border-radius: var(--gscape-border-radius-btn);
  }

  div.entity-list-item > .slotted-icon, summary > .slotted-icon {
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
    padding: 4px 8px;
  }

  slot {
    white-space: normal;
  }

  .entity-list-item[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .entity-list-item .color-dot {
    height: 16px;
    width: 16px;
    background: var(--entity-color);
    border-radius: 50%;
    flex-shrink: 0;
  }
`