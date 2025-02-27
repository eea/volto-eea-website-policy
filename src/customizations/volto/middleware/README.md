### Refs #283616 customized `blacklistRoutes` to: 
- Redirects to /en/resolveuid/ when /resolveuid/ is visited
- Replace window location only when route match doesn't come from a regex
  to properly handle urls hitting notInEn regex without an endless loop