import GscapeExplorer from "./ontology-explorer";
import init from "./controller"
import Grapholscape from "../../core/grapholscape";
import { WidgetEnum } from "../util/widget-enum";

export { GscapeExplorer }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initOntologyExplorer(grapholscape: Grapholscape) {
  const ontologyExplorerComponent = new GscapeExplorer()
  init(ontologyExplorerComponent, grapholscape)
  grapholscape.widgets.set(WidgetEnum.ONTOLOGY_EXPLORER, ontologyExplorerComponent)
}

export { default as entityListItemStyle } from './entity-list-item-style'