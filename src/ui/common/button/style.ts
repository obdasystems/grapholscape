import { css } from "lit";

export default css`
:host {
  display: inline-block;
}

.btn {
  border-radius: var(--gscape-border-radius-btn);
  border: 1px solid var(--gscape-color-border-subtle);
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  text-align: center;
  background-color: var(--gscape-color-bg-default);
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  position: relative;
  color: inherit;
  width: inherit;
  max-width: inherit;
  min-width: inherit;
}

.btn[label] {
  gap: 8px;
  justify-content: space-between;
}

.btn:hover {
  filter: brightness(0.95);
}

.btn:active {
  background-color: var(--gscape-color-neutral-muted);
}

.btn[active] {
  color: var(--gscape-color-accent);
}

.btn[disabled] {
  opacity: 50%;
  cursor: inherit;
  pointer-events: none;
}

.btn-s {
  font-size: 12px;
  padding: 3px 4px;
}

.btn-m {
  font-size: 14px;
  padding: 5px 6px;
}

.btn-m[label], .btn-s[label] {
  padding-left: 8px;
  padding-right: 8px;
}

.btn-l {
  font-size: 16px;
  padding: 7px 8px;
}

.btn-l[label] {
  padding-left: 12px;
  padding-right: 12px;
}

.btn.primary, .primary-box {
  background-color: var(--gscape-color-accent);
  color: var(--gscape-color-fg-on-emphasis);
}

.btn.subtle, .subtle-box {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.btn.subtle:hover {
  filter: brightness(1);
  background-color: var(--gscape-color-neutral);
}

.btn.subtle:active {
  background-color: var(--gscape-color-neutral-muted);
}

.btn.subtle:hover > .btn-label {
  color: var(--gscape-color-accent);
}

.btn-label {
  font-weight: 600;
  line-height: 20px;
  flex-shrink: 1;
}
`