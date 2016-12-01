# MetaMind Image Identifier
Predictive Vision with [Salesforce Metamind](http://metamind.io).

🚧🚧🚧 **This is a work in progress. Things are changing quickly.**

## Prerequisites ##

To use this app you will need either:

* a MetaMind account ID and a JWT private key, or
* a JWT token (see: [API docs](http://docs.metamind.io/docs/what-you-need-to-call-api))

## Setup ##

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Manual Setup ##

```
git clone https://github.com/heroku/metamind-image-identifier.git

cd metamind-image-identifier

heroku create $app_name
heroku addons:create cloudinary:starter
heroku config:set METAMIND_ACCOUNT_ID=$metamind_account_id
heroku config:set METAMIND_PRIVATE_KEY=$metamind_private_key
```

If you provide an RSA Private Key the app takes care of authentication for you. If you don't proivde a private key you must provide a token yourself:

```
heroku config:set METAMIND_TOKEN=$metamind_token
```

The app will default to the General Image identification model supplied by Salesforce MetaMind. If you create your own model you can use it by setting the config var:

```
heroku config:set METAMIND_MODEL_ID=$modelId
```

## Development

### Local environment

```bash
echo 'METAMIND_TOKEN=$jwt_token' > .env
```
or
```
export METAMIND_PRIVATE_KEY=$jwt_private_key
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
