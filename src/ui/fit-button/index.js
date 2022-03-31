import { center_diagram } from '../assets/icons'
import GscapeButton from '../common/gscape-button'

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initFitButton(grapholscape) {
  const fitButtonComponent = new GscapeButton(center_diagram, 'Center Diagram')
  fitButtonComponent.style.order = '2'
  fitButtonComponent.style.marginTop = '10px'
  fitButtonComponent.style.position = 'initial'
  fitButtonComponent.onClick = () => grapholscape.fit()
  grapholscape.widgets.FIT_BUTTON = fitButtonComponent
}