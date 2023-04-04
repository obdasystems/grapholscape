import { GrapholEntity } from "../../model";
import grapholEntityToEntityViewData from "../../util/graphol-entity-to-entity-view-data";
import IncrementalController from "../controller";
import { ViewIncrementalEntityData } from "./view-model";

export function getEntityViewDataIncremental(entity: GrapholEntity, incrementalController: IncrementalController) {
  return {
    entityViewData: grapholEntityToEntityViewData(entity, incrementalController.grapholscape),
    hasUnfolding: incrementalController
      .endpointController
      ?.highlightsManager
      ?.hasUnfoldings(entity.iri.fullIri, entity.type)
  } as ViewIncrementalEntityData
}