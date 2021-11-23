A theme in Grapholscape is a set of colours applied to the UI widgets and to the graph.

#### Colours
- UI colours
  - **`primary`** : used mainly for widgets surface colour
  - **`on-secondary`** : used for text on a surface having `primary` colour as background
  - **`primary-dark`** and **`on-primary-dark`** : used for convey lower z-levels
  - **`secondary`** : used as contrast to the primary for highlighting interactive objects and headers
  - **`on-secondary`** : used for text on a surface having `secondary` colour as background
  - **`secondary-dark`** and **`on-secondary-dark`** : used for convey lower z-levels
  - **`shadows`** : used for shadows and borders
  - **`error`** : used for error messages
  - **`on-error`** : used for text on surfaces having `error` as background colour

- Graph colours
  - **`background`**: canvas background
  - **`edge`**: edges colour
  - **`node-bg`**: default nodes background colour
  - **`node-bg-contrast`**: used for nodes that are black in the black/white version of Graphol (i.e. range restrictions)
  - **`node-border`**: border colours for nodes
  - **`label-colour`**: colour for labels
  - **`label_colour_contrast`**: colour for labels opposite to the previous one [not used]

- Entities colours (optional)
    - **`role`** : used on object properties nodes as background,
    - **`role_dark`** : as border and edges of type role in simplified modes
    - **`attribute`** : used on data properties nodes as background
    - **`attribute_dark`** : as border and edges of type attribute in simplified modes
    - **`concept`** : used on classes nodes as background
    - **`concept_dark`** : as border
    - **`individual`** : used on individual nodes as background
    - **`individual_dark`** : as border

## Default Theme Customization
It is possible to choose the default theme among the predefined ones or defining a custom one.
In both cases it is necessary to specify it in the custom default settings. read more about [default settings customization](https://github.com/obdasystems/grapholscape/wiki/Settings#default-settings-customization).
### Setting predefined theme as default
Simply specify the name of the predefined theme in custom settings at the key `theme`.
#### Example - dark theme as default theme
```js
const defaultSettings = { 
  theme : 'dark'
}

const grapholscape = await fullGrapholscape(grapholFile, container, defaultSettings)
```
**Predefined Themes** : `gscape`, `dark`, `classic`
### Defining a new default custom theme
It is possible to define new theme specifying each colour in the custom settings at the `theme` entry.
This time the value will not be a `string` but an `object` whose properties are the colours with their values.
The new theme will be based on the `light` theme of Grapholscape, this means that all unspecified colours will not be overwritten.
You can use two special keys:
- **`name`**(`String`): the name that will be displayed to the user in the setting panel.
  > Default: `name = Custom[i]` where `[i]` is a number
- **`selected`**(`Boolean`): for telling Grapholscape whether to apply the theme or not, if false it will be defined and registered in themes list and the user can select it in setting panel.
  > Default: `selected = true`
#### Example - using 'red' as secondary colour
```js
const defaultSettings = {
  theme : {
    secondary : 'red',
    name: 'Red Passion Theme',
    selected: true
  }
}

const grapholscape = await fullGrapholscape(grapholFile, container, defaultSettings)
```