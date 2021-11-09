import cytoscape from 'cytoscape'
import cy_svg from 'cytoscape-svg'
import downloadBlob from "./download-blob"

cytoscape.use(cy_svg)

let options = {
  output: 'blob-promise',
  full: true,
  bg : '',
}

export function toPNG(fileName, cy, backgroundColor) {
  if(!checkParams(fileName, cy)) return

  options.bg = backgroundColor
  cy.png(options).then(blob => downloadBlob(blob, fileName))
}

export function toSVG(fileName, cy, backgroundColor) {
  if(!checkParams(fileName, cy)) return
  
  options.bg = backgroundColor
  let svg_content = cy.svg(options)
  let blob = new Blob([svg_content], {type:"image/svg+xml;charset=utf-8"});
  downloadBlob(blob, fileName)
}


function checkParams(fileName, cy) {
  if( !fileName || ( typeof(fileName) !== 'string' ) ) {
    console.error('Unable to export using an undefined file name')
    return false
  }

  if( !cy ) {
    console.error('Unable to export: cytoscape instance is undefined')
    return false
  }

  return true
}