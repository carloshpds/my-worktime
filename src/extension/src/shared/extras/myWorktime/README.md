# Support in Production

### Logs

### Activate debug mode
```javascript
  const { logger } = window.gcChallenger.api
  logger.setLevel(logger.DEBUG)
```

### Activate debug mode for Intervals (like PreMatchCheck)
```javascript
  const { logger, browserStorage } = window.gcChallenger.api
  browserStorage.settings.options.enableIntervalDebugLogs = true
  logger.setLevel(logger.DEBUG)

```

## Health Check

### Full Scan
```javascript
const { checkGCSelectors } = window.gcChallenger.api.health
const { selectors }        = window.gcChallenger.gc
const { missing, found }   = checkGCSelectors(selectors)
```

### Specific Scan
```javascript
const { checkGCSelectors } = window.gcChallenger.api.health
const { selectors }        = window.gcChallenger.gc
const { missing, found }   = checkGCSelectors(selectors.lobbies)
```