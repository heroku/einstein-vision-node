# Metamind Image Identifier
Predictive Vision with [Salesforce Metamind](http://metamind.io).

🚧🚧🚧 **This is a work in progress. Things are changing quickly.**

## Prerequisites ##

To use this app you will need either:

* a Metamind account ID and a JWT private key, or
* a JWT token (see: [API docs](http://docs.metamind.io/docs/what-you-need-to-call-api))

## Setup ##

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Manual Setup ##

Note:
* `$app` represents your chosen name for your heroku metamind app.
* `$metamind_account_id` represents your metamind email.
* `$metamind_private_key` represents your metamind rsa private key.

```
git clone https://github.com/trevorscott/metamind-image-identifier.git 

cd metamind-image-identifier

heroku create $app
heroku addons:create cloudinary:starter
heroku config:set METAMIND_ACCOUNT_ID=$metamind_account_id
heroku config:set METAMIND_PRIVATE_KEY=$metamind_private_key
```

If you would like to override the default functionality of the app and set your own token you can do so by simply setting the config var:

```
heroku config:set METAMIND_TOKEN=$metamind_token
```

The app will default to the General Image identification model supplied by Salesforce Metamind. If you create your own model you can use it by setting the config var:

```
heroku config:set METAMIND_MODEL_ID=$modelId
```

## Development

### Local environment

```bash
echo 'METAMIND_TOKEN=$jwt_token' > .env
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
