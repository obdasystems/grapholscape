import GscapeButton from "../common/gscape-button"

export const fullscreenButton = (container) => {
  const fullscreenComponent = new GscapeButton('fullscreen', 'fullscreen_exit')
  fullscreenComponent.container = container
  fullscreenComponent.style.top = '10px'
  fullscreenComponent.style.right = '10px'
  fullscreenComponent.onClick = toggleFullscreen



  document.cancelFullscreen =
  document.exitFullscreen ||
  document.cancelFullscreen ||
  document.mozCancelFullScreen ||
  document.webkitCancelFullScreen ||
  document.msExitFullscreen

  return fullscreenComponent

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