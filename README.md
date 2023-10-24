[Slideshow](%3Ciframe%20src=%22https://docs.google.com/presentation/d/e/2PACX-1vQqJSGU58pxNDpSsdahUcRqfcF60IwiMWhqs_1TPYbmlezl8783APbvpD85r5ggPjO6ViTwEjh7LF_Z/embed?start=false&loop=false&delayms=3000%22%20frameborder=%220%22%20width=%22960%22%20height=%22569%22%20allowfullscreen=%22true%22%20mozallowfullscreen=%22true%22%20webkitallowfullscreen=%22true%22%3E%3C/iframe%3E)

# Booth-Chat

Booth-Chat is a hackathon to build a chat app to build a full-stack application from the ground up with minimal frameworks.  I chose this project because it encapsulates the basics of a cloud-based multi-tenant application.  This application focuses on the server and not the UI.  However, like all full-stack apps, a minimal front-end client is included to facilitate testing and usability.

# What I want to get out of this?

As a developer, most of the time we are siloed into certain aspects of projects and quickly get lost in the weeds of Jira tickets.  That is why most of us devs are salivating on prospects of greenfield opportunities.  Sometimes, to keep ourselves sharp and to maintain a system-level thinking and organization, you have to build your own projects from zero.  This makes me a better developer in coding and design.

# Tech overview

### Server
1.  The server is based on Node-Express in Typescript.
2.  The server uses a sqllite database for storing users and rooms.
3.  The server has a set of REST apis and websockets for real-time notifications.
4.  Initially I used raw websockets but decided to go back to socket.io but I do not use the room/session features in socket.io because I want to work on session management concepts by myself.
5.  I am using base JWT-tokens and encrypted passwords which are handled in a hand-rolled middleware.  I didn't use express-session-jwt just because I am more interested in practicing my own coding.

### Front-End prototype with Angular16
1.  The front-end is not the focus of this application.  I just built a simple front-end client to exercise the application using Angular-16.  I just chose Ng because that is just my web go-to framework.  I did try to make the UI look "decent" using Angular Material.

### React Front-End
1.  Like an itch that I need to scratch, I did a 1-day hackathon and built a React Front-End using MUI for styling.  Now the project feels completed.

# Usage

To run the project locally. 
```bash
# to run the server
# update the .env file in /booth-api
/booth-api/npm run dev

# to run the Ng front-end
# update the .environment.ts or .environment.prod.ts file in /booth-ng
# update the proxy.conf.json
/booth-ng/npm run start

```

# Docker Deployment
I have also create Dockerfile(s) for the booth-api server and booth-ng UI projects.  Currently, they pulling set for ARM processors because I was running and testing using my RaspberryPi.

### Some Docker tips
```bash
cd /booth-api
docker build -t booth-api .
docker run -d -p 3000:3000 -p3001:3001 --name booth-api booth-api
docker logs -f [containerId]

cd /booth-ng
docker build -t booth-ng .
docker run -d -p 4200:4200 --name booth-ng booth-ng
docker logs -f [containerId]
```
