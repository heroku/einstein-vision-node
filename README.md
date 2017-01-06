# Salesforce Predictive Vision Image Identifier
Image Classification with the [Salesforce Predictive Vision API](http://metamind.io).

🚧🚧🚧 **This is a work in progress. Things are changing quickly.**

## Prerequisites ##

To use this app you will need either:

* a Salesforce Predictive Vision Service account ID and a JWT private key, or
* a JWT token (see: [API docs](http://docs.metamind.io/docs/what-you-need-to-call-api))

## Setup ##

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Manual Setup ##

```
git clone https://github.com/heroku/pvs-node.git

cd pvs-node

heroku create $app_name
heroku addons:create cloudinary:starter
heroku config:set PREDICTIVE_SERVICES_ACCOUNT_ID=$PREDICTIVE_SERVICES_ACCOUNT_ID
heroku config:set PREDICTIVE_SERVICES_PRIVATE_KEY=$PREDICTIVE_SERVICES_PRIVATE_KEY
```

If you provide an RSA Private Key the app takes care of authentication for you. If you don't proivde a private key you must provide a token yourself:

```
heroku config:set PREDICTIVE_SERVICES_TOKEN=$PREDICTIVE_SERVICES_TOKEN
```

The app will default to the General Image identification model supplied by the Predictive Vision Service. If you create your own model you can use it by setting the config var:

```
heroku config:set PREDICTIVE_VISION_MODEL_ID=$modelId
```

## Development

### Local environment

```bash
echo 'PREDICTIVE_SERVICES_TOKEN=$jwt_token' > .env
```
or
```
export PREDICTIVE_SERVICES_PRIVATE_KEY=$jwt_private_key
```

### Dependencies

```bash
npm install
npm install --prefix react-ui
```

### Run the Node server

```bash
heroku local
```

### Run the React UI

React app with hot-reloading via [create-react-app](https://github.com/facebookincubator/create-react-app) is served from `react-ui/`; automatically proxies backend requests to the local Node server.

```bash
npm start --prefix react-ui
```

…and in a separate terminal, start the API server:

```bash
heroku local
```
