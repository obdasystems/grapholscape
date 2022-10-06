import { SVGTemplateResult } from "lit"

export default function (slotName: string, icon: SVGTemplateResult) {
  const span = document.createElement('span')
  span.innerHTML = icon.strings[0]
  span.setAttribute('slot', slotName)
  return span
}