Default settings in Grapholscape are managed with a [`config.json`](https://github.com/obdasystems/grapholscape/blob/master/src/config.json) file which is a JSON structured in 2 layers, **`areas`** which are 1-st level objects and **`settings`** which are objects contained in an area object.

Each setting have these properties:
- **`type`** : can be `boolean` or `list`
- **`title`** : the name of a setting to be displayed
- **`label`** : optional field with a short text explaining how the setting works
- In case of `"type" : "list"`
  - **`selected`** : the `value` field of the option selected from the list
  - **`list`** : the array of options, **each option** is an boject having 2 properties, `value` and `label` where the former should be univoque and is used to identify the option, the latter is the text to be displayed.
- In case of `"type" : "boolean"`
  - **`enabled`** : the default state of setting

Here's a portion of config.js for better understanding its structure.
```json
{
  "preferences" : {
    "entity_name" : {
      "type" : "list",
      "title" : "Entities Name",
      "label" : "Select the type of name to display on entities",
      "selected" : "label",
      "list" : [
        {
          "value" : "label",
          "label" : "Label"
        },
        {
          "value" : "prefixed",
          "label" : "Prefixed IRI"
        },
        {
          "value" : "full",
          "label": "Full IRI"
        }
      ]
    }
  },
  "widgets" : {
    "explorer" : {
      "title" : "Ontology Explorer",
      "type" : "boolean",
      "enabled" : true,
      "label" : "Enable Ontology Explorer widget"
    }
  }
}   
```

## Default Settings Customization
It's possible to change default settings customizing each setting defined in [`config.json`](https://github.com/obdasystems/grapholscape/blob/master/src/config.json) using an object of options in the form:
```js
const defaultSettings = {
  ...
  setting-key : custom-value,
  ...
}
```
and passing it to **`Grapholscape`** constructor.
> **`setting-key`** must be the `key` of the setting we want to customize, in config.json \
> **`custom-value`** must be the `value` of the option we want to select in case of type `list` or a boolean in case of type `boolean`.

The object for customizing default settings **must not** be structured in areas, just list all setting values you want to be the new default value.
#### Example - full iri as default names and no owl-translator
```js
const defaultSettings = { 
  entity_name : "full",
  owl_translator : false
}

const grapholscape = await fullGrapholscape(grapholFile, container, defaultSettings)
```
> **Note** : for the key **`theme`** it is possible to specify more information than just a `value` in the list. Read more [here](https://github.com/obdasystems/grapholscape/wiki/Themes#default-theme-customization)