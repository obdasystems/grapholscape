import { Position } from "cytoscape"
import Breakpoint from "../model/graphol-elems/breakpoint"
import GrapholNode from "../model/graphol-elems/node"
import { Type } from "../model/node-enums"

// Funzioni che ritornano il primo figlio o il fratello successivo di un dato nodo
// Ignorano quindi tutti gli elementi di tipo diverso da 1
// cioè gli attributi, gli spazi vuoti ecc...
export function getFirstChild(node) {
  if (node == null || node.firstChild == null) { return null }

  node = node.firstChild

  if (node.nodeType !== 1) { node = getNextSibling(node) }

  return node
}

export function getNextSibling(node) {
  if (node == null || node.nextSibling == null) { return null }

  node = node.nextSibling
  while (node.nodeType !== 1) {
    if (node.nextSibling == null) { return null }

    node = node.nextSibling
  }

  return node
}

/**
 * Funzione che decide se spostare un endpoint sul bordo del nodo (source o target) o meno
 * Facciamo quest'operazione per tutti gli archi che presentano degli endpoint
 * non al centro del nodo (source o target), in questi casi le
 * opzioni sono 2:
 * 1: l'arco parte (o arriva) in diagonale, in questo caso l'endpoint lo lasciamo al centro del nodo
 * 2: l'arco arriva perpendicolarmente al bordo del nodo (source o target), in questo caso
 *    vediamo se il breakpoint successivo (o precedente nel caso del target), ha la stessa X o la stessa Y
 *    del nodo in questione.
 *    Valutando poi la coordinata che non risulta uguale a quella del nodo, spostiamo l'endpoint sul bordo del
 *    nodo in direzione del breakpoint successivo (o precedente).
 * 
 * Se lasciassimo intatti gli endpoint non centrati, cytoscape farebbe entrare la freccia nel nodo,
 * Traslando sul bordo l'endpoint in direzione del breakpoint successivo (nel caso di source) o precedente
 * (nel caso di target), cytoscape farà corrispondere la punta della freccia sul bordo del nodo e
 * sarà quindi visibile.
 * @param endpoint l'endpoint da spostare
 * @param node il nodo a cui si riferisce l'endpoint
 * @param breakpoint il breakpoint successivo (o precedente)
 */
export function getNewEndpoint(endpoint: Position, node: GrapholNode, breakpoint: Position) {
  // Calcoliamo le coordinate relative al nodo source (o target)
  const endpointRelativeToNode: Position = { x: null, y: null }
  endpointRelativeToNode.x = endpoint.x - node.x
  endpointRelativeToNode.y = endpoint.y - node.y

  if (endpointRelativeToNode.x == 0 && endpointRelativeToNode.y == 0)
    // endpoint centrato sul nodo, non c'è bisogno di spostarlo
    return endpointRelativeToNode

  const breakpointRelativeToNode: Position = { x: null, y: null }
  breakpointRelativeToNode.x = breakpoint.x - node.x
  breakpointRelativeToNode.y = breakpoint.y - node.y

  // Se l'endpoint non è centrato nel nodo ma ha la X uguale al breakpoint successivo (o precedente)
  // Allora l'arco parte (o arriva) perpendicolarmente dall'alto o dal basso
  if (endpointRelativeToNode.x == breakpointRelativeToNode.x) {
    // Se il breakpoint si trova più in basso (Ricorda: asse Y al contrario in cytoscape!),
    // allora spostiamo sul bordo inferiore l'endpoint
    if (breakpointRelativeToNode.y > 0) {
      endpointRelativeToNode.y = node.height / 2
      return endpointRelativeToNode
    }
    // Se invece il breakpoint è più in alto del nodo, allora spostiamo l'endpoint sul bordo superiore
    else if (breakpointRelativeToNode.y < 0) {
      endpointRelativeToNode.y = -node.height / 2
      return endpointRelativeToNode
    }
  }
  // Se invece ad essere uguale è la Y, l'arco arriva da destra o da sinistra, facciamo gli stessi passaggi appena fatti
  else if (endpointRelativeToNode.y == breakpointRelativeToNode.y) {
    if (breakpointRelativeToNode.x > 0) {
      endpointRelativeToNode.x = node.width / 2
      return endpointRelativeToNode
    } else if (breakpointRelativeToNode.x < 0) {
      endpointRelativeToNode.x = -node.width / 2
      return endpointRelativeToNode
    }
  }
  return endpointRelativeToNode
}

export function getPointOnEdge(point1: Position, point2: Position) {
  const m = (point1.y - point2.y) / (point1.x - point2.x)
  const result = new Breakpoint()
  const middleX = (point1.x - point2.x) / 2
  const middleY = (point1.y - point2.y) / 2

  if (point1.x !== point2.x && point1.y !== point2.y) {
    result.x = point1.x - middleX
    // y = mx + q  [ q = y1 - mx1 ] => y = mx + y1 - mx1
    result.y = m * result.x + point1.y - m * point1.x
  }

  // horizontal line
  else if (point1.y === point2.y) {
    result.x = point1.x - middleX
    result.y = point1.y
  }

  // vertical line
  else if (point1.x === point2.x) {
    result.x = point1.x
    result.y = point1.y - middleY
  }

  return result
}
