---
title: Xweeter App
description: A simple social media app built using Vue and Flask.
date: 2024-01-01
image: ./assets/overtime-system.png
categories: ['Vue', 'Flask', 'Web Development']
repo: https://github.com/mad4869/xweeter-app
---
## Background Scenario

A web developer has been instructed to create a social media platform that resembles Twitter but is simpler and more intuitive.

## Requirements

The social media app should have the following features:

1. User authentication
2. Users can add, edit, or delete a tweet.
3. Users can upload an image and attach it to a tweet.
4. Users can interact with other users' tweet, such as giving them a like.
5. Users can view the count of likes on each tweet.
6. Users can view a list that displays the most active users of the day.
7. The admin has a special access to the admin page.
8. There is a simple pagination feature to retrieve more tweets when necessary.

## Program Scheme

![A flowchart image that explains how the program runs](https://i.ibb.co/Lgsw3s8/user-journey-flowchart.jpg)

### START

1. Users create an account if they don't already have one, then log in.
2. Unauthenticated users can only view timeline that consists of tweets from all users.
3. Authenticated users can view a personalized timeline based on the users they already follow.
4. Authenticated users can send new tweets and also edit or delete existing tweets.
5. Authenticated users can interact with other users' tweets such as giving them a like.
6. All users can view the leaderboard that displays the most active users of the day.
7. Authenticated users with the admin role have special access to the admin page.

### END

## ERD

This app utilizes __PostgreSQL__ as the database service. The structure of the schema in the database is as follows:
![Entity Relationship Diagram](https://i.ibb.co/kDxhStx/erd.png)

## Installation

__Prerequisites:__

1. PostgreSQL
2. Minio (inside docker container)

### 1. Clone the repo

```bash
git clone https://github.com/mad4869/xweeter-app.git
```

### 2. Run Minio

```bash
docker run -p 9000:9000 -p 9090:9090 --name minio1 -e "MINIO_ROOT_USER=ROOTUSER" -e "MINIO_ROOT_PASSWORD=CHANGEME123" quay.io/minio/minio server /data --console-address ":9090"
```

Change the _Root User_ and the _Root Password_ as required. Access the console on port _9090_, log in using the username and password, and inside the dashboard, create an access and secret key.

### 3. Set up the enviromental variables

Create an `.env` file in the `server` directory and populate it with the necessary key-value pairs, similar to those in the `.env-sample` file. Replace the example variables with the corresponding actual values as required, including PostgreSQL configuration and the Minio access and secret key.

### 4. Create and activate a virtual environment

Windows

```bash
cd server
python -m venv venv
venv\Scripts\activate
```

Linux/MacOS

```bash
cd server
python3 -m venv venv
source venv/bin/activate
```

### 5. Install the dependencies

```bash
cd server
pip install -r requirements.txt

cd client
npm install
```

### 6. Connect to the database

```bash
cd server
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 7. Run the app

```bash
cd server
flask run

cd client
npm run dev
```

Access the app on port _5173_.

## Code Explanation

### 1. Backend

The backend is built using the __Flask__ framework to serve REST API to the clients through various endpoints. The entry point is `run.py` inside the `server` directory. The app utilizes several supporting libraries, including:

- `SQLAlchemy` for object-relational mapping (ORM).
- `Flask-Migrate` for managing database migrations.
- `Flask-Bcrypt` for generating password hashes.
- `Flask-JWT-Extended` for authentication and authorization using JSON Web Tokens (JWT).
- `Flask-Admin` for managing the admin page.
- `Flask-CORS` for setting the CORS configuration.
- `Minio Client` for connecting to Minio storage.

The actual app is located within the `app` module and includes the following directories:

- __routes:__ Handles the routes that serve the REST API. The list of API endpoints can be viewed [here.](https://documenter.getpostman.com/view/11633108/2s9YXe953W)
- __models:__ Defines all the objects that will be mapped to the database.
- __utils:__ Contains utility modules for managing files.
- __static:__ Contains the CSS file for the admin page.
- __templates:__ Contains the template for the admin page.

### 2. Frontend

The frontend is built using __Vite__ and utilizes __Vue__ as the Javascript/Typescript framework and __Tailwind CSS__ as the CSS framework. It is located inside the `client` directory. The `src` includes the following directories:

- __assets:__ Contains all the static assets, such as pictures.
- __components:__ The main directory where all the components that compose the app are located.
- __composables:__ Contains various reusable functions.
- __pages:__ Contains the page components that serve each route.
- __routes:__ Defines all the routes within the app.
- __stores:__ Contains the stores for managing global state.
- __types:__ Defines all the object types for static type checking.
- __utils:__ Contains utility objects that do not belong to the previous directories.

## Test Case

### 1. User authentication

![User login](https://i.ibb.co/w7yDwwD/login.png)
![User login successfully](https://i.ibb.co/wdpj8rf/login-success.png)

### 2. Send a new tweet

![Send a tweet](https://i.ibb.co/5xqDTFn/new-xweet.png)
![Send a tweet from modal](https://i.ibb.co/j6203pp/new-xweet-modal.png)
![Send a tweet successfully](https://i.ibb.co/7KyB6CQ/new-xweet-successful.png)

### 3. Edit a tweet

![Edit a tweet](https://i.ibb.co/rkdcq1h/edit-xweet.png)
![Show the tweet editor](https://i.ibb.co/GJqG1xW/edit-xweet-editor.png)
![Edit a tweet successfully](https://i.ibb.co/vHB9xzL/edit-xweet-success.png)
![The tweet that has been edited](https://i.ibb.co/hZ1X0nT/edited-xweet.png)

### 4. Delete a tweet

![Delete a tweet](https://i.ibb.co/yVXc1ck/delete-xweet.png)
![Show the delete modal](https://i.ibb.co/C9Zt6SM/delete-xweet-modal.png)
![Delete a task successfully](https://i.ibb.co/TWH6Tzg/delete-xweet-success.png)

### 5. Upload an image and attach it to a tweet

![Send a tweet with picture](https://i.ibb.co/K5yBnPX/upload-image.png)
![Send a tweet with picture successfully](https://i.ibb.co/qRWt89T/upload-image-success.png)

### 6. Like a tweet and view the count of the likes

![Like a tweet](https://i.ibb.co/BfdNDwP/like-xweet.png)
![Like a tweet successfully and view the count increases](https://i.ibb.co/MfHLFWs/like-xweet-success.png)

### 7. Leaderboard for most active users

![Leaderboard](https://i.ibb.co/3Bpkfrj/leaderboard.png)

### 8. Admin page for user with admin role

![Admin page](https://i.ibb.co/DM0xSPM/admin-page.png)

### 9. Retrieve more tweets when necessary

![More tweets](https://i.ibb.co/RjJxv6W/more-xweet.png)
![More tweets loaded](https://i.ibb.co/mJ67svL/more-xweet-success.png)

## Conclusion

This is a simple Twitter-like social media app that enables users to create their own posts and interact with others. There are still some minor bugs that need to be cleaned up to make a better user experience, but overall this app already meets all the requirements for a functional social media platform.
