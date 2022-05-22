import { Position } from "cytoscape";

export default class Breakpoint implements Position {
  x: number
  y: number
  distance: number
  weight: number

  private deltaX: number
  private deltaY: number
  private angularCoefficient: number
  private intersectionPoint: Position = { x: null, y: null }
  private distanceSourceTarget: number
  private distanceIntersectionSource: number
  private breakpointRelativeToSource: Position = { x: null, y: null }

  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  /**
   * Date le posizioni di source, target e del breakpoint,
   * la funzione calcola i due parametri peso e distanza del breakpoint
   * @param source posizione del nodo source
   * @param target posizione del nodo target
   */
  public setSourceTarget(source: Position, target: Position) {
    // Coordinate del breakpoint traslando l'origine sul source:
    this.breakpointRelativeToSource.x = this.x - source.x
    this.breakpointRelativeToSource.y = this.y - source.y

    this.deltaX = target.x - source.x
    this.deltaY = target.y - source.y

    // Se deltaX è nullo : source e target sono sulla stessa ascissa
    // la retta che li congiunge è verticale e pertanto non esprimibile come y = mx + q
    // Sappiamo però automaticamente che la retta perpendicolare è del tipo y = c
    // quindi l'intersect point avrà X = 0 e Y = breakpoint['y']
    if (this.deltaX == 0) {
      this.intersectionPoint = { x: 0, y: this.breakpointRelativeToSource.y }
    } else if (this.deltaY == 0) {
      this.intersectionPoint = { x: this.breakpointRelativeToSource.x, y: 0 }
      this.angularCoefficient = 0
    } else {
      this.angularCoefficient = this.deltaY / this.deltaX

      // quindi prendendo il source come origine, la retta che unisce source e target è data da:
      // R: y = angularCoefficient * x

      // La retta che interseca perpendicolarmente R e che passa per point è data da :
      // T: y = - x / angularCoefficient + quote

      // dobbiamo calcolare quote imponendo che point faccia parte della retta T, quindi calcoliamo:
      // quote = breakpoint_y + (breakpoint_x/angularCoefficient)

      const quote = this.breakpointRelativeToSource.y + (this.breakpointRelativeToSource.x / this.angularCoefficient)

      // Adesso mettiamo a sistema le due rette T ed R (che sono perpendicolari) e risolvendo il sistema
      // otteniamo che il punto di intersezione tra le due ha le coordinate:
      // intersectpoint_x = (quote * angularCoefficient) / ((angularCoefficient ^ 2) + 1)
      // intersectpoint_y = intersectpoint_x * angularCoefficient

      this.intersectionPoint.x = (quote * this.angularCoefficient) / (Math.pow(this.angularCoefficient, 2) + 1)
      this.intersectionPoint.y = this.intersectionPoint.x * this.angularCoefficient
    }

    // Distanza tra source e target
    this.distanceSourceTarget = getDisance(source, target)
    /**
     * Distanza tra intersection point e source
     * Le coordinate di intersect point sono espresse traslando l'origine su source, che quindi diventa l'origine (0,0)
     */
    this.distanceIntersectionSource = getDisance(this.intersectionPoint, { x: 0, y: 0 })

    this.setDistance()
    this.setWeight()
  }

  private setWeight() {
    let point_weight = this.distanceIntersectionSource / this.distanceSourceTarget

    // Dobbiamo stabilire se il peso è positivo o negativo
    // Se la X dell' intersectpoint è compresta tra quella del source e quella del target, allora il peso è positivo

    // se la X del target è maggiore della X del source e la X dell'intersectpoint è minore di quella del source, allora il peso è negativo
    if (this.deltaX > 0 && this.intersectionPoint.x < 0) { point_weight = -point_weight }

    if (this.deltaX < 0 && this.intersectionPoint.x > 0) { point_weight = -point_weight }

    this.weight = point_weight
  }

  private setDistance() {
    // Calcolo la distanza tra breakpoint e intersectpoint (sono entrambi espressi rispetto a source, ma per la distanza non ci interessa)
    let distanceBreakpointIntersectionPoint = getDisance(this.breakpointRelativeToSource, this.intersectionPoint)
    //var point_distance = Math.sqrt(Math.pow(intersectpoint['x'] - breakpoint['x'], 2) + Math.pow(intersectpoint['y'] - breakpoint['y'], 2))

    // Dobbiamo stabilire se prendere la point_distance positiva o negativa
    // La regola è che, andando dal source al target sulla retta che li
    // congiunge, se il breakpoint si trova alla mia sinistra, la distanza
    // è negativa, se invece è alla mia destra è positiva

    // questo si traduce nel valutare una diseguaglianza (Y ><= M*X ? dove Y e X sono le coordinate del breakpoint) e la scelta dipende dal quadrante in cui si trova il target.

    // [Stiamo considerando le coordinate relative al source]
    // [Quindi delta['x'] e delta['y'] sono proprio le coordinate del target]

    // RICORDA: in cytoscape il verso crescente dell'asse Y è verso il
    // basso, quindi occorre fare attenzione al verso delle diseguaglianze

    // Target con X negativa => il breakpoint si trova a sinitra della
    // retta quando si trova al di sotto della retta
    if (this.deltaX < 0 && this.breakpointRelativeToSource.y > this.angularCoefficient * this.breakpointRelativeToSource.x) { distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint }

    // Target con X positiva => il breakpoint si trova a sinistra dela
    // retta quando si trova al di sopra della retta
    if (this.deltaX > 0 && this.breakpointRelativeToSource.y < this.angularCoefficient * this.breakpointRelativeToSource.x) { distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint }

    // SOURCE CON STESSA X DEL TARGET
    // se il target ha una Y maggiore del source (deltaY>0),
    // allora sto guardando verso il basso, quindi il punto sarà a
    // sinistra quando la sua X sarà positiva
    if (this.deltaX == 0 && this.deltaY > 0 && this.breakpointRelativeToSource.x > 0) { distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint }
    // Se invece guardo verso l'alto (target con Y<0), allora il nodo è a
    // sinistra della retta quando ha la X negativa
    if (this.deltaX == 0 && this.deltaY < 0 && this.breakpointRelativeToSource.x < 0) { distanceBreakpointIntersectionPoint = -distanceBreakpointIntersectionPoint }

    this.distance = distanceBreakpointIntersectionPoint
  }
}

function getDisance(point1: Position, point2: Position) {
  const deltaX = point1.x - point2.x
  const deltaY = point1.y - point2.y
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
}