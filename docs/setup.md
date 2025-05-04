## Setup Alertmanager

You should already have a prometheus running, as well as an alertmanager running, with at least one alert configured.

Simply, edit your alertmanager.yml to add UAR as a webhook_config. Here is an example, assuming UAR is running at yourServer:8080;

```yaml
receivers:
  - name: uar
    webhook_configs:
      - url: http://yourServer:8080/alerts
        send_resolved: false

route:
  receiver: uar
  repeat_interval: 30s
  group_interval: 30s
```

Of course you are free to set the sending intervals to a duration that fits you.

## Next steps

UAR is very easy to understand and use, but for the next steps, you can check out the following;

* [User Guide](userguide.md)
* [Configuration](configuration.md)
