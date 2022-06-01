import { CytoscapeOptions } from "cytoscape"

export default {
  layout: { name: 'preset' },
  autoungrabify: true,
  maxZoom: 2.5,
  minZoom: 0.02,
  wheelSensitivity: 0.2,
} as  CytoscapeOptions


export const liteOptions = {
  layout: { name: 'preset' },
  autoungrabify: false,
  maxZoom: 2.5,
  minZoom: 0.02,
  wheelSensitivity: 0.2,
}

export const floatyOptions = {
  layout: { name: 'preset' },
  autoungrabify: false,
  maxZoom: 2.5,
  minZoom: 0.02,
  wheelSensitivity: 0.2,
}