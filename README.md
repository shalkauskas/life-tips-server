# Life Pro Tips (server)

Life Pro Tips is a full-stack app inspired by a famous subreddit [/r/LifeProTips](https://www.reddit.com/r/LifeProTips/) featuring usefull life hacks and tips.

## [View Website](https://life-tips.shalkauskas.com/)

[![](https://res.cloudinary.com/dyj6lkekg/image/upload/c_scale,q_56,w_735/v1618511848/github/lpt.png)](https://life-tips.shalkauskas.com/)

## Features

- Create or like posts anonymously
- Register or login with Google
- **C**reate, **R**ead, **U**pdate or **D**elete posts
- Comment, like and share you favorites
- Change your name or profile picture in profile settings
- Search & sort to find what you like easier

LPT is a full-stack app, with this repository containing a back-end side built with Node/Express. The front end repo can be found [here.](https://github.com/shalkauskas/life-tips-frontend)

## Tech

### Back-end/Server

- [node.js](http://nodejs.org) - evented I/O for the backend
- [Express](http://expressjs.com) - fast node.js network app framework
- [MongoDB](https://www.mongodb.com/) - MongoDB Atlas - no-SQL Database for storing userdata and content
- [Mongoose](https://mongoosejs.com/) - elegant mongodb object modeling for node.js
- [Passport](http://www.passportjs.org/) - local and Google Auth

_Hosted on [Heroku](https://www.heroku.com/)_

### Front-end

- [React](https://reactjs.org/) - state management with Context API and useReducer
- [Axios](https://github.com/axios/axios) - API calls
- [Material-UI](https://material-ui.com/) - styling and UI.
- [Cloudinary](https://cloudinary.com/) - user profile picture upload storage

_Hosted on [Vercel](https://vercel.com/dashboard)_

## Installation

Installation guidelines for back-end only.
Front-end can be found in corresponding [repo](https://github.com/shalkauskas/life-tips-frontend).

1. Clone the repo
2. `npm install`
3. In root folder create a `.env` file and add your API keys

```
GOOGLE_CLIENT_ID = "google auth: found in you Google Cloud Console account"
GOOGLE_CLIENT_SECRET= "google auth: found in you Google Cloud Console account"
GOOGLE_CALLBACK_URL= "google auth: found in you Google Cloud Console account"
CORS_ORIGIN = "Front end adress for cors, default is http://localhost:8081 or wahtever port you specify in frontend .env file"
JWT_SECRET= "your secret (any string)"
SESSION_SECRET = "your secret  (any string)"
DB_URL="mongodb adress, Atlas example: mongodb+srv://DB_USERNAME:DB_PASSWORD@cluster0.ddb93.mongodb.net/YOUR_DB_NAME?retryWrites=true&w=majority"

ADMIN_ID = "database user id of user with admin priveleges: edit and delete any user post from dashboard (optional)"
```

4. Then
   `node server.js`

## Contribute

If you like this project and would like to contribute feel free to send a PR or simply add an issue with feature or bug fix request

## License

MIT
