export default function (slotName: string, icon: string) {
  const span = document.createElement('span')
  span.innerHTML = icon
  span.setAttribute('slot', slotName)
  return span
}