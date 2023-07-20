export function moveUpLeft(widget: HTMLElement) {
  widget.style.transition = 'all 0.5s'
  widget.style.top = '10px'
  widget.style.left = '10px'
  widget.style.transform = 'unset'
  widget.style.width = '20%'

  widget['sideMenuMode'] = true
}

export function restorePosition(widget: HTMLElement) {
  widget.style.removeProperty('top')
  widget.style.removeProperty('left')
  widget.style.removeProperty('transform')
  widget.style.removeProperty('width')

  widget['sideMenuMode'] = false

  setTimeout(() => {
    widget.style.removeProperty('transition')
  }, 500) // wait transition to end before removing it or no transition at all 
}