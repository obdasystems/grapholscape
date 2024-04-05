import { LifecycleEvent, RendererStatesEnum } from "../../../model";
import { GscapeContextMenu } from "../../../ui";
import IncrementalBase from "../../i-incremental";

export * from './commands';
export function CommandsWidgetFactory(ic: IncrementalBase) {
  const commandsWidget = new GscapeContextMenu()

  ic.grapholscape.on(LifecycleEvent.ContextClick, event => {
    if (
      event.target === ic.grapholscape.renderer.cy ||
      !event.target.data().iri ||
      ic.grapholscape.renderState !== RendererStatesEnum.INCREMENTAL
    )
      return

    const entity = ic.grapholscape.ontology.getEntity(event.target.data().iri)
    const grapholElement = ic.diagram.representation?.grapholElements.get(event.target.id())
    if (!entity || !grapholElement) return

    const commands = ic.getContextMenuCommands(grapholElement, event.target)
    try {
      if (event.target.isEdge() && ic.grapholscape.uiContainer) {
        commandsWidget.attachToPosition(event.renderedPosition, ic.grapholscape.uiContainer, commands)
      } else {
        const htmlNodeReference = (event.target as any).popperRef()
        if (htmlNodeReference && commands.length > 0) {
          commandsWidget.attachTo(htmlNodeReference, commands)
        }
      }

    } catch (e) { console.error(e) }
  })
}