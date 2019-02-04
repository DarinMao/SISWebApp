# SISWebApp

A custom FCPS StudentVUE client written in Vue.js

## Features

These features are fully implemented but may be extended in the future

* Student information
* Class schedule
* Health information

These features are in development

* Gradebook

These features are not implemented yet

* Calendar
* Attendance

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for instructions on how to deploy the project on a live system.

### Prerequisites

SISWebApp runs on Vue.js with npm as the package manager. As such, you will need to download and install npm.

With npm installed, install Vue CLI.
```
npm install -g @vue/cli
```

### Installing

First, clone the repository.
```
git clone https://github.com/DarinMao/SISWebApp
```

Next, run `npm install`
```
cd SISWebApp
npm install
```

Wait for all packages to install.

## Running the Testing Server

You can either run the testing server through Vue CLI or through Vue UI.

With Vue CLI, `cd` to the project directory and run `npm run serve`

With Vue UI, first run `vue ui` to start the Vue UI server. Next, import the project through the project manager. Click the "Tasks" tab on the left side, go to "serve", and click "Run task".

## Deployment

You can build the app for production through Vue CLI or through Vue UI.

With Vue CLI, `cd` to the project directory and run `npm run build`.

With Vue UI, use the same instructions as above for running the testing server, but run the "build" task instead.

Both of these methods will compile the files into static assets in the dist/ directory. Deploy this folder's contents to a live web server.

## Authors

* Darin Mao - Main developer

## Acknowledgements

* Omkar Kulkarni for his [Python SIS API](https://github.com/ovkulkarni/sis-api) which helped initial development of the JavaScript API
* Ryan Kim, Alexander Suh for early testing and feedback (without asking if this was a phishing scam)
