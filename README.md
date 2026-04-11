# SQUAD GOALS

## Introduction

In the spirit of a CRM (Customer Relationship Management) app, Squad Goals seeks to help you manage and improve your personal relationships. Using this app in tandem with your existing messaging and social media, you may find that social media can finally be "social" again.

## Features

- User sessions: sign up, log in, personalized profile page
- Organizing info and memo history of your contacts and recent interactions
- Algorithmically suggested "missions" to remind you to reach out
- Mission timer to help you focus and avoid the trap of inifinite scrolling
- Relationship evaluation questions to rank and prioritize healthy relationships that enrich your life the most
- Mini articles to spark better communication

## Local Setup

Install all the dependencies or node packages used for development via Terminal
`npm install`

Run
`npm start`

---

## Things to add

- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = 2121 (can be any port example: 3000)
  - DB_STRING = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`

---

## Packages/Dependencies used

- bcrypt - hashing/salting/encrypting in order to not have plain text passwords stored in the database
- cloudinary - upload and serve media (used for storing post images)
- connect-mongo - helps with session storage in the database
- dotenv - to use environment variable files
- ejs - templating for rendering dynamic data to html
- express - node framework for easier setup
- express-flash - flash messages without request redirection (error messaging for forms)
- express-session - using cookies along with the db to keep track of logged in users
- method-override - override the default browser form methods of GET and POST to do be able to use DELETE and PUT
- moment - format dates to be more readable to users
- mongodb - to connect to mongo database
- mongoose - easily set up schemas for data being sent and stored in mongodb
- morgan - logging activity in the console
- multer - handles file uploads in forms and makes them accessible in routes
- nodemon - auto restart server after changes
- passport - strategies for authentication
- passport-local - allow user to make an account with sign in data instead of a different strategy
- validator - checks validity of strings to make sure user will enter the required data

---
