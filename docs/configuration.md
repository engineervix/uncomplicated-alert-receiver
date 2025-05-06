# Configuration

UAR is designed so that it very much works "out of the box" and with zero configuration. However, it's entirely possible that people might want to tweak things, so there are some configuration options provided.

## Configuration options

### `ALERTMANAGER_HOST` Environment Variable

This is the browser URL to get to alertmanager. If you set this, alert links will be clickable. eg: `https://am.webapps.example.com`.

### `SEV_LABELS_...` Environment Variables

The default severity labels are;

* `SEV_LABELS_1`: crit,critical
* `SEV_LABELS_2`: severe
* `SEV_LABELS_3`: warning
* `SEV_LABELS_4`: important
* `SEV_LABELS_5`: info,information
