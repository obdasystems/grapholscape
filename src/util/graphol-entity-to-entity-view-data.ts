import { Grapholscape } from "../core";
import { GrapholEntity } from "../model";
import { EntityViewData } from "../ui";

export default function (grapholEntity: GrapholEntity, grapholscape: Grapholscape): EntityViewData {
  return {
    displayedName: grapholEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language, grapholscape.ontology.languages.default),
    value: grapholEntity
  }
}