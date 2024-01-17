import { css } from "lit"

const animationDuration = css`200ms`
export const BOTTOM_RIGHT_WIDGET = css`bottom-right-widget`

export default css`
*, :host {
  line-height: initial;
  scrollbar-width: thin;
  pointer-events: auto;
}

:host(.${BOTTOM_RIGHT_WIDGET}) {
  border-radius: var(--gscape-border-radius-btn);
  border: 1px solid var(--gscape-color-border-subtle);
  background-color: var(--gscape-color-bg-default);
}

:host(.${BOTTOM_RIGHT_WIDGET}:hover) {
  border-color: var(--gscape-color-border-default);
}

.background-propagation, .background-propagation * {
  background: inherit;
}

.gscape-panel {
  background-color: var(--gscape-color-bg-default);
  box-shadow: 0 2px 10px 0 var(--gscape-color-shadow);
  border-radius: var(--gscape-border-radius);
  border: solid 1px var(--gscape-color-border-subtle);
  width: fit-content;
  min-width: 130px;
  max-width: 50vw;
  max-height: 50vh;
  overflow: auto;
  padding: 8px;
  position: relative;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

::-webkit-scrollbar:hover {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--gscape-color-fg-muted);
  -webkit-border-radius: 1ex;
}

.gscape-panel-in-tray {
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 100%;
  bottom: 0;
  margin-right: 4px;
  white-space: nowrap;
  animation-name: drop-left;
  animation-duration: ${animationDuration};
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0;
  padding-left: 0;
}

.gscape-panel-in-tray.hanging {
  bottom: initial;
  transform: translate(0, calc(-50% - 17px));
}

.gscape-panel-in-tray > .content-wrapper {
  overflow: hidden auto;
  scrollbar-width: inherit;
  padding: 0px 8px;
  position: relative;
}

.slotted-icon, [slot = "icon"], [slot = "alt-icon"], [slot = "trailing-icon"] {
  line-height: 0;
}

.actionable {
  border-radius: var(--gscape-border-radius-btn);
  padding: 6px 8px;
  cursor: pointer;
}

.actionable:hover, .actionable:focus, .actionable:focus-visible {
  background-color: var(--gscape-color-neutral);
}

.actionable:active {
  filter: brightness(90%);
}

.selected-item::before {
  content: '.';
  position: static;
  background-color: var(--gscape-color-accent);
  color: var(--gscape-color-accent);
  border-radius: var(--gscape-border-radius);
  margin: 4px 0;
}

.selected-item > .actionable {
  background-color: var(--gscape-color-neutral);
  font-weight: 600;
}

.primary {
  color: var(--gscape-color-accent);
}

.hide {
  display: none !important;
}

.drop-down {
  position:absolute;
  margin-top: 4px;
  top: 100%;
  animation-name: drop-down;
  animation-duration: ${animationDuration};
  z-index: 0;
}

@keyframes drop-down {
  from {opacity: 0; top: -20%;}
  to {opacity: 1; top: 100%;}
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

.vr {
  width: 1px;
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
  color: var(--gscape-color-fg-muted);
}

.ellipsed, .ellipsed * {
  overflow-x: hidden;
  text-overflow: ellipsis ellipsis;
}

.rtl {
  direction: rtl;
  text-align: left;
}

.bold-text {
  font-weight: 600;
}

select {
  background: var(--gscape-color-neutral-subtle);
  border: solid 1px var(--gscape-color-border-subtle);
  color: inherit;
  padding: 8px 12px;
  font-size: inherit;
  border-radius: var(--gscape-border-radius);
  cursor: pointer;
}

select:focus, input:focus {
  border-color: var(--gscape-color-accent);
  box-shadow: var(--gscape-color-accent) 0px 0px 0px 1px inset;
  outline: currentcolor none 0px;
}

input {
  line-height: inherit;
  border: solid 1px var(--gscape-color-border-subtle);
  padding: 6px 12px;
  border-radius: var(--gscape-border-radius);
  background: var(--gscape-color-bg-inset);
  color: inherit;
  display: inline-block;
  box-sizing: border-box;
}

.link {
  text-decoration: underline;
  cursor: pointer;
  color: var(--gscape-color-accent);
}

.section-body {
  padding: 0px 8px;
}

.section-header {
  margin-bottom: 4px;
}

.chip, .chip-neutral {
  display: inline-flex;
  border: 1px solid var(--gscape-color-accent);
  color: var(--gscape-color-accent);
  border-radius: 16px;
  padding: 2px 6px;
  background: var(--gscape-color-accent-subtle);
  margin: 1px 2px;
}

.chip-neutral {
  border: 1px solid var(--gscape-color-neutral-muted);
  color: var(--gscape-color-fg-muted);
  background: var(--gscape-color-neutral);
}

.area {
  background: var(--gscape-color-bg-inset);
  border-radius: calc(var(--gscape-border-radius) - 2px);
  padding: 4px 4px 4px 6px;
  border: solid 1px var(--gscape-color-border-subtle);
  margin-bottom: 18px;
}

.area > .area-content {
  padding: 8px;
}

.tip {
  font-size: 90%;
  border-bottom: dotted 2px;
  cursor: help;
}

.tip: hover {
  color:inherit;
}

.top-bar {
  display: flex;
  flex-direction: row-reverse;
  line-height: 1;
}

.top-bar.traslated-down {
  position: absolute;
  right: 0;
}
`