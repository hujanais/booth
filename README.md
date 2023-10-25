## Booth-Chat : A full-stack chat-room app hackathon

## Goal
Build a Robust Multi-Tenant Node.js Server Application using modern web technologies.  The focus is really on the server-side application.
 - Express web framework using Typescript
 - SQLite database with raw SQL
 - Asynchronous REST APIs
 - Use of middleware for JWT token authentication. No framework is used
 - WebSocket (socket.io) for push notifications
 - Proper error handling to make server production hardened
 - Docker and Nginx
 - Cloud deploy to Heroku and Vercel
 - Interaction using a React-UI frontend
## Server requirements for multi-tenant chat room
 - Ability to register new users
 - Create/delete rooms
 - Join/leave rooms
 - Broadcast messages within rooms
 - Message history persistence
 - Recover state from database on restart
 - Support users joining from multiple devices.
 ## Architecture
 ![Architecture-image](./booth-arch.png =320x160)
 ## Demo/Deployment
 1.	The NodeJS application is deployed on Heroku using docker.  I used the same port for both http and websocket because I don't know how to set multiple ports for Heroku.
 2.	The React front-end is deployed on Vercel.

You can find the react front-end demo site at [booth-react.vercel.app](https://booth-react.vercel.app/)

 
