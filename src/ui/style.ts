import { css } from "lit"

const animationDuration = css`200ms`


export default css`
.gscape-panel {
  font-size: 12px;
  background-color: var(--gscape-color-bg-subtle);
  box-shadow: 0 2px 10px 0 var(--gscape-color-border-default);
  border-radius: var(--gscape-border-radius);
  width: fit-content;
  min-width: 130px;
  max-width: 350px;
  max-height: 350px;
  overflow: scroll;
  scrollbar-width: thin;
  padding: 8px;
  position: relative;
  z-index: 1;
}

.gscape-panel-in-tray {
  position: absolute;
  right: 100%;
  bottom: 0;
  margin-right: 4px;
  white-space: nowrap;
  animation-name: drop-left;
  animation-duration: ${animationDuration};
}

.slotted-icon {
  line-height: 0;
}

.actionable {
  border-radius: var(--gscape-border-radius-btn);
  padding: 6px 8px;
  cursor: pointer;
}

.actionable:hover {
  background-color: var(--gscape-color-neutral-muted);
}

.actionable:active {
  filter: brightness(90%);
}

.selected-item::before {
  content: '.';
  position: static;
  background-color: var(--gscape-color-accent-emphasis);
  color: var(--gscape-color-accent-emphasis);
  border-radius: var(--gscape-border-radius);
  margin: 4px 0;
}

.selected-item > .actionable {
  background-color: var(--gscape-color-neutral-muted);
  font-weight: 600;
}

.primary {
  color: var(--gscape-color-accent-fg);
}

.hide {
  display: none;
}

.drop-down {
  animation-name: drop-down;
  animation-duration: ${animationDuration};
}

@keyframes drop-down {
  from {opacity: 0; top: -20%;}
  to {opacity: 1; top: 0;}
}

.drop-left {
  animation-name: drop-left;
  animation-duration: ${animationDuration};
}

@keyframes drop-left {
  from {opacity: 0; position: absolute; right: -10px;}
  to {opacity: 1; right: 100%;}
}

.drop-right {
  animation-name: drop-right;
  animation-duration: ${animationDuration};
}

@keyframes drop-right {
  from {opacity: 0; position: absolute; left: -10px;}
  to {opacity: 1;  left: 100%;}
}

.blank-slate {
  display:flex;
  flex-direction: column;
  align-items: center;
  max-width: 230px;
  padding: 12px;
  text-align: center;
}

.blank-slate > svg {
  height: 36px;
  width: 36px;
  margin-bottom: 12px;
}

.blank-slate > .header {
  font-weight: 600;
}

.blank-slate > .description {
  font-size: 12px;
  color: var(--gscape-color-fg-subtle);
}

.hr {
  height:1px;
  width:90%;
  margin: 0 auto;
  background-color: var(--gscape-color-border-subtle)
}

.header {
  font-weight: 600;
  margin: 8px 16px;
}

.gscape-panel-in-tray > .header {
  margin-top: 0;
  text-align: center;
}

.muted-text {
  font-size: 10px;
  color: var(--gscape-color-fg-muted);
}

.ellipsed, .ellipsed * {
  overflow-x: hidden;
  text-overflow: ellipsis ellipsis;
}

.bold-text {
  font-weight: 600;
}

select:focus {
  border-color: var(--gscape-color-accent-fg);
}


`