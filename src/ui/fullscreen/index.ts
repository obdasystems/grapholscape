import Grapholscape from "../../core/grapholscape"
import { enterFullscreen, exitFullscreen } from "../assets/icons"
import GscapeButton from '../common/button/'
import getIconSlot from "../util/get-icon-slot"

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initFullscreenButton(grapholscape : Grapholscape) {
  const  fullscreenComponent = new GscapeButton()
  //fullscreenComponent.container = grapholscape.container
  const icon = getIconSlot('icon', enterFullscreen)
  const alternativeIcon = getIconSlot('alt-icon', exitFullscreen)

  fullscreenComponent.appendChild(icon)
  fullscreenComponent.appendChild(alternativeIcon)

  fullscreenComponent.style.top = '10px'
  fullscreenComponent.style.right = '10px'
  fullscreenComponent.style.position = 'absolute'
  //fullscreenComponent.onclick = toggleFullscreen
  fullscreenComponent.title = 'Fullscreen'


  const doc = document as any // avoid typechecking
  doc.cancelFullscreen =
    doc.exitFullscreen ||
    doc.cancelFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitCancelFullScreen ||
    doc.msExitFullscreen

  grapholscape.widgets.set('fullscreen-button', fullscreenComponent)

  const container = grapholscape.container as any

  function toggleFullscreen () {
    setFullScreenRequest()
    if (isFullscreen()) {
      doc.cancelFullscreen()
    } else {
      container?.requestFullscreen()
    }
  }

  function isFullscreen () {
    return doc.fullScreenElement ||
      doc.mozFullScreenElement || // Mozilla
      doc.webkitFullscreenElement || // Webkit
      doc.msFullscreenElement // IE
  }

  function setFullScreenRequest() {
    container.requestFullscreen =
      container?.requestFullscreen ||
      container?.mozRequestFullscreen || // Mozilla
      container?.mozRequestFullScreen || // Mozilla older API use uppercase 'S'.
      container?.webkitRequestFullscreen || // Webkit
      container?.msRequestFullscreen // IE
  }
}