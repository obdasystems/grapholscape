export default () => {
  let div = document.createElement('div')
  div.style.setProperty('position','absolute')
  div.style.setProperty('bottom','0')
  div.style.setProperty('right','0')
  div.style.setProperty('margin','10px')
  div.style.setProperty('display','flex')
  div.style.setProperty('align-items','center')
  div.style.setProperty('flex-direction', 'column-reverse')

  return div
}