import GscapeButton from "../common/gscape-button";

/** @param {import('../grapholscape').default} */
export const fitButton = (grapholscape) => {
  const fitButtonComponent = new GscapeButton('filter_center_focus')
  fitButtonComponent.style.bottom = '10px'
  fitButtonComponent.style.right = '10px'
  fitButtonComponent.onClick = () => grapholscape.fit()
  return fitButtonComponent
}