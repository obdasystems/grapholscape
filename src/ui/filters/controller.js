/**
 * @param {import('./index').default} filterComponent
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function (filterComponent, grapholscape) {
  filterComponent.filterList = grapholscape.filterList
  filterComponent.onFilterOn = (filterType) => {
    filterComponent.filterList[filterType].active = true
    onFilterToggle(filterType)
  }
  filterComponent.onFilterOff = (filterType) => {
    filterComponent.filterList[filterType].active = false
    onFilterToggle(filterType)
  }

  grapholscape.onFilter(_ => filterComponent.updateTogglesState())
  grapholscape.onUnfilter(_ => filterComponent.updateTogglesState())
  grapholscape.onRendererChange(() => filterComponent.requestUpdate())

  function onFilterToggle(type) {
    if (type == 'attributes' && !grapholscape.renderer.disabledFilters.includes('value_domain')) {
      filterComponent.filterList.value_domain.disabled = filterComponent.filterList.attributes.active
    }

    // if 'all' is toggled, it affect all other filters
    if (type == 'all') {
      Object.keys(filterComponent.filterList).map(key => {
        if (key != 'all' && !filterComponent.filterList[key].disbaled) {
          filterComponent.filterList[key].active = filterComponent.filterList.all.active

          /**
           * if the actual filter is value-domain it means it's not disabled (see previous if condition)
           * but when filter all is active, filter value-domain must be disabled, let's disable it.
           * Basically value-domain filter disabled state must be equal to the active state of the 
           * 'all' filter.
           */
          if (key == 'value_domain' && !grapholscape.renderer.disabledFilters.includes('value_domain'))
            filterComponent.filterList[key].disabled = filterComponent.filterList['all'].active

          executeFilter(key)
        }
      })
    } else if (!filterComponent.filterList[type].active && filterComponent.filterList.all.active) {
      // if one filter get deactivated while the 'all' filter is active
      // then make the 'all' toggle deactivated
      filterComponent.filterList.all.active = false
    }

    executeFilter(type)
    filterComponent.updateTogglesState()
  }

  function executeFilter(type) {
    if (filterComponent.filterList[type].active) {
      grapholscape.filter(type)
    } else {
      grapholscape.unfilter(type)
      // Re-Apply other active filters to resolve ambiguity
      applyActiveFilters()
    }
  }

  function applyActiveFilters() {
    Object.keys(filterComponent.filterList).map(key => {
      if (filterComponent.filterList[key].active)
        grapholscape.filter(filterComponent.filterList[key])
    })
  }
}