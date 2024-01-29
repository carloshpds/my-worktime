# Support in Production

### Logs

### Activate debug mode
```javascript
  const { logger } = window.myWorktime.api
  logger.setLevel(logger.DEBUG)
```

### Activate debug mode for Intervals (like PreMatchCheck)
```javascript
  const { logger, browserStorage } = window.myWorktime.api
  browserStorage.settings.options.enableIntervalDebugLogs = true
  logger.setLevel(logger.DEBUG)

```

## Health Check

### Full Scan
```javascript
const { checkGCSelectors } = window.myWorktime.api.health
const { selectors }        = window.myWorktime.gc
const { missing, found }   = checkGCSelectors(selectors)
```

### Specific Scan
```javascript
const { checkGCSelectors } = window.myWorktime.api.health
const { selectors }        = window.myWorktime.gc
const { missing, found }   = checkGCSelectors(selectors.lobbies)
```