import { css } from "lit";

export default css`
  .list-item {
    display: flex;
    gap: 8px;
    width: 100%;
    align-items: center;
  }

  .list-item.selected-item::before {
    margin-right: -4px;
  }

  .list-item-label {
    white-space: nowrap;
  }

  .list-item.actionable {
    padding-right: 18px;
  }

  .list-item[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`