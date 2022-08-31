import cytoscape, { Core, ExportBlobOptions } from 'cytoscape'
import cy_svg from 'cytoscape-svg'
import downloadBlob from "./download-blob"

cytoscape.use(cy_svg)

let options: ExportBlobOptions = {
  output: 'blob',
  full: true,
  bg: '',
}

export function toPNG(fileName: string, cy?: Core, backgroundColor?: string) {
  if (!checkParams(fileName, cy)) return

  options.bg = backgroundColor
  if (cy)
    downloadBlob(cy.png(options), fileName)
}

export function toSVG(fileName: string, cy?: Core, backgroundColor?: string) {
  if (!checkParams(fileName, cy)) return

  options.bg = backgroundColor
  let svg_content = (cy as any).svg(options)
  let blob = new Blob([svg_content], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, fileName)
}


function checkParams(fileName?: string, cy?: Core) {
  if (!fileName || (typeof (fileName) !== 'string')) {
    console.error('Unable to export using an undefined file name')
    return false
  }

  if (!cy) {
    console.error('Unable to export: cytoscape instance is undefined')
    return false
  }

  return true
}