import Grapholscape from '../../core/grapholscape'
import { centerDiagram } from '../assets/icons'
import GscapeButton from '../common/button'
import getIconSlot from '../util/get-icon-slot'

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initFitButton(grapholscape: Grapholscape) {
  const fitButtonComponent = new GscapeButton()
  fitButtonComponent.appendChild(getIconSlot('icon', centerDiagram))
  fitButtonComponent.style.order = '2'
  fitButtonComponent.style.marginTop = '10px'
  //fitButtonComponent.style.position = 'initial'
  fitButtonComponent.onclick = () => grapholscape.fit()
  grapholscape.widgets.set('fit-button',fitButtonComponent)
}