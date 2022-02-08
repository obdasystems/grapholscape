import { center_diagram } from '../assets/icons'
import GscapeButton from '../common/gscape-button'

const fitButtonComponent = new GscapeButton(center_diagram, 'Center Diagram')

/** @param {import('../grapholscape').default} */
export function initFitButton(grapholscape) {
  fitButtonComponent.style.marginTop = '10px'
  fitButtonComponent.style.position = 'initial'
  fitButtonComponent.onClick = () => grapholscape.fit()
}

export default fitButtonComponent