import '@/apps/shared/core/settings/main.setup'
import logger from 'js-logger'

import browserStorage from '@/apps/shared/tools/storage'

import { gcSelectors } from '@/apps/shared/extras/gc/tools/selectors'
import { userAPI } from '@/apps/shared/extras/gc/api'
import { gcAssetsUrls, gcUrls } from '@/apps/shared/extras/gc/api/resources/urls'

import checkGCSelectors from '@/apps/shared/tools/health/checkGCSelectors'

window.myWorktime = {
  provider: {
    selectors: gcSelectors,
    api: {
      user: userAPI,
      resources: {
        urls: gcUrls,
        assets: gcAssetsUrls
      },
    },
  },
  api: {
    logger,
    browserStorage,
    health: {
      checkGCSelectors
    },
  }
}

