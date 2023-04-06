import { css } from "lit";

export default css`
  .settings-wrapper {
    overflow-y: auto;
    scrollbar-width: inherit;
    max-height: 320px;
    overflow-x: hidden;
    padding: 0 8px;
  }

  .area:last-of-type {
    margin-bottom: 0;
  }

  .setting {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .setting-label {
    font-size: 10px;
  }

  .title-wrap {
    white-space: normal;
    width: 220px;
  }
`