import { center_diagram } from '../assets/icons'
import GscapeButton from '../common/gscape-button'

/** @param {import('../grapholscape').default} */
export const fitButton = (grapholscape) => {
  const fitButtonComponent = new GscapeButton(center_diagram)
  fitButtonComponent.style.bottom = '10px'
  fitButtonComponent.style.right = '10px'
  fitButtonComponent.onClick = () => grapholscape.fit()
  return fitButtonComponent
}