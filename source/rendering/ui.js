/**
 * DRAFT - To be refactored
 */

import GscapeDiagramSelector from './widgets/gscape-diagram-selector'
import GscapeExplorer from './widgets/gscape-explorer';
import GscapeEntityDetails from './widgets/gscape-entity-details';
import GscapeButton from './widgets/gscape-button';
import GscapeFilters from './widgets/gscape-filters';

export default function createUi () {
  this.diagram_selector = new GscapeDiagramSelector(this.ontology.diagrams)
  this.diagram_selector.onDiagramChange = this.drawDiagram.bind(this)
  this.container.appendChild(this.diagram_selector)

  const explorer = new GscapeExplorer(this.ontology.getPredicates(), this.ontology.diagrams)
  explorer.onEntitySelect = this.showDetails.bind(this)
  explorer.onNodeSelect = this.centerOnNode.bind(this)
  this.container.appendChild(explorer)

  this.entity_details = new GscapeEntityDetails()
  this.container.appendChild(this.entity_details)

  const btn_fullscreen = new GscapeButton('fullscreen', 'fullscreen_exit')
  btn_fullscreen.style.top = '10px'
  btn_fullscreen.style.right = '10px'
  btn_fullscreen.onClick = this.toggleFullscreen.bind(this)
  this.container.appendChild(btn_fullscreen)

  const btn_reset = new GscapeButton('filter_center_focus')
  btn_reset.style.bottom = '10px'
  btn_reset.style.right = '10px'
  btn_reset.onClick = this.resetView.bind(this)
  this.container.appendChild(btn_reset)

  this.filters_widget = new GscapeFilters(this.filters)
  this.filters_widget.onFilterOn = this.filter.bind(this)
  this.filters_widget.onFilterOff = this.unfilter.bind(this)

  this.container.appendChild(this.filters_widget)
}

/*
export default function createUi () {
  // reference to this object, used when adding event listeners
  var this_renderer = this
  var i

  // module : diagram list
  var module = document.createElement('div')
  var child = document.createElement('div')
  var img = document.createElement('i')
  var drop_down_icon = document.createElement('i')
  drop_down_icon.setAttribute('class', 'material-icons md-24')
  drop_down_icon.innerHTML = 'arrow_drop_down'

  module.setAttribute('id', 'diagram_name')
  module.setAttribute('class', 'module')

  // module head
  child.setAttribute('id', 'title')
  child.setAttribute('class', 'module_head')
  child.innerHTML = 'Select a diagram'
  module.appendChild(child)

  // module button
  child = document.createElement('div')
  child.setAttribute('id', 'diagram-list-button')
  child.setAttribute('class', 'module_button')
  child.setAttribute('onclick', 'toggle(this)')

  child.appendChild(drop_down_icon)
  module.appendChild(child)

  // module dropdown div
  child = document.createElement('div')
  child.setAttribute('id', 'diagram_list')
  child.setAttribute('class', 'gcollapsible module_body')

  // adding diagrams in the dropdown div
  this.ontology.diagrams.forEach(diagram => {
    let item = document.createElement('div')
    item.setAttribute('class', 'diagram_item')

    item.innerHTML = diagram.name

    item.addEventListener('click', function () {
      this_renderer.drawDiagram(diagram)
      toggle(document.getElementById('diagram-list-button'))
    })

    child.appendChild(item)
  })

  module.appendChild(child)
  makeDraggable(module)
  this.container.appendChild(module)

  // module : Explorer
  module = module.cloneNode(true)
  module.setAttribute('id', 'explorer')
  // module still have class = 'module' so we don't need to addd them
  var input = document.createElement('input')
  input.setAttribute('autocomplete', 'off')
  input.setAttribute('type', 'text')
  input.setAttribute('id', 'search')
  input.setAttribute('placeholder', 'Search Predicates...')
  input.setAttribute('onkeyup', 'search(this.value)')

  // module_head contains the input field
  module.firstElementChild.innerHTML = ''
  module.firstElementChild.appendChild(input)
  // we need to modify the id of the module_button
  module.getElementsByClassName('module_button')[0].setAttribute('id', 'predicates-list-button')

  // dropdown div with predicates list
  module.removeChild(module.lastElementChild)
  child = document.createElement('div')
  child.setAttribute('id', 'predicates_list')
  child.setAttribute('class', 'gcollapsible module_body')

  module.appendChild(child)
  makeDraggable(module)
  this.container.appendChild(module)

  // Ontology Explorer Table Population
  var j, row, wrap, col, img_type_address, sub_rows_wrapper, sub_row, element, nodes, key, label

  this.ontology.getPredicates().forEach(predicate => {
    let diagram = this.ontology.diagrams[predicate.data('diagram_id')]

    label = predicate.data('label').replace(/\r?\n|\r/g, '')
    key = label.concat(predicate.data('type'))
    // If we already added this predicate to the list, we add it in the sub-rows
    if (document.getElementById(key) != null) {
      sub_rows_wrapper = document.getElementById(key).getElementsByClassName('sub_row_wrapper')[0]

      sub_row = document.createElement('div')
      sub_row.setAttribute('class', 'sub_row')

      sub_row.setAttribute('diagram', diagram.name)
      sub_row.setAttribute('node_id', predicate.id())
      sub_row.innerHTML = '- ' + sub_row.getAttribute('diagram') + ' - ' + predicate.data('id_xml')

      sub_row.addEventListener('click', function () {
        toggle(document.getElementById('predicates-list-button'))
        this_renderer.centerOnNode(predicate.id(), diagram, 1.25)
      })

      sub_rows_wrapper.appendChild(sub_row)
    }
    // Else: this is a new predicate, we create its row and its first sub row
    else {
      // row is the container of a row and a set of sub-rows
      row = document.createElement('div')
      row.setAttribute('id', key)
      row.setAttribute('class', 'predicate')

      // the "real" row
      wrap = document.createElement('div')
      wrap.setAttribute('class', 'graphol_row')

      // columns
      col = document.createElement('span')
      img = document.createElement('i')
      img.setAttribute('class', 'no_highlight material-icons md-18')
      img.innerHTML = 'keyboard_arrow_right'
      col.appendChild(img)
      wrap.appendChild(col)

      col = document.createElement('span')
      // col.setAttribute('class','col type_img');

      img = document.createElement('div')
      img.innerHTML = predicate.data('type').charAt(0).toUpperCase()
      img.style.display = 'block'
      img.style.width = '1.2vw'
      img.style.height = '1.2vw'
      img.style.textAlign = 'center'
      img.style.verticalAlign = 'middle'
      img.style.lineHeight = '1.2vw'

      let lightColor = null
      let darkColor = null
      switch (img.innerHTML) {
        case 'C' :
          lightColor = '#F9F3A6'
          darkColor = '#B08D00'
          break
        case 'R' :
          lightColor = '#AACDE1'
          darkColor = '#065A85'
          break
        case 'A' :
          lightColor = '#C7DAAD'
          darkColor = '#4B7900'
          break
      }

      img.style.color = darkColor
      img.style.backgroundColor = lightColor
      img.style.border = '1px solid ' + darkColor

      col.appendChild(img)
      wrap.appendChild(col)

      col = document.createElement('div')
      col.setAttribute('class', 'info')
      col.innerHTML = label

      wrap.appendChild(col)
      row.appendChild(wrap)

      wrap.firstChild.addEventListener('click', function () { toggleSubRows(this) })
      wrap.getElementsByClassName('info')[0].addEventListener('click', function () {
        this_renderer.showDetails(predicate)
        this_renderer.cy.nodes().unselect()
      })

      sub_rows_wrapper = document.createElement('div')
      sub_rows_wrapper.setAttribute('class', 'sub_row_wrapper')

      sub_row = document.createElement('div')
      sub_row.setAttribute('class', 'sub_row')

      sub_row.setAttribute('diagram', diagram.name)
      sub_row.setAttribute('node_id', predicate.id())
      sub_row.innerHTML = '- ' + sub_row.getAttribute('diagram') + ' - ' + predicate.data('id_xml')

      sub_row.addEventListener('click', function () {
        toggle(document.getElementById('predicates-list-button'))
        this_renderer.centerOnNode(predicate.id(), diagram, 1.25)
      })

      sub_rows_wrapper.appendChild(sub_row)
      row.appendChild(sub_rows_wrapper)
    }
    // Child = predicates list
    child.appendChild(row)
  }, this)

  // zoom_tools
  module = document.createElement('div')
  module.setAttribute('id', 'zoom_tools')
  module.setAttribute('class', 'grapholscape-tooltip module')

  // zoom_in
  child = document.createElement('div')
  child.setAttribute('class', 'bottom_button')
  child.setAttribute('id', 'zoom_in')
  img = document.createElement('i')
  img.setAttribute('class', 'material-icons md-24')
  img.innerHTML = 'add'

  child.appendChild(img)
  child.addEventListener('click', function () {
    this_renderer.cy.zoom({
      level: this_renderer.cy.zoom() + 0.08,
      renderedPosition: { x: this_renderer.cy.width() / 2, y: this_renderer.cy.height() / 2 }
    })
    var slider_value = Math.round(this_renderer.cy.zoom() / this_renderer.cy.maxZoom() * 100)
    document.getElementById('zoom_slider').setAttribute('value', slider_value)
  })
  // child.onselectstart = function() { return false};
  module.appendChild(child)

  // tooltip
  child = document.createElement('span')
  child.setAttribute('class', 'tooltiptext')
  child.onclick = function () { toggle(this) }
  child.innerHTML = 'Toggle slider'

  module.appendChild(child)

  // slider
  child = document.createElement('div')
  child.setAttribute('class', 'gcollapsible')
  child.setAttribute('id', 'slider_body')

  input = document.createElement('input')
  input.setAttribute('id', 'zoom_slider')
  input.setAttribute('autocomplete', 'off')
  input.setAttribute('type', 'range')
  input.setAttribute('min', '1')
  input.setAttribute('max', '100')
  input.setAttribute('value', '50')

  input.oninput = function () {
    var zoom_level = (this_renderer.cy.maxZoom() / 100) * this.value
    this_renderer.cy.zoom({
      level: zoom_level,
      renderedPosition: { x: this_renderer.cy.width() / 2, y: this_renderer.cy.height() / 2 }
    })
  }

  child.appendChild(input)

  module.appendChild(child)
  module.appendChild(document.createElement('hr'))

  // zoom_out
  child = document.createElement('div')
  child.setAttribute('class', 'bottom_button')
  child.setAttribute('id', 'zoom_out')
  img = document.createElement('i')
  img.setAttribute('class', 'material-icons md-24')
  img.innerHTML = 'remove'

  child.appendChild(img)
  child.addEventListener('click', function () {
    this_renderer.cy.zoom({
      level: this_renderer.cy.zoom() - 0.08,
      renderedPosition: { x: this_renderer.cy.width() / 2, y: this_renderer.cy.height() / 2 }
    })
    var slider_value = Math.round(this_renderer.cy.zoom() / this_renderer.cy.maxZoom() * 100)
    document.getElementById('zoom_slider').setAttribute('value', slider_value)
  })
  // child.onselectstart = function() { return false};
  module.appendChild(child)

  // add zoom_tools module to the container
  this.container.appendChild(module)

  // Details
  module = document.createElement('div')
  module.setAttribute('id', 'details')
  module.setAttribute('class', 'module hide')

  // module head
  child = document.createElement('div')
  child.setAttribute('class', 'module_head')
  child.style.textAlign = 'center'
  child.innerHTML = 'Details'
  module.appendChild(child)

  // module button
  child = document.createElement('div')
  child.setAttribute('id', 'details_button')
  child.setAttribute('class', 'module_button')
  child.setAttribute('onclick', 'toggle(this)')
  img = drop_down_icon.cloneNode(true)
  img.innerHTML = 'arrow_drop_up'
  child.appendChild(img)
  module.appendChild(child)

  // module body
  child = document.createElement('div')
  child.setAttribute('id', 'details_body')
  child.setAttribute('class', 'gcollapsible module_body')
  module.appendChild(child)
  makeDraggable(module)
  this.container.appendChild(module)

  // filters
  module = document.createElement('div')
  module.setAttribute('id', 'filters')
  module.setAttribute('class', 'module')
  child = document.createElement('div')
  child.setAttribute('id', 'filter_body')
  child.setAttribute('class', 'bottom_window hide')

  child.innerHTML += ('<div style="text-align:center; margin-bottom:10px;"><strong>Filters</strong></div>')

  var aux = document.createElement('div')
  aux.setAttribute('class', 'filtr_option')
  var check_slider_wrap = document.createElement('label')
  check_slider_wrap.setAttribute('class', 'check_slider_wrap')
  input = document.createElement('input')
  input.setAttribute('id', 'attr_check')
  input.setAttribute('type', 'checkbox')
  input.setAttribute('checked', 'checked')
  var check_slider = document.createElement('span')
  check_slider.setAttribute('class', 'check_slider')

  check_slider_wrap.appendChild(input)
  check_slider_wrap.appendChild(check_slider)

  aux.appendChild(check_slider_wrap)

  var label = document.createElement('span')
  label.innerHTML = 'Attributes'
  label.setAttribute('class', 'filtr_text')
  aux.appendChild(label)
  child.appendChild(aux)

  aux = aux.cloneNode(true)
  aux.firstElementChild.firstElementChild.setAttribute('id', 'val_check')
  aux.lastElementChild.innerHTML = 'Value Domain'
  child.appendChild(aux)

  aux = aux.cloneNode(true)
  aux.firstElementChild.firstElementChild.setAttribute('id', 'indiv_check')
  aux.lastElementChild.innerHTML = 'Individuals'
  child.appendChild(aux)

  aux = aux.cloneNode(true)
  aux.firstElementChild.firstElementChild.setAttribute('id', 'forall_check')
  aux.lastElementChild.innerHTML = 'Universal Quantifier'
  child.appendChild(aux)

  aux = aux.cloneNode(true)
  aux.firstElementChild.firstElementChild.setAttribute('id', 'not_check')
  aux.lastElementChild.innerHTML = 'Not'
  child.appendChild(aux)

  // child.innerHTML = '<div class="filtr_option"><input id="attr_check" type="checkbox" checked /><label class="filtr_text">Attributes</label></div>';
  // child.innerHTML += '<div class="filtr_option"><input id="val_check" type="checkbox" checked /><label class="filtr_text">Value Domain</label></div>';
  // child.innerHTML += '<div class="filtr_option"><input id="indiv_check" type="checkbox" checked /><label class="filtr_text">Individuals</label></div>';
  // child.innerHTML += '<div class="filtr_option"><input id="forall_check" type="checkbox" checked /><label class="filtr_text">Universal Quantifier</label></div>';

  module.appendChild(child)
  module.innerHTML += '<div onclick="toggle(this)" class="bottom_button" title="filters"><i alt="filters" class="material-icons md-24"/>filter_list</i></div>'

  this.container.appendChild(module)

  var input
  var elm = module.getElementsByClassName('filtr_option')

  for (i = 0; i < elm.length; i++) {
    input = elm[i].firstElementChild.firstElementChild

    input.addEventListener('click', function () {
      this_renderer.filter(this.id)
    })
  }

  // Center Button
  module = document.createElement('div')
  module.setAttribute('id', 'center_button')
  module.setAttribute('class', 'module bottom_button')
  module.setAttribute('title', 'reset')

  img = drop_down_icon.cloneNode(true)
  img.innerHTML = 'filter_center_focus'
  module.appendChild(img)

  module.addEventListener('click', function () {
    this_renderer.cy.fit()
  })

  this.container.appendChild(module)

  // fullscreen control
  module = document.createElement('div')
  module.setAttribute('id', 'grapholscape-fullscreen-btn')
  module.setAttribute('class', 'module bottom_button')
  module.setAttribute('title', 'fullscreen')
  img = document.createElement('i')
  img.setAttribute('class', 'material-icons md-24')
  img.innerHTML = 'fullscreen'
  img.onclick = function () { this.toggleFullscreen() }.bind(this)
  var grapholscape = this
  var fsHandler = function (event) {
    var fullscreenToggle = document.getElementById('grapholscape-fullscreen-btn')
    var toggleImg = fullscreenToggle.getElementsByTagName('i')[0]
    var c = grapholscape.container

    if (grapholscape.isFullscreen()) {
      c.fullScreenRestore = {
        position: c.style.position,
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset,
        width: c.style.width,
        height: c.style.height
      }
      c.style.position = undefined
      c.style.width = '100%'
      c.style.height = '100%'
      c.className += ' grapholscape-fullscreen'
      document.documentElement.style.overflow = 'hidden'
      toggleImg.innerHTML = 'fullscreen_exit'
    } else {
      c.className = c.className.replace(/\s*grapholscape-fullscreen\b/, '')
      document.documentElement.style.overflow = ''
      var info = c.fullScreenRestore
      c.style.position = info.position
      c.style.width = info.width
      c.style.height = info.height
      window.scrollTo(info.scrollLeft, info.scrollTop)
      toggleImg.innerHTML = 'fullscreen'
    }

    grapholscape.cy.resize()
  }
  document.addEventListener('fullscreenchange', fsHandler, false)
  document.addEventListener('mozfullscreenchange', fsHandler, false)
  document.addEventListener('webkitfullscreenchange', fsHandler, false)
  module.appendChild(img)
  this.container.appendChild(module)

  // OWL2 TRANSLATOR
  module = document.createElement('div')
  module.setAttribute('id', 'owl_translator')
  module.setAttribute('class', 'hide module')

  // module body
  child = document.createElement('div')
  child.setAttribute('id', 'translator_body')
  child.setAttribute('class', 'module_body gcollapsible')
  aux = document.createElement('div')
  aux.setAttribute('id', 'owl_axiomes')
  child.appendChild(aux)
  module.appendChild(child)

  // module head
  child = document.createElement('div')
  child.setAttribute('class', 'module_head')
  child.innerHTML = 'OWL 2'

  module.appendChild(child)

  // module button
  child = document.createElement('div')
  child.setAttribute('id', 'translator-button')
  child.setAttribute('class', 'module_button')
  child.setAttribute('onclick', 'toggle(this)')
  img = drop_down_icon.cloneNode(true)
  img.innerHTML = 'arrow_drop_down'
  child.appendChild(img)
  module.appendChild(child)

  this.container.appendChild(module)

  // ONTOLOGY INFOS
  module = document.createElement('div')
  module.setAttribute('id', 'onto_info')
  module.setAttribute('class', 'module')
  child = document.createElement('div')
  child.setAttribute('id', 'onto_info_body')
  child.setAttribute('class', 'bottom_window hide')

  // Name + Version
  child.innerHTML = '<div style="text-align:center; margin-bottom:10px;"><strong>Ontology Info</strong></div>' +
                    '<table class="details_table">' +
                    '<tr><th>Name</th><td>' + this.ontology.name + '</td></tr>' +
                    '<tr><th>Version</th><td>' + this.ontology.version + '</td></tr></table>'

  // Prefixes Definiton
  child.innerHTML += '<div class="table_header"><strong>IRI Prefixes Dictionary</strong></div>'

  aux = document.createElement('div')
  aux.setAttribute('id', 'prefixes_dict_list')
  var table = document.createElement('table')
  table.setAttribute('id', 'prefix_dict_table')

  this.ontology.iriSet.forEach(iri => {
    if (!iri.isStandard()) {
      var tr = document.createElement('tr')
      var prefix = document.createElement('th')
      var value = document.createElement('td')

      if (iri.isDefault()) { prefix.innerHTML = '<em>Default</em>' } else { prefix.innerHTML = iri.prefix }

      if (iri.isProject()) {
        value.classList.add('project_iri')
      }

      value.innerHTML = iri.value

      tr.appendChild(prefix)
      tr.appendChild(value)
      table.appendChild(tr)
    }
  })

  child.appendChild(table)

  module.appendChild(child)
  module.innerHTML += '<div onclick="toggle(this)" class="bottom_button" title="Info"><i alt="info" class="material-icons md-24"/>info_outline</i></div>'
  this.container.appendChild(module)

  var icons = document.getElementsByClassName('material-icons')
  for (i = 0; i < icons.length; i++) {
    icons[i].onselectstart = function () { return false }
  }
};
*/
