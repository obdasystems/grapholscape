import { LifecycleEvent, RendererStatesEnum, TypesEnum } from '../../model';
import * as UI from '../../ui';
import OntologyBuilder from '../ontology-builder';
import { addHierarchySuperClassEdge, addInputEdge, getCommandsByType, removeHierarchyByNode, removeHierarchyInputEdge, removeHierarchySuperClassEdge } from './commands';
import GscapeDesignerToolbar from './toolbar';
import edgeEditing from '../edge-editing'
import { setDesignerStyle } from './style';
import GrapholscapeDesigner from '../core';
import GscapeDesignerInfobar from './infobar';

const { GscapeContextMenu } = UI

export default function initBuilderUI(grapholscape: GrapholscapeDesigner) {
  const commandsWidget = new GscapeContextMenu()
  const toolboxWidget = new GscapeDesignerToolbar(grapholscape)
  const infobox = new GscapeDesignerInfobar()


  if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
    grapholscape.uiContainer?.appendChild(toolboxWidget)
    grapholscape.uiContainer?.appendChild(infobox)

  }

  grapholscape.on(LifecycleEvent.NodeSelection, n => {
    const elem = grapholscape.renderer.cy?.$id(n.id)
    toolboxWidget.lastSelectedElement = elem
  })

  grapholscape.on(LifecycleEvent.EdgeSelection, e => {
    const elem = grapholscape.renderer.cy?.$id(e.id)
    toolboxWidget.lastSelectedElement = elem;
  })

  grapholscape.on(LifecycleEvent.BackgroundClick, () => {
    toolboxWidget.lastSelectedElement = undefined
  })

  grapholscape.on(LifecycleEvent.DiagramChange, () => {
    let currentCy = grapholscape.renderer.cy as any

    if (!currentCy.scratch('designer-listeners-set')) {

      setDesignerStyle(currentCy, grapholscape.theme)
      edgeEditing(grapholscape)

      // set true in the scratch so it won't add new listeners
      // if it has already been added
      currentCy.scratch('designer-listeners-set', true)
    }   
  })

  grapholscape.on(LifecycleEvent.DoubleTap, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === TypesEnum.DATA_PROPERTY) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleFunctionality(elem.data('iri'))
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && !(elem.group() === 'edges') && (elem.data('type') === TypesEnum.DISJOINT_UNION || elem.data('type') === TypesEnum.UNION)) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleUnion(elem)
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && (elem.group() === 'edges') && (elem.data('type') === TypesEnum.DISJOINT_UNION || elem.data('type') === TypesEnum.UNION)) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleComplete(elem)
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && (elem.group() === 'edges') && (elem.data('type') === TypesEnum.OBJECT_PROPERTY || (elem.data('type') === TypesEnum.INCLUSION && elem.source().data('type') === TypesEnum.CLASS && elem.target().data('type') === TypesEnum.CLASS) || (elem.data('type') === TypesEnum.INCLUSION && elem.source().data('type') === TypesEnum.DATA_PROPERTY && elem.target().data('type') === TypesEnum.DATA_PROPERTY))) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.swapEdge(elem)
    }
  })

  grapholscape.on(LifecycleEvent.ContextClick, (evt) => {
    toolboxWidget.lastSelectedElement = undefined
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
      const commandsByType = getCommandsByType()
      // get commands for this elem type
      let commandsFunctions = commandsByType.get(elem.data('type')) || []

      if (elem.data().iri) {
        const entity = grapholscape.ontology.getEntity(elem.data().iri)
        if (entity) {
          commandsFunctions.push(...(commandsByType.get('Entity') || []))
        }
      } else {
        const grapholElement = grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)?.grapholElements.get(elem.id())
        if (grapholElement && grapholElement.isHierarchy()) {
          // For hierarchies there can be edges or nodes, manually add specific commands
          if (elem.isNode()) {
            commandsFunctions.push(addHierarchySuperClassEdge)
            commandsFunctions.push(addInputEdge)
            commandsFunctions.push(removeHierarchyByNode)
          }
          else {
            commandsFunctions.push(removeHierarchySuperClassEdge)
          }
        }
        else if (elem.data('type') === TypesEnum.INPUT && (elem.connectedNodes(`[type = "${TypesEnum.UNION}"]`).nonempty() || elem.connectedNodes(`[type = "${TypesEnum.DISJOINT_UNION}"]`).nonempty())) {
          commandsFunctions.push(removeHierarchyInputEdge)
        }
      }

      try {
        const htmlNodeReference = (elem as any).popperRef()
        if (htmlNodeReference && commandsFunctions.length > 0) {
          // each command function is a function taking grapholscape and the selected element
          // use map to get array of commands calling the command function
          const commands = commandsFunctions.map(cf => cf(grapholscape, elem))
          commandsWidget.attachTo(htmlNodeReference, commands)
        }
      } catch (e) { console.error(e) }
    }
  })

  grapholscape.on(LifecycleEvent.MouseOver, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY) {

      if(elem.data('type') === TypesEnum.DATA_PROPERTY){
        infobox.content = 'Double click to toggle functionality'
      }
      else if(elem.data('type') === TypesEnum.UNION || elem.data('type') === TypesEnum.DISJOINT_UNION){
        if(elem.isNode())
          infobox.content = elem.data('type') === TypesEnum.UNION ? 'Double click to add disjointness' : 'Double click to remove disjointness'
        else{
          infobox.content = elem.data('targetLabel') === 'C' ? 'Double click to remove completeness' : 'Double click to add completeness'
        }

      }
      else if ((elem.data('type') === TypesEnum.OBJECT_PROPERTY || (elem.data('type') === TypesEnum.INCLUSION && elem.source().data('type') === TypesEnum.CLASS && elem.target().data('type') === TypesEnum.CLASS) || (elem.data('type') === TypesEnum.INCLUSION && elem.source().data('type') === TypesEnum.DATA_PROPERTY && elem.target().data('type') === TypesEnum.DATA_PROPERTY))) {
        infobox.content = 'Double click to swap edge'
      }
    }
  })

  grapholscape.on(LifecycleEvent.MouseOut, (evt) => {

    if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
        infobox.content = ''
    }

  })
}
