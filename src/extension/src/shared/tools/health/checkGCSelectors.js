/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */

import Logger from "js-logger"
import $ from 'jquery'

let missingElements = []
let foundElements = []

function checkSelectors(selectors, parentKey = '') {
  for (const key in selectors) {
    switch (typeof selectors[key]) {
      case 'object':
        checkSelectors(selectors[key], parentKey ? `${parentKey}.${key}` : key)
        break;
      case 'string':
        const $element = $(selectors[key])
        const result = {
          key,
          parentSelector: parentKey,
          selector: selectors[key],
          element: $element
        }

        if ($element?.length > 0) {
          foundElements.push(result)
        } else {
          missingElements.push(result)
        }
    }
  }
}

/**
 * @example const { missing, found } = checkMWSelectors(window.mw.ahgora.selectors.xpto)
 */
export default function checkMWSelectors(selectors, parentKey = '') {
  missingElements = []
  foundElements = []

  checkSelectors(selectors, parentKey)

  Logger.debug('🩺 [checkGCSelectors] 🟢 foundElements', foundElements.length, foundElements)
  Logger.debug('🩺 [checkGCSelectors] 🟡 missingElements', missingElements.length, missingElements)

  return {
    found: foundElements,
    missing: missingElements
  }
}