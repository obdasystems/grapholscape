import { css } from "lit";

export default css`
:host {
  min-width: 300px;
  max-height: 600px;
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
  padding-right: 0;
  padding-left: 0;
}

.header {
  width: fit-content;
  margin: 0 auto;
}

gscape-entity-list-item {
  --custom-min-height: 26.5px;
}

.hover-btn {
  display: none;
}

gscape-entity-list-item:hover > .hover-btn {
  display: initial;
}

.entity-list {
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.gscape-panel > * {
  padding: 0 8px;
}

.section {
  overflow: auto;
}

`