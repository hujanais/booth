### node-ts setup
```
npm init
npm i express dotenv ts-node cors
npm i -D typescript @types/express @types/node @types/cors nodemon
npx tsc --init

# edit tsconfig.json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "es6",                                 

    /* Modules */
    "module": "commonjs",
    "rootDir": "src",

    /* Emit */
    "sourceMap": true,
    "outDir": "dist",

    /* Interop Constraints */
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    /* Type Checking */
    "strict": true,
    /* Completeness */
    "skipLibCheck": true
  }
  ...
}

# update the package.json build scripts
{
"scripts": {
	"start": "ts-node src/app.ts",
	"dev": "nodemon src/app.ts",
	"build": "npx tsc",
}
... 
}
```

docker build -t booth-api .
docker run -d -p 3000:3000 -p3001:3001 --name booth-api booth-api
docker logs -f [containerId]

### Deploy to Heroku using Docker
Tips for using websocket on Heroku.  Use the same port for both HTTP and WS.

Login to Heroku
```
heroku login
```
Build a valid docker file locally
```
docker build -t booth-chat-api .
```
Log into Heroku Container
```
heroku container:login
```
[optional] create a new Heroku app if you didn't do it in the dashboard
```
heroku create booth-chat-api
```
Push docker image to Heroku
```
heroku container:push web -a booth-chat-api
```
Stand the server up
```
heroku container:release web -a my-nodejs-app
```
To deploy updates, rebuild and push the Docker image, then release it. Heroku will automatically re-deploy the new image.