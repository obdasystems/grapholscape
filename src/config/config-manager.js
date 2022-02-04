const NAMESPACE = 'obda-systems.grapholscape'
const namespacedKey = (key) => `${NAMESPACE}-${key}`
const valueToStore = (v) => JSON.stringify(v)
const valueFromStorage = (v) => JSON.parse(v)

/**
 * Load config from local storage
 */
export function loadConfig() {
  const config = {}
  const key = (key) => key.substring(NAMESPACE.length + 1)
  if (storageAvailable() && isAnySettingSaved()) {
    Object.keys(window.localStorage)
      .filter(k => k.startsWith(NAMESPACE)) // take only local storage items written by grapholscape
      .forEach(k => config[key(k)] = valueFromStorage(window.localStorage.getItem(k)))
  }

  return config
}

/**
 * Store a single setting in local storage
 * @param {string} k the key of the setting to store
 * @param {string} value the value of the setting to store
 */
export function storeConfigEntry(k, value) {
  if (storageAvailable())
    window.localStorage.setItem(namespacedKey(k), valueToStore(value))
}

function storageAvailable(type = 'localStorage') {
  var storage
  try {
    storage = window[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  }
  catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0)
  }
}

/**
 * @returns Whether there is any local storage in setting belonging to grapholscape
 */
function isAnySettingSaved() {
  if (storageAvailable()) {
    return Object.keys(window.localStorage).some(k => k.startsWith(NAMESPACE))
  }

  return false
}

export function clearLocalStorage() {
  Object.keys(window.localStorage)
    .filter( k => k.startsWith(NAMESPACE))
    .forEach(k => window.localStorage.removeItem(k))
}
