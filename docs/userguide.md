# User Guide

When you have UAR installed, you will see a header that looks like this. The header has a couple of components;

![header](header.png)

- **Time Until Next Refresh** (Progress Bar): By default, UAR will refresh every 30 seconds. The process bar will show the time until the next refresh. It's useful to see this on heads up displays, as they can lock up, or get screen-freeze, and this progress bar proves the page has not frozen.

- **Time since last Alertreceiver Payload**: This shows the number of seconds (or minutes, hours, days) since the last payload was received. This is useful to see if the payload is being received at all, or if your Alertmanager may be having issues.
