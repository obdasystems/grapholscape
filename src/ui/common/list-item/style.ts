import { css } from "lit";

export default css`
  .list-item {
    display: flex;
    gap: 8px;
    line-height: 20px;
    align-items: stretch;
  }

  .list-item.selected-item::before {
    margin-right: -4px;
  }
`