import { enter_fullscreen, exit_fullscreen } from "../assets/icons"
import GscapeButton from "../common/gscape-button"

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initFullscreenButton(grapholscape) {
  const  fullscreenComponent = new GscapeButton(enter_fullscreen, 'Fullscreen' ,exit_fullscreen)
  fullscreenComponent.container = grapholscape.container
  fullscreenComponent.style.top = '10px'
  fullscreenComponent.style.right = '10px'
  fullscreenComponent.onClick = toggleFullscreen



  document.cancelFullscreen =
  document.exitFullscreen ||
  document.cancelFullscreen ||
  document.mozCancelFullScreen ||
  document.webkitCancelFullScreen ||
  document.msExitFullscreen

  grapholscape.widgets.FULLSCREEN_BUTTON = fullscreenComponent

  function toggleFullscreen () {
    setFullScreenRequest()
    if (isFullscreen()) {
      document.cancelFullscreen()
    } else {
      fullscreenComponent.container?.requestFullscreen()
    }
  }

  function isFullscreen () {
    return document.fullScreenElement ||
      document.mozFullScreenElement || // Mozilla
      document.webkitFullscreenElement || // Webkit
      document.msFullscreenElement // IE
  }

  function setFullScreenRequest() {
    fullscreenComponent.container.requestFullscreen =
    fullscreenComponent.container?.requestFullscreen ||
    fullscreenComponent.container?.mozRequestFullscreen || // Mozilla
    fullscreenComponent.container?.mozRequestFullScreen || // Mozilla older API use uppercase 'S'.
    fullscreenComponent.container?.webkitRequestFullscreen || // Webkit
    fullscreenComponent.container?.msRequestFullscreen // IE
  }
}