var rdfGraph = {
  "diagrams": [
    {
      "id": 0,
      "name": "test",
      "lastViewportState": {
        "zoom": 1.3335217318744357,
        "pan": {
          "x": 462.4127502462761,
          "y": 472.096397617825
        }
      },
      "nodes": [
        {
          "id": "n0",
          "type": "class",
          "originalId": "n0",
          "diagramId": 0,
          "displayedName": " classe1",
          "iri": "http://test.com/Classe1",
          "position": {
            "x": 339.0019754468436,
            "y": -132.72013410458098
          }
        },
        {
          "id": "n2",
          "type": "class",
          "originalId": "n2",
          "diagramId": 0,
          "displayedName": " classe2",
          "iri": "http://test.com/Classe2",
          "position": {
            "x": 633.8450118040694,
            "y": 181.1962732424482
          }
        },
        {
          "id": "n3",
          "type": "class",
          "originalId": "n3",
          "diagramId": 0,
          "displayedName": " classe3",
          "iri": "http://test.com/Classe3",
          "position": {
            "x": 139.2665892420961,
            "y": 128.71771240795087
          }
        },
        {
          "id": "n4",
          "type": "class",
          "originalId": "n4",
          "diagramId": 0,
          "displayedName": " classe4",
          "iri": "http://test.com/Classe4",
          "position": {
            "x": 363.5718401112151,
            "y": 217.3350729683104
          }
        },
        {
          "id": "n5",
          "type": "data-property",
          "originalId": "n5",
          "diagramId": 0,
          "displayedName": "a",
          "iri": "http://test.com/a",
          "position": {
            "x": 424.67652497416674,
            "y": -195.1373747707039
          },
          "labelPosition": {
            "x": 0,
            "y": -15
          }
        },
        {
          "id": "n7",
          "type": "data-property",
          "originalId": "n7",
          "diagramId": 0,
          "displayedName": "b",
          "iri": "http://test.com/b",
          "position": {
            "x": 319.43552661844575,
            "y": -237.71784266111865
          },
          "labelPosition": {
            "x": 0,
            "y": -15
          }
        },
        {
          "id": "n9",
          "type": "data-property",
          "originalId": "n9",
          "diagramId": 0,
          "displayedName": "c",
          "iri": "http://test.com/c",
          "position": {
            "x": 219.72465534382502,
            "y": -207.49590762212375
          },
          "labelPosition": {
            "x": 0,
            "y": -15
          }
        },
        {
          "id": "n14",
          "type": "class",
          "originalId": "n14",
          "diagramId": 0,
          "displayedName": "wddw",
          "iri": "http://test.com/wddw",
          "position": {
            "x": -42.38787436649431,
            "y": -185.94591669938384
          }
        },
        {
          "id": "n15",
          "type": "class",
          "originalId": "n15",
          "diagramId": 0,
          "displayedName": "awdawd",
          "iri": "http://test.com/awdawd",
          "position": {
            "x": -305.2605657961762,
            "y": -46.97523302473409
          }
        },
        {
          "id": "n16",
          "type": "class",
          "originalId": "n16",
          "diagramId": 0,
          "displayedName": "effefe",
          "iri": "http://test.com/effefe",
          "position": {
            "x": -208.2479785295544,
            "y": 234.32125343786996
          }
        },
        {
          "id": "n14-0",
          "type": "disjoint-union",
          "position": {
            "x": -88.24234627022518,
            "y": 38.811274916288646
          },
          "labelPosition": {
            "x": 0,
            "y": 0
          }
        }
      ],
      "edges": [
        {
          "id": "e6",
          "type": "attribute-edge",
          "diagramId": 0,
          "sourceId": "n0",
          "targetId": "n5",
          "breakpoints": []
        },
        {
          "id": "e8",
          "type": "attribute-edge",
          "diagramId": 0,
          "sourceId": "n0",
          "targetId": "n7",
          "breakpoints": []
        },
        {
          "id": "e10",
          "type": "attribute-edge",
          "diagramId": 0,
          "sourceId": "n0",
          "targetId": "n9",
          "breakpoints": []
        },
        {
          "id": "e11",
          "type": "object-property",
          "originalId": "e11",
          "diagramId": 0,
          "displayedName": "OP1",
          "iri": "http://test.com/OP1",
          "sourceId": "n0",
          "targetId": "n4",
          "breakpoints": []
        },
        {
          "id": "e12",
          "type": "object-property",
          "originalId": "e12",
          "diagramId": 0,
          "displayedName": "OP2",
          "iri": "http://test.com/OP2",
          "sourceId": "n0",
          "targetId": "n2",
          "breakpoints": []
        },
        {
          "id": "e13",
          "type": "object-property",
          "originalId": "e13",
          "diagramId": 0,
          "displayedName": "OP3",
          "iri": "http://test.com/OP3",
          "sourceId": "n4",
          "targetId": "n3",
          "breakpoints": []
        },
        {
          "id": "n14-0-e-0",
          "type": "input",
          "sourceId": "n14",
          "targetId": "n14-0",
          "breakpoints": []
        },
        {
          "id": "n14-0-e-1",
          "type": "input",
          "sourceId": "n15",
          "targetId": "n14-0",
          "breakpoints": []
        },
        {
          "id": "n14-0-e-2",
          "type": "input",
          "sourceId": "n16",
          "targetId": "n14-0",
          "breakpoints": []
        },
        {
          "id": "n14-0-inclusion-0",
          "type": "disjoint-union",
          "sourceId": "n14-0",
          "targetId": "n3",
          "breakpoints": []
        },
        {
          "id": "e24",
          "type": "inclusion",
          "diagramId": 0,
          "sourceId": "n3",
          "targetId": "n0",
          "breakpoints": []
        }
      ]
    }
  ],
  "entities": [
    {
      "fullIri": "http://test.com/Classe1",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": " classe1",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/Classe2",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": " classe2",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/Classe3",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": " classe3",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/Classe4",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": " classe4",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/a",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "a",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "datatype": "xsd:boolean",
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/b",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "b",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "datatype": "rdf:PlainLiteral",
      "functionProperties": [],
      "isDataPropertyFunctional": true
    },
    {
      "fullIri": "http://test.com/c",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "c",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "datatype": "xsd:long",
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/OP1",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "OP1",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [
        "functional"
      ],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/OP2",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "OP2",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [
        "inverseFunctional"
      ],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/OP3",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "OP3",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/wddw",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "wddw",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/awdawd",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "awdawd",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    },
    {
      "fullIri": "http://test.com/effefe",
      "annotations": [
        {
          "property": "http://www.w3.org/2000/01/rdf-schema#label",
          "lexicalForm": "effefe",
          "language": "en",
          "datatype": "xsd:string"
        }
      ],
      "functionProperties": [],
      "isDataPropertyFunctional": false
    }
  ],
  "modelType": "ontology",
  "metadata": {
    "name": "test",
    "version": "http://test.com/1.0",
    "namespaces": [
      {
        "value": "http://test.com/",
        "prefixes": [
          ""
        ]
      },
      {
        "value": "http://www.w3.org/2000/01/rdf-schema#",
        "prefixes": [
          "rdfs"
        ]
      },
      {
        "value": "http://www.w3.org/2002/07/owl#",
        "prefixes": [
          "owl"
        ]
      }
    ],
    "iri": "http://test.com/",
    "defaultLanguage": "en",
    "languages": [
      "de",
      "en",
      "es",
      "fr",
      "it"
    ],
    "annotations": [
      {
        "property": "http://www.w3.org/2000/01/rdf-schema#author",
        "lexicalForm": "GP",
        "language": "it",
        "datatype": "xsd:integer"
      }
    ],
    "annotationProperties": [
      "http://www.w3.org/2000/01/rdf-schema#label",
      "http://www.w3.org/2000/01/rdf-schema#comment",
      "http://www.w3.org/2000/01/rdf-schema#author",
      "http://www.w3.org/2000/01/rdf-schema#seeAlso",
      "http://www.w3.org/2000/01/rdf-schema#isDefinedBy",
      "http://www.w3.org/2002/07/owl#deprecated",
      "http://www.w3.org/2002/07/owl#versionInfo",
      "http://www.w3.org/2002/07/owl#priorVersion",
      "http://www.w3.org/2002/07/owl#backCompatibleWith",
      "http://www.w3.org/2002/07/owl#incompatibleWith"
    ]
  },
  "selectedDiagramId": 0,
  "config": {
    "themes": [
      {
        "id": "grapholscape",
        "name": "Grapholscape",
        "colours": {
          "bg-graph": "#fafafa",
          "edge": "#000",
          "bg-node-light": "#fcfcfc",
          "bg-node-dark": "#000",
          "border-node": "#000",
          "label": "#000",
          "label-contrast": "#fcfcfc",
          "class": "#F9F3A6",
          "class-contrast": "#B08D00",
          "object-property": "#AACDE1",
          "object-property-contrast": "#065A85",
          "data-property": "#C7DAAD",
          "data-property-contrast": "#4B7900",
          "individual": "#d3b3ef",
          "individual-contrast": "#9875b7",
          "fg-default": "#24292f",
          "fg-muted": "#57606a",
          "fg-subtle": "#6e7781",
          "fg-on-emphasis": "#ffffff",
          "bg-default": "#f6f8fa",
          "bg-inset": "#eff2f5",
          "border-default": "#d0d7de",
          "border-subtle": "rgba(27, 31, 36, 0.15)",
          "shadow": "#d0d7de",
          "neutral": "#e8ecef",
          "neutral-muted": "#dae0e7",
          "neutral-subtle": "#f3f5f7",
          "accent": "#0969da",
          "accent-muted": "rgba(84, 174, 255, 0.4)",
          "accent-subtle": "#ddf4ff",
          "success": "#1a7f37",
          "success-muted": "rgba(74, 194, 107, 0.4)",
          "success-subtle": "#2da44e",
          "attention": "#9a6700",
          "attention-muted": "rgba(212, 167, 44, 0.4)",
          "attention-subtle": "#fff8c5",
          "danger": "#cf222e",
          "danger-muted": "rgba(255, 129, 130, 0.4)",
          "danger-subtle": "#FFEBE9",
          "class-instance": "#d3b3ef",
          "class-instance-contrast": "#9875b7"
        }
      },
      {
        "id": "graphol",
        "name": "Graphol",
        "colours": {
          "bg-graph": "#fafafa",
          "edge": "#000",
          "bg-node-light": "#fcfcfc",
          "bg-node-dark": "#000",
          "border-node": "#000",
          "label": "#000",
          "label-contrast": "#fcfcfc",
          "class": "#fcfcfc",
          "class-contrast": "#000",
          "object-property": "#fcfcfc",
          "object-property-contrast": "#000",
          "data-property": "#fcfcfc",
          "data-property-contrast": "#000",
          "individual": "#fcfcfc",
          "individual-contrast": "#000",
          "fg-default": "#24292f",
          "fg-muted": "#57606a",
          "fg-subtle": "#6e7781",
          "fg-on-emphasis": "#ffffff",
          "bg-default": "#f6f8fa",
          "bg-inset": "#eff2f5",
          "border-default": "#d0d7de",
          "border-subtle": "rgba(27, 31, 36, 0.15)",
          "shadow": "#d0d7de",
          "neutral": "#e8ecef",
          "neutral-muted": "#dae0e7",
          "neutral-subtle": "#f3f5f7",
          "accent": "#0969da",
          "accent-muted": "rgba(84, 174, 255, 0.4)",
          "accent-subtle": "#ddf4ff",
          "success": "#1a7f37",
          "success-muted": "rgba(74, 194, 107, 0.4)",
          "success-subtle": "#2da44e",
          "attention": "#9a6700",
          "attention-muted": "rgba(212, 167, 44, 0.4)",
          "attention-subtle": "#fff8c5",
          "danger": "#cf222e",
          "danger-muted": "rgba(255, 129, 130, 0.4)",
          "danger-subtle": "#FFEBE9",
          "class-instance": "#fcfcfc",
          "class-instance-contrast": "#000"
        }
      },
      {
        "id": "dark",
        "name": "Dark",
        "colours": {
          "bg-graph": "#0d1117",
          "edge": "#a0a0a0",
          "bg-node-light": "#a0a0a0",
          "bg-node-dark": "#010101",
          "border-node": "#a0a0a0",
          "label": "#a0a0a0",
          "label-contrast": "#000",
          "object-property": "#043954",
          "object-property-contrast": "#7fb3d2",
          "data-property-contrast": "#C7DAAD",
          "data-property": "#4B7900",
          "class-contrast": "#b28f00",
          "class": "#423500",
          "individual-contrast": "#9875b7",
          "individual": "#422D53",
          "class-instance": "#422D53",
          "class-instance-contrast": "#9875b7",
          "fg-default": "#c9d1d9",
          "fg-muted": "#8b949e",
          "fg-subtle": "#6e7681",
          "fg-on-emphasis": "#ffffff",
          "bg-default": "#21262d",
          "bg-inset": "#010409",
          "border-default": "#8b949e",
          "border-subtle": "rgba(240,246,252,0.1)",
          "shadow": "#010409",
          "neutral": "#313b48",
          "neutral-muted": "#343941",
          "neutral-subtle": "#0c1015",
          "accent": "#58a6ff",
          "accent-muted": "rgba(56,139,253,0.4)",
          "accent-subtle": "rgba(56,139,253,0.15)"
        }
      },
      {
        "id": "colorful-light",
        "name": "Colorful - Light",
        "colours": {
          "bg-graph": "#fafafa",
          "edge": "#000",
          "bg-node-light": "#fcfcfc",
          "bg-node-dark": "#000",
          "border-node": "#000",
          "label": "#000",
          "label-contrast": "#fcfcfc",
          "class": "#F9F3A6",
          "class-contrast": "#B08D00",
          "object-property": "#AACDE1",
          "object-property-contrast": "#065A85",
          "data-property": "#C7DAAD",
          "data-property-contrast": "#4B7900",
          "individual": "#d3b3ef",
          "individual-contrast": "#9875b7",
          "fg-default": "#24292f",
          "fg-muted": "#57606a",
          "fg-subtle": "#6e7781",
          "fg-on-emphasis": "#ffffff",
          "bg-default": "#f6f8fa",
          "bg-inset": "#eff2f5",
          "border-default": "#d0d7de",
          "border-subtle": "rgba(27, 31, 36, 0.15)",
          "shadow": "#d0d7de",
          "neutral": "#e8ecef",
          "neutral-muted": "#dae0e7",
          "neutral-subtle": "#f3f5f7",
          "accent": "#0969da",
          "accent-muted": "rgba(84, 174, 255, 0.4)",
          "accent-subtle": "#ddf4ff",
          "success": "#1a7f37",
          "success-muted": "rgba(74, 194, 107, 0.4)",
          "success-subtle": "#2da44e",
          "attention": "#9a6700",
          "attention-muted": "rgba(212, 167, 44, 0.4)",
          "attention-subtle": "#fff8c5",
          "danger": "#cf222e",
          "danger-muted": "rgba(255, 129, 130, 0.4)",
          "danger-subtle": "#FFEBE9",
          "class-instance": "#d3b3ef",
          "class-instance-contrast": "#9875b7"
        }
      },
      {
        "id": "colorful-dark",
        "name": "Colorful - Dark",
        "colours": {
          "bg-graph": "#0d1117",
          "edge": "#a0a0a0",
          "bg-node-light": "#a0a0a0",
          "bg-node-dark": "#010101",
          "border-node": "#a0a0a0",
          "label": "#a0a0a0",
          "label-contrast": "#000",
          "object-property": "#043954",
          "object-property-contrast": "#7fb3d2",
          "data-property-contrast": "#C7DAAD",
          "data-property": "#4B7900",
          "class-contrast": "#b28f00",
          "class": "#423500",
          "individual-contrast": "#9875b7",
          "individual": "#422D53",
          "class-instance": "#422D53",
          "class-instance-contrast": "#9875b7",
          "fg-default": "#c9d1d9",
          "fg-muted": "#8b949e",
          "fg-subtle": "#6e7681",
          "fg-on-emphasis": "#ffffff",
          "bg-default": "#21262d",
          "bg-inset": "#010409",
          "border-default": "#8b949e",
          "border-subtle": "rgba(240,246,252,0.1)",
          "shadow": "#010409",
          "neutral": "#313b48",
          "neutral-muted": "#343941",
          "neutral-subtle": "#0c1015",
          "accent": "#58a6ff",
          "accent-muted": "rgba(56,139,253,0.4)",
          "accent-subtle": "rgba(56,139,253,0.15)"
        }
      }
    ],
    "selectedTheme": "grapholscape",
    "language": "en",
    "entityNameType": "label",
    "renderers": [
      "floaty"
    ],
    "widgets": {
      "diagram-selector": true,
      "filters": true,
      "ontology-info": true,
      "details": true,
      "ontology-explorer": true,
      "owl-visualizer": true
    },
    "filters": []
  }
}