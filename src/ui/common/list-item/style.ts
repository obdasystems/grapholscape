import { css } from "lit";

export default css`
  .list-item {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .list-item.selected-item::before {
    margin-right: -4px;
  }

  .list-item-label {
    align-self: center;
  }
`