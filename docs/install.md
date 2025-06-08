# Install

UAR is distributed as a Linux container. It listens on port 8080, but like any other container, it can run on any host port, in the example the port is 1337;

## Docker Compose

```yaml
services:
  uar:
    container_name: uar
    image: ghcr.io/jamesread/uncomplicated-alert-receiver:1.2.0
    ports:
      - "6337:8080"
```

## Docker (standalone)

```
docker run -p 1337:8080 --name uar ghcr.io/jamesread/uncomplicated-alert-receiver
```

Once you have got the container up and running you can access the web interface at `http://yourServer:1337/` (or whatever port you have chosen).

## Next steps

The next step is to configure your alertmanager to send alerts to UAR.

* [Setup Alertmanager](setup.md)
