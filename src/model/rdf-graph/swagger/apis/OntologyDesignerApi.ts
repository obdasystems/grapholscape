/* tslint:disable */
/* eslint-disable */
/**
 * Grapholscape API model
 * This is the API for retaining a Grapholscape\'s loaded ontology (or graph) in order to restart navigation from a previous state.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: obdasystems@info.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  RDFGraph,
} from '../models';
import {
    RDFGraphFromJSON,
    RDFGraphToJSON,
} from '../models';

export interface DeleteOntologyDraftRequest {
    ontologyName: string;
}

export interface DownloadOntologyDraftRequest {
    ontologyName: string;
}

export interface GetOntologyDraftRequest {
    ontologyName: string;
}

export interface PostOntologyDraftsRequest {
    ontologyName: string;
    rDFGraph?: RDFGraph;
}

export interface PostOntologyVersionFromRDFGraphRequest {
    ontologyName: string;
    version: string;
    rDFGraph?: RDFGraph;
}

export interface PutOntologyDraftRequest {
    ontologyName: string;
    rDFGraph?: RDFGraph;
}

/**
 * 
 */
export class OntologyDesignerApi extends runtime.BaseAPI {

    /**
     * Delete the ontology draft {ontologyName}
     */
    async deleteOntologyDraftRaw(requestParameters: DeleteOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<RDFGraph>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling deleteOntologyDraft.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RDFGraphFromJSON));
    }

    /**
     * Delete the ontology draft {ontologyName}
     */
    async deleteOntologyDraft(requestParameters: DeleteOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<RDFGraph>> {
        const response = await this.deleteOntologyDraftRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Download the ontology draft {ontologyName} converted in OWL2
     */
    async downloadOntologyDraftRaw(requestParameters: DownloadOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling downloadOntologyDraft.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/ontologyDraft/{ontologyName}/download`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Download the ontology draft {ontologyName} converted in OWL2
     */
    async downloadOntologyDraft(requestParameters: DownloadOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.downloadOntologyDraftRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the ontology draft {ontologyName}
     */
    async getOntologyDraftRaw(requestParameters: GetOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RDFGraph>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling getOntologyDraft.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RDFGraphFromJSON(jsonValue));
    }

    /**
     * Returns the ontology draft {ontologyName}
     */
    async getOntologyDraft(requestParameters: GetOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RDFGraph> {
        const response = await this.getOntologyDraftRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the list of all ontology drafts made by the user
     */
    async getOntologyDraftsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<RDFGraph>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/ontologyDrafts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RDFGraphFromJSON));
    }

    /**
     * Returns the list of all ontology drafts made by the user
     */
    async getOntologyDrafts(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<RDFGraph>> {
        const response = await this.getOntologyDraftsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Add to the list of all ontology drafts a new draft
     */
    async postOntologyDraftsRaw(requestParameters: PostOntologyDraftsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<RDFGraph>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling postOntologyDrafts.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RDFGraphToJSON(requestParameters.rDFGraph),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RDFGraphFromJSON));
    }

    /**
     * Add to the list of all ontology drafts a new draft
     */
    async postOntologyDrafts(requestParameters: PostOntologyDraftsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<RDFGraph>> {
        const response = await this.postOntologyDraftsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Add to the ontology a new version translated from the RDFGraph
     */
    async postOntologyVersionFromRDFGraphRaw(requestParameters: PostOntologyVersionFromRDFGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling postOntologyVersionFromRDFGraph.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling postOntologyVersionFromRDFGraph.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/version/fromRDFGraph`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RDFGraphToJSON(requestParameters.rDFGraph),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Add to the ontology a new version translated from the RDFGraph
     */
    async postOntologyVersionFromRDFGraph(requestParameters: PostOntologyVersionFromRDFGraphRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.postOntologyVersionFromRDFGraphRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Modify the ontology draft {ontologyName} (called when using the ontology builder to save the draft)
     */
    async putOntologyDraftRaw(requestParameters: PutOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<RDFGraph>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling putOntologyDraft.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/ontologyDraft/{ontologyName}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: RDFGraphToJSON(requestParameters.rDFGraph),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RDFGraphFromJSON));
    }

    /**
     * Modify the ontology draft {ontologyName} (called when using the ontology builder to save the draft)
     */
    async putOntologyDraft(requestParameters: PutOntologyDraftRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<RDFGraph>> {
        const response = await this.putOntologyDraftRaw(requestParameters, initOverrides);
        return await response.value();
    }

}