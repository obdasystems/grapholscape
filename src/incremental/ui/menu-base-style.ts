import { css } from "lit";

export default css`
:host {
  min-width: 300px;
  display: block;
}

.gscape-panel {
  min-width: inherit;
  max-width: inherit;
  min-height: inherit;
  max-height: inherit;
  width: inherit;
  height: inherit;
  display: flex;
  gap: 16px;
  flex-direction: column;
  overflow: unset;
}

.header {
  width: fit-content;
  margin: 0 auto;
}

.hover-btn {
  visibility: hidden;
}

gscape-entity-list-item:hover > .hover-btn {
  visibility: visible;
}

.entity-list {
  min-height: 0;
  overflow: auto;
}

`