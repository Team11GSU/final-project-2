 
# Team 11 Final Project - Dynamico

## [Link to Dynamico](http://dynamico-2.herokuapp.com/)

## Introduction

The Dynamico webpage uses a combination of components from Flask backend and React frontend in order to deliver a real-time project management web application. The purpose of this project is to replace the overwhelming number of individual applications that we as students currently use when we are tasked with a group project. These including Discord, Google Drive, and GitHub to name a few. As such, our aim was to incorporate all of the functionality that these applications offer into one concise space for easier access and cooperation between group members. Dynamico is a platform that allows group members to communicate with each other, share files with one another and schedule deadlines either on a calendar or through a to-do list.

## Components/Tools Used To Create Dynamico
  
* __SocketIO__ - A library that allows for low-latency bidirectional communication between the client and the servers. This tool was used to implement Dynamico's chat feature, providing users a quick and easy space to communicate with each other

* __AWS S3__ - Amazon's Simple Storage Service provides object storage. Dynamico uses this service in order to store files for users to share and/or download from within their project group

* __FullCalendarIO [React]__ - A lightweight JavaScript library that allows developers to create flexible event calendars for their web applications. Dynamico utilizes this library to allow users to schedule events or deadlines and share it with their project members

* __Grommet__ - A React based framework that provides _accessibility, modularity, responsiveness, and theming_. A common tool used throughout Dynamico to provide a streamlined and friendly UI/UX

* __Flask Mail__ - Extension of Flask that provides developers with SMTP so that they may send messages from their applications. Dynamico utilizes this extention in order to send invites to projects created through the web application



  

## Prerequisites

*  `blinker`

*  `Flask`

*  `Flask-Dance`

*  `Flask-Login`

*  `Flask-Mail`

*  `Flask-SQLAlchemy`

*  `flask-socketio`

*  `python-dotenv`

*  `psycopg2-binary`

*  `gevent-websocket`

*  `testresources`

*  `google-api-python-client`

*  `google-auth-httplib2`

*  `google-auth-oauthlib`

*  `boto3`


## Running The Project Locally

1.  `pip install -r requirements.txt` (if flask is not installed)

2. From the AWS S3 console create a new bucket with public policies set. Makes sure that both Read and Write permission are granted for objects

3. Generate both an access key and a secret access key and add them to your `.env` file

4. Create a Google Mail account or choose a preexisting account and add the e-mail address and password to your `.env` file

5. Ensure that your `.env` file has the following variables:

* AWS_ACCESS_KEY_ID 

* AWS_SECRET_ACCESS_KEY

* CLIENT_ID

* CLIENT_SECRET

* SECRET_KEY

* DATABASE_URL

* MAIL_USERNAME

* MAIL_PASSWORD

4.  `npm ci`

5.  `npm run dev`

  
  
  

## Authors

*  **Dileep Reddy Pemmana**

*  **Nahid Hossain**

*  **Michael Hosein**

*  **Sijia Jiang**