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
  VKGSnapshot,
} from '../models';
import {
    RDFGraphFromJSON,
    RDFGraphToJSON,
    VKGSnapshotFromJSON,
    VKGSnapshotToJSON,
} from '../models';

export interface GetRDFGraphConstructRequest {
    name: string;
    queryID: string;
    pageSize: number;
    pageNumber: number;
}

export interface OwlOntologyOntologyNameVkgCatalogDeleteRequest {
    ontologyName: string;
    version: string;
}

export interface OwlOntologyOntologyNameVkgCatalogExportGetRequest {
    ontologyName: string;
    version: string;
}

export interface OwlOntologyOntologyNameVkgCatalogGetRequest {
    ontologyName: string;
    version: string;
}

export interface OwlOntologyOntologyNameVkgCatalogImportPostRequest {
    ontologyName: string;
    version: string;
    additive?: boolean;
    body?: string;
}

export interface OwlOntologyOntologyNameVkgCatalogPostRequest {
    ontologyName: string;
    version: string;
    vKGSnapshot?: VKGSnapshot;
}

export interface OwlOntologyOntologyNameVkgCatalogSnapshotIdDeleteRequest {
    ontologyName: string;
    version: string;
    snapshotId: number;
}

export interface OwlOntologyOntologyNameVkgCatalogSnapshotIdPutRequest {
    ontologyName: string;
    version: string;
    snapshotId: number;
    vKGSnapshot?: VKGSnapshot;
}

/**
 * 
 */
export class VKGApi extends runtime.BaseAPI {

    /**
     * Returns RDFGraph for CONSTRUCT visualization
     */
    async getRDFGraphConstructRaw(requestParameters: GetRDFGraphConstructRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RDFGraph>> {
        if (requestParameters.name === null || requestParameters.name === undefined) {
            throw new runtime.RequiredError('name','Required parameter requestParameters.name was null or undefined when calling getRDFGraphConstruct.');
        }

        if (requestParameters.queryID === null || requestParameters.queryID === undefined) {
            throw new runtime.RequiredError('queryID','Required parameter requestParameters.queryID was null or undefined when calling getRDFGraphConstruct.');
        }

        if (requestParameters.pageSize === null || requestParameters.pageSize === undefined) {
            throw new runtime.RequiredError('pageSize','Required parameter requestParameters.pageSize was null or undefined when calling getRDFGraphConstruct.');
        }

        if (requestParameters.pageNumber === null || requestParameters.pageNumber === undefined) {
            throw new runtime.RequiredError('pageNumber','Required parameter requestParameters.pageNumber was null or undefined when calling getRDFGraphConstruct.');
        }

        const queryParameters: any = {};

        if (requestParameters.pageSize !== undefined) {
            queryParameters['pageSize'] = requestParameters.pageSize;
        }

        if (requestParameters.pageNumber !== undefined) {
            queryParameters['pageNumber'] = requestParameters.pageNumber;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/endpoint/{name}/cquery/{queryID}/results/rdfGraph`.replace(`{${"name"}}`, encodeURIComponent(String(requestParameters.name))).replace(`{${"queryID"}}`, encodeURIComponent(String(requestParameters.queryID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RDFGraphFromJSON(jsonValue));
    }

    /**
     * Returns RDFGraph for CONSTRUCT visualization
     */
    async getRDFGraphConstruct(requestParameters: GetRDFGraphConstructRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RDFGraph> {
        const response = await this.getRDFGraphConstructRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete all the saved RDFGraph for VKGs exploration
     */
    async owlOntologyOntologyNameVkgCatalogDeleteRaw(requestParameters: OwlOntologyOntologyNameVkgCatalogDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<VKGSnapshot>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVkgCatalogDelete.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVkgCatalogDelete.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/vkg/catalog`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
    }

    /**
     * Delete all the saved RDFGraph for VKGs exploration
     */
    async owlOntologyOntologyNameVkgCatalogDelete(requestParameters: OwlOntologyOntologyNameVkgCatalogDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<VKGSnapshot>> {
        const response = await this.owlOntologyOntologyNameVkgCatalogDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the catalog as a FileInfo
     */
    async owlOntologyOntologyNameVkgCatalogExportGetRaw(requestParameters: OwlOntologyOntologyNameVkgCatalogExportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVkgCatalogExportGet.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVkgCatalogExportGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/vkg/catalog/export`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
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
     * Returns the catalog as a FileInfo
     */
    async owlOntologyOntologyNameVkgCatalogExportGet(requestParameters: OwlOntologyOntologyNameVkgCatalogExportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.owlOntologyOntologyNameVkgCatalogExportGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns the saved RDFGraph for VKGs exploration
     */
    async owlOntologyOntologyNameVkgCatalogGetRaw(requestParameters: OwlOntologyOntologyNameVkgCatalogGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<VKGSnapshot>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVkgCatalogGet.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVkgCatalogGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/vkg/catalog`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
    }

    /**
     * Returns the saved RDFGraph for VKGs exploration
     */
    async owlOntologyOntologyNameVkgCatalogGet(requestParameters: OwlOntologyOntologyNameVkgCatalogGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<VKGSnapshot>> {
        const response = await this.owlOntologyOntologyNameVkgCatalogGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Import a FileInfo in the ontology VKG\'s catalog
     */
    async owlOntologyOntologyNameVkgCatalogImportPostRaw(requestParameters: OwlOntologyOntologyNameVkgCatalogImportPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<VKGSnapshot>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVkgCatalogImportPost.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVkgCatalogImportPost.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        if (requestParameters.additive !== undefined) {
            queryParameters['additive'] = requestParameters.additive;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/vkg/catalog/import`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
    }

    /**
     * Import a FileInfo in the ontology VKG\'s catalog
     */
    async owlOntologyOntologyNameVkgCatalogImportPost(requestParameters: OwlOntologyOntologyNameVkgCatalogImportPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<VKGSnapshot>> {
        const response = await this.owlOntologyOntologyNameVkgCatalogImportPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Save a new VKG exploration
     */
    async owlOntologyOntologyNameVkgCatalogPostRaw(requestParameters: OwlOntologyOntologyNameVkgCatalogPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<VKGSnapshot>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVkgCatalogPost.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVkgCatalogPost.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/vkg/catalog`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: VKGSnapshotToJSON(requestParameters.vKGSnapshot),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
    }

    /**
     * Save a new VKG exploration
     */
    async owlOntologyOntologyNameVkgCatalogPost(requestParameters: OwlOntologyOntologyNameVkgCatalogPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<VKGSnapshot>> {
        const response = await this.owlOntologyOntologyNameVkgCatalogPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete the VKG exploration
     */
    async owlOntologyOntologyNameVkgCatalogSnapshotIdDeleteRaw(requestParameters: OwlOntologyOntologyNameVkgCatalogSnapshotIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<VKGSnapshot>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVkgCatalogSnapshotIdDelete.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVkgCatalogSnapshotIdDelete.');
        }

        if (requestParameters.snapshotId === null || requestParameters.snapshotId === undefined) {
            throw new runtime.RequiredError('snapshotId','Required parameter requestParameters.snapshotId was null or undefined when calling owlOntologyOntologyNameVkgCatalogSnapshotIdDelete.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/vkg/catalog/{snapshotId}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))).replace(`{${"snapshotId"}}`, encodeURIComponent(String(requestParameters.snapshotId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
    }

    /**
     * Delete the VKG exploration
     */
    async owlOntologyOntologyNameVkgCatalogSnapshotIdDelete(requestParameters: OwlOntologyOntologyNameVkgCatalogSnapshotIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<VKGSnapshot>> {
        const response = await this.owlOntologyOntologyNameVkgCatalogSnapshotIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Modify a VKG exploration
     */
    async owlOntologyOntologyNameVkgCatalogSnapshotIdPutRaw(requestParameters: OwlOntologyOntologyNameVkgCatalogSnapshotIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<VKGSnapshot>>> {
        if (requestParameters.ontologyName === null || requestParameters.ontologyName === undefined) {
            throw new runtime.RequiredError('ontologyName','Required parameter requestParameters.ontologyName was null or undefined when calling owlOntologyOntologyNameVkgCatalogSnapshotIdPut.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling owlOntologyOntologyNameVkgCatalogSnapshotIdPut.');
        }

        if (requestParameters.snapshotId === null || requestParameters.snapshotId === undefined) {
            throw new runtime.RequiredError('snapshotId','Required parameter requestParameters.snapshotId was null or undefined when calling owlOntologyOntologyNameVkgCatalogSnapshotIdPut.');
        }

        const queryParameters: any = {};

        if (requestParameters.version !== undefined) {
            queryParameters['version'] = requestParameters.version;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/owlOntology/{ontologyName}/vkg/catalog/{snapshotId}`.replace(`{${"ontologyName"}}`, encodeURIComponent(String(requestParameters.ontologyName))).replace(`{${"snapshotId"}}`, encodeURIComponent(String(requestParameters.snapshotId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: VKGSnapshotToJSON(requestParameters.vKGSnapshot),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(VKGSnapshotFromJSON));
    }

    /**
     * Modify a VKG exploration
     */
    async owlOntologyOntologyNameVkgCatalogSnapshotIdPut(requestParameters: OwlOntologyOntologyNameVkgCatalogSnapshotIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<VKGSnapshot>> {
        const response = await this.owlOntologyOntologyNameVkgCatalogSnapshotIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

}