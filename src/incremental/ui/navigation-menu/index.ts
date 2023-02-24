import { WidgetEnum } from "../../../ui";
import IncrementalController from "../../controller";
import GscapeNavigationMenu, { ObjectPropertyNavigationEvent } from "./navigation-menu";

export function NavigationMenuFactory(incrementalController: IncrementalController) {
  const navigationMenu = new GscapeNavigationMenu()

  incrementalController.grapholscape.widgets.set(WidgetEnum.NAVIGATION_MENU, navigationMenu)

  navigationMenu.requestUpdate()


  navigationMenu.addEventListener('onclassselection', (e: ObjectPropertyNavigationEvent) => {
    e.detail.direct
      ? incrementalController.addIntensionalObjectProperty(e.detail.objectPropertyIri, e.detail.referenceClassIri, e.detail.rangeClassIri)
      : incrementalController.addIntensionalObjectProperty(e.detail.objectPropertyIri, e.detail.rangeClassIri, e.detail.referenceClassIri)

    setTimeout(() => {
      incrementalController.grapholscape.centerOnElement(e.detail.rangeClassIri)
    }, 250)

    navigationMenu.hide()
  })

  return navigationMenu
}