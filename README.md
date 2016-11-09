# metamind-image-identifier
Image Classification with Salesforce Metamind.

## Setup ##

Sign up for a Salesforce Metamind account and generate a JWT token:

http://docs.metamind.io/docs/what-you-need-to-call-api

Once you have a JWT token use the button below to deploy or follow instructions to set deploy manually.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Manual Setup ##

Clone or download this repo and then:

```
npm install
```

Set the config var:

```
heroku config:set -a <$appName> METAMIND_TOKEN=<your_jwt_token>
```

The app will default to the General Image identification model supplied by metamind. If you create your own model you can use it by setting the config var:

```
heroku config:set -a <$appName> METAMIND_MODEL=<your_modelID>
```

### Images ###
Image resizing is handled by Cloudinary. 

```
heroku addons:create -a <appname> cloudinary
```

Image uploading implemented with Dropzone.js


## Run Locally

```
heroku local
```

Defaults to localhost:5000
