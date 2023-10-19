docker build -t booth-ng .
docker run -d -p 4200:4200 --name booth-ng booth-ng
docker logs -f [containerId]