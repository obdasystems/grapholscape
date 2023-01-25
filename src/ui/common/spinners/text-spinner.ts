import { css, html } from "lit";

export const textSpinner = () => html`<div title="Loading" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`

export const textSpinnerStyle = css`
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 1em;
  }
  .lds-ellipsis div {
    position: absolute;
    top: calc(1em / 2);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--gscape-color-fg-subtle);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 2px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 2px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 14px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(6px, 0);
    }
  }
`