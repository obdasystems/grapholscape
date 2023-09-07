import { css } from "lit";

/**
 * Stylesheet to apply to modals having this structure:
 * ```
 * - .gscape-panel
 * |- .top-bar
 * | |- .header
 * | |- close button (optionally)
 * --------------------
 * |- .body
 * | |- form (optionally)
 * --------------------
 * |- .bottom-buttons
 * --------------------
 * ```
 */
export default css`
  .gscape-panel {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%);
    max-width: 30%;
    min-width: 300px;
    max-height: calc(90% - 100px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    overflow: hidden;
  }

  .top-bar {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 4px;
  }

  .header {
    margin: 2px 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-body {
    padding: 0 16px;
    flex-grow: 2;
    overflow: auto;
  }

  form, #advanced-settings {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;
  }

  .form-item label {
    display: block;
    margin-bottom: 4px
  }

  .form-item input {
    display: block;
    width: 100%;
    min-width: 100px;
  }

  form .dropdown {
    position: relative;
    border: solid 1px var(--gscape-color-border-subtle);
    border-radius: var(--gscape-border-radius);
  }

  form .dropdown select {
    width: 100%;
  }

  form .dropdown > * {
    box-sizing: border-box;
    height: 100%;
    border: none;
  }

  form .dropdown input {
    position: absolute;
    width: calc(100% - 18px);
  }

  form .dropdown select:focus, .dropdown input:focus {
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  form .chip {
    width: fit-content;
    border: 1px solid var(--gscape-color-neutral-muted);
    color: unset;
    background: var(--gscape-color-neutral);
  }

  form .chip[selected] {
    border: 1px solid var(--gscape-color-accent);
    color: var(--gscape-color-accent);
    background: var(--gscape-color-accent-subtle);
  }

  .bottom-buttons {
    display: flex;
    align-items: center;
    justify-content: right;
    gap: 8px;
    flex-wrap: wrap;
  }
`