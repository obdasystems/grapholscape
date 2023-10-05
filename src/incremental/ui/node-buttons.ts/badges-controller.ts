import { NodeSingular } from "cytoscape";
import { TemplateResult, SVGTemplateResult } from "lit";
import { Placement } from "tippy.js";
import { Iri, TypesEnum } from "../../../model";
import { NodeButton, textSpinner } from "../../../ui";
import IncrementalController from "../../controller";
import { getButtonOffset } from "./show-hide-buttons";

export default class BadgeController {

  constructor(private ic: IncrementalController) { }

  addLoadingBadge(entityIri: string | Iri, type: TypesEnum) {
    const cyNode = this.findNodeByIri(entityIri, type)
    if (cyNode && cyNode.nonempty()) {
      if (type === TypesEnum.CLASS_INSTANCE)
        cyNode.addClass('unknown-parent-class')
      this._addBadge(cyNode, textSpinner(), 'loading-badge')
    }
  }

  removeLoadingBadge(entityIri: string | Iri, type: TypesEnum) {
    const cyNode = this.findNodeByIri(entityIri, type)
    if (cyNode && cyNode.nonempty()) {
      this._removeBadge(cyNode, 'loading-badge')
    }
  }

  addBadge(
    entityIri: string | Iri,
    type: TypesEnum,
    badgeText: string | number,
    badgeTitle?: string,
    badgeName: string = 'text',
    highlighted = false,
    override = false,
    onHover = false,
    showCondition: () => boolean = () => true,
    timeout?: number,
  ) {
    const cyNode = this.findNodeByIri(entityIri, type)
    if (cyNode && cyNode.nonempty()) {

      if (override && cyNode.scratch(badgeName)) {
        this._removeBadge(cyNode, badgeName)
      }

      const badge = this._addBadge(cyNode, badgeText, badgeName)
      badge.highlighted = highlighted

      if (badgeTitle) {
        badge.title = badgeTitle
      }

      if (onHover) {
        cyNode.on('mouseover', () => {
          if (showCondition())
            badge.tippyWidget.show()
        })
        cyNode.on('mouseout', () => badge.tippyWidget.hide())
      }

      if (timeout !== undefined) {
        setTimeout(() => badge.hide(), 1000)
      }
    }
  }

  updateBadgeContent(entityIri: string | Iri, type: TypesEnum, badgeName: string, newContent: string | number) {
    const cyNode = this.findNodeByIri(entityIri, type)
    if (cyNode && cyNode.nonempty()) {
      const badge = cyNode.scratch(badgeName) as NodeButton | undefined
      if (badge) {
        badge.content = newContent
      }
    }
  }

  private findNodeByIri(iri: string | Iri, type: TypesEnum) {
    if (typeof iri !== 'string')
      iri = iri.fullIri

    const id = this.ic.getIDByIRI(iri, type)
    if (id)
      return this.ic.diagram.representation?.cy.$id(id)
  }

  private _removeBadge(cyNode: NodeSingular, name: string) {
    if (!cyNode.scratch(name)) return
  
    const badgesMap = cyNode.scratch('badges') as Map<string, number>
    if (badgesMap?.get(name)) {
      badgesMap.set(name, badgesMap.get(name)! - 1)
    }
  
    if (badgesMap?.get(name) === 0) {
      badgesMap.delete(name);
      (cyNode.scratch(name) as NodeButton).tippyWidget.destroy()
      cyNode.removeClass('unknown-parent-class')
      cyNode.removeScratch(name)
      cyNode.removeAllListeners()
      cyNode.cy().removeListener('pan', cyNode.scratch(`update-${name}-position`))
      cyNode.removeScratch(`update-${name}-position`)
    }
  }
  
  private _addBadge(
    node: NodeSingular,
    content: string | number | TemplateResult | SVGTemplateResult,
    name: string,
    placement: Placement = 'bottom',
    isIcon = false,
  ) {
    if (node.scratch(name)) {
      const badgesMap = node.scratch('badges') as Map<string, number>
      if (badgesMap.has(name)) {
        badgesMap.set(name, badgesMap.get(name)! + 1)
      }
      return node.scratch(name) as NodeButton
    }
  
    const badge = isIcon
      ? new NodeButton(content)
      : new NodeButton(content, 'template')
  
    badge.cxtWidgetProps.placement = placement
  
    node.scratch('badges', new Map([[name, 1]]))
    node.scratch(name, badge)
    node.scratch(`update-${name}-position`, () => {
      badge.attachToSilently((node as any).popperRef())
    })
    badge.cxtWidgetProps.offset = info => getButtonOffset(info)
    badge.attachTo((node as any).popperRef())
    // update badge position on node moving around and on viewport pan state change
    node.on('position', node.scratch(`update-${name}-position`))
    node.cy().on('pan', node.scratch(`update-${name}-position`))
    node.scratch(`update-${name}-position`)
  
    node.on('remove', (e) => this._removeBadge(e.target, name))
  
    return badge
  }
}