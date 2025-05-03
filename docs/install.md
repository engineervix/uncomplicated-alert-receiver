# Install

UAR is distributed as a Linux container. It listens on port 8080, but like any other container, it can run on any host port, in the example the port is 1337;

```
docker run -p 1337:8080 --name uar ghcr.io/jamesread/uncomplicated-alert-receiver
```
