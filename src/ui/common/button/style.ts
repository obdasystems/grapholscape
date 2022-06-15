import { css } from "lit";

export default css`
.btn {
  border-radius: var(--gscape-border-radius-btn);
  border: 1px solid var(--gscape-color-border-subtle);
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  user-select: none;
  text-decoration: none;
  text-align: center;
  background-color: var(--gscape-color-bg-subtle);
  box-shadow: rgba(27, 31, 36, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset;
  line-height: 20px;
  display: grid;
  position: relative;
  z-index:10;
}

.btn[label] {
  grid-template-columns: auto auto auto;
  gap: 8px;
  justify-content: center;
}

.btn:hover {
  filter: brightness(95%);
}

.btn:active {
  filter: brightness(90%);
}

.btn[active] {
  color: var(--gscape-color-accent-fg);
}

.btn[disabled] {
  opacity: 50%;
  cursor: initial;
  pointer-events: none;
}

.btn-s {
  font-size: 12px;
  padding: 3px 4px;
}

.btn-s[label] {
  padding-left: 4px;
  padding-right: 4px;
}


.btn-m {
  font-size: 14px;
  padding: 5px 6px;
}

.btn-m[label] {
  padding-left: 16px;
  padding-right: 16px;
}

.btn-l {
  font-size: 16px;
  padding: 7px 8px;
}

.btn-l[label] {
  padding-left: 36px;
  padding-right: 36px;
}

.btn.primary, .primary-box {
  background-color: var(--gscape-color-accent-emphasis);
  color: var(--gscape-color-fg-on-emphasis);
}

.btn.subtle, .subtle-box {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.btn.subtle:hover {
  background-color: var(--gscape-color-neutral-subtle);
}

.btn.subtle:hover > .btn-label {
  color: var(--gscape-color-accent-fg);
}

.btn-label {
  font-weight: 600;
}
`