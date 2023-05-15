It is possible to configure some aspects of the grapholscape instance we will create. You can do it passing a configuration object as third parameter to the factory functions ([fullGrapholscape](../functions/index.fullGrapholscape.htmlt) and [bareGrapholscape](../functions/index.bareGrapholscape.htmlt)) we've seen in the [getting started](./getting-started.html) section.

The config object must be of type [GrapholscapeConfig](../types/config.GrapholscapeConfig.html). In the following we will see the purpose of each option and what values are allowed.

Let's start with a plain object that we will pass to the factory function:
```ts
  const configObject = {
    ...
  }

  grapholscape = await fullGrapholscape(ontologyFile, container, configObject)
```

>**NOTE**:
>
>These options will be overwritten by the last options used by the user that are stored in the *local storage* of the browser.\
>If you want to always use your defined configuration, you can clear the last used one with:
>```ts
>import { clearLocalStorage } from 'grapholscape'
>
>clearLocalStorage()
>
>// ...and then init grapholscape with the new configuration
>```

## entityNameType
set the starting type for displayed names on entities, it can be one of the values of the [**EntityNameType**](../enums/config.EntityNameType.html) enumeration: `label`, `fullIri` and `prefixedIri`.

Assuming we want to see *prefixed IRI* as default we can do:
```ts
const configObject = { entityNameType: "prefixedIri" }
```
or better using the enumeration:
```ts
import { EntityNameType } from 'grapholscape'

const configObject = { entityNameType: EntityNameType.PREFIXED_IRI }
```

## language
Set the starting language preference for entities' labels and comment annotations.
> **NOTE**: The ontology must support the language, otherwise the first supported language by the ontology will be used as fallback for any label or comment which is not defined in the specified language.

Assuming we want italian as preferred language:
```ts
const configObject = { language: 'it' }
```

## renderers
A renderer is in charge of displaying the ontology in a certain way, zooming, filtering and so on. Grapholscape comes with four different renderers:
- `GRAPHOL`: Graphol renderer, the default visualization of Graphol ontologies.
- `GRAPHOL_LITE`: A simplification of the Graphol language, much more similar to an E/R diagram.
- `FLOATY`: The most simple simplification of the original ontology, just **classes** (and their hierarchies), **object properties** links between classes and **data properties** on classes.
- `INCREMENTAL` (or path): lets you explore the ontology starting from a class and proceed following the paths to other classes.

This option defines an array of renderers which will be available for the user. Accepted values are those in the [RenderersStatesEnum](../enums/model.RendererStatesEnum.html) enumeration.

We might be interested only in **Graphol** and **Floaty**, then we can set it with:

```ts
import { RendererStatesEnum } from 'grapholscape'

const configObject = { 
  renderers: [ RendererStatesEnum.FLOATY, RendererStatesEnum.GRAPHOL ]
}
```

## selectedRenderer
With this option you can decide what renderer you want to set as default at startup.
The accepted values are those in the [RenderersStatesEnum](../enums/model.RendererStatesEnum.html) enumeration.

For example, to use the **`floaty`** renderer at startup you can use:
```ts
import { RendererStatesEnum } from 'grapholscape'

const configObject = { 
  selectedRenderer: RendererStatesEnum.FLOATY
}
```
> **NOTE**: if you specify an array of renderers in the `renderers` option not including the `selectedRenderer`, then this option will be ignored because you have set a renderer not actually available.

## themes
This options lets you choose which themes will be available for the user in the settings panel.
The available default themes are stored in [DefaultThemesEnum](../enums/model.DefaultThemesEnum.html) and are:
- `GRAPHOLSCAPE`: the default light theme
- `GRAPHOL`: the classic blank and white graphol theme
- `DARK`: dark theme

It accepts an array of predefined themes or objects of type [GrapholscapeTheme](../classes/model.GrapholscapeTheme.html).

This allows you several scenarios.

### 1. Specify a subset of themes to be available to the user
For example just `GRAPHOLSCAPE` and `DARK`
```ts
import { DefaultThemesEnum } from 'grapholscape'

const configObject = { 
  themes: [ DefaultThemesEnum.GRAPHOLSCAPE, DefaultThemesEnum.DARK ]
}
```

### 2. Defining one or more totally new custom themes
In this case just create first an object of the class [GrapholscapeTheme](../classes/model.GrapholscapeTheme.html) and then insert it in the array.
To create a theme you need to pass an `id`, a [ColourMap](../types/model.ColourMap.html) and an optional `name` to be displayed to the user.

The ColourMap is just an object in which you can define colours value for the colours defined in [ColourNames](../enums/model.ColoursNames.html).
> **NOTE**: You don't need to define all colours but if you don't define any colour, Grapholscape will use the one defined in the default theme (GRAPHOLSCAPE).
> This can be useful if you just want to tweak the default theme.

Example, use only a custom theme based on default theme in which we use `red` as accent color.
```ts
import { ColourNames, GrapholscapeTheme } from 'grapholscape'

// use enum for autocomplete help or just use plain strings like 'accent', 'accent_muted' and so on.
const redThemeColours = {
  [ColourNames.accent]: 'red',
  [ColourNames.accent_muted]: 'brown',
  [ColourNames.accent_subtle]: 'pink',
}

const configObject = { 
  themes: [ new GrapholscapeTheme('red', redThemeColours, 'Red Passion') ]
}
```

### 3. Mix up the previous two scenarios
You can also use a custom theme **in addition** to predefined ones.
```ts
const configObject = { 
  themes: [
    DefaultThemesEnum.GRAPHOLSCAPE,
    DefaultThemesEnum.GRAPHOL,
    DefaultThemesEnum.DARK,
    new GrapholscapeTheme('red', redThemeColours, 'Red Passion') 
  ]
}
```

## selectedTheme
In this option you can specify the starting theme to use, here you must specify the `id` of a theme, either a custom theme you specified (see [custom themes](#defining-one-or-more-totally-new-custom-themes)) or a predefined one among those in the [DefaultThemesEnum](../enums/model.DefaultThemesEnum.html).

Example: set the dark theme as starting theme
```ts
import { DefaultThemesEnum } from 'grapholscape'

const configObject = {
  selectedTheme: DefaultThemesEnum.DARK
}
```

## widgets
In this options you can enable or disable the widget. You must set it with an object of **key-boolean** pairs in which the keys are the widget IDs.
You can find widgets' IDs in the [WidgetsEnum](../enums/UI.WidgetEnum.html)

Example, use grapholscape without **owl visualizer** and **filters**:
```ts
import { ui } from 'grapholscape'

const configObject = {
  widgets: {
    [ui.WidgetsEnum.OWL_VISUALIZER]: false,
    [ui.WidgetsEnum.FILTERS]: false,
  }
}
```