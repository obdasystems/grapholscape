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
>**`setting-key`** must be the `key` of the setting we want to customize, in config.json

> **`custom-value`** must be the `value` of the option we want to select in case of type `list` or a boolean in case of type `boolean`.

### List of settings
The object for customizing default settings **must not** be structured in areas, just list all setting values you want to be the new default value.
  - `entity_name`: *`string`* the type of name to display on entities, plese see [EntityNameType](global.html#EntityNameType)
  - `language`: *`string`* the value of a desired language, please see [Language](global.html#Language)
  - `explorer`: *`boolean`* whether to enable or not the ontology explorer widget
  - `details`: *`boolean`* whether to enable or not the entity details widget
  - `owl_translator`: *`boolean`* whether to enable or not the OWL translator widget
  - `filters`: *`boolean`* whether to enable or not the filters widget
  - `simplifications`: *`boolean`* whether to enable or not the simplifications (renderers) widget
  - `renderers`: *`Array<string>`* an array of desired renderers by their keys. There must be at least one of `['default', 'lite', 'float']`,
  if the array does not contain any valid renderer key, `default` will be used as fallback.
  - `theme`: *`object | string`* either specify the key value of a predefined theme or define a completely new one.
    > **Note** : for costumizing themes read more [here](https://github.com/obdasystems/grapholscape/wiki/Themes#default-theme-customization)

### Example
Let's suppose we want to visualize the ontology only in its simplest representation which is the one offered by the `floaty` renderer,
since we will be using only one renderer, we are not interested in having the widget to switch between simplifications too.
Lastly we want the secondary colour to be a bright fancy `red`. Here's the setting object:
```js
const defaultSettings = { 
  renderers: [ 'float' ],
  simplifications: false,
  theme: { secondary: 'red' }
}

const grapholscape = await fullGrapholscape(grapholFile, container, defaultSettings)
```