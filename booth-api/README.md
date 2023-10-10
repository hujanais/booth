docker build -t booth-api .
docker run -d -p 3000:3000 -p3001:3001 --name booth-api booth-api
docker logs -f [containerId]