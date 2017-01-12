# Salesforce Predictive Vision, Image Identifier demo

Image classification with the [Salesforce Predictive Vision Service](http://docs.metamind.io/docs/what-is-the-predictive-vision-service).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/heroku/pvs-node/tree/use-addon)

## Selecting a Model

[Pre-built models](http://docs.metamind.io/docs/use-pre-built-models) are provided to get started quickly. The model IDs are:

* `GeneralImageClassifier`, the default for this app
* `FoodImageClassifier`

To set for an app:

✏️ *Replace each `$VARIABLE` in the following command with a specific value: the desired model ID & Heroku app name.*

```bash
heroku config:set PREDICTIVE_VISION_MODEL_ID=$MODEL_ID --app $APP_NAME
```

## Using a Custom Model

Once a Heroku app is deployed with the Predictive Services Add-on, use its credentials to create a custom model and upload training images.

1. Fetch your credentials from the app

  ✏️ *Replace `$APP_NAME` in the following commands with the unique name of the Heroku app w/ PVS Add-on.*

  ```bash
  heroku config --app $APP_NAME
  ```

  * Copy the value of `PREDICTIVE_SERVICES_ACCOUNT_ID`
  * Save the multi-line value of `PREDICTIVE_SERVICES_PRIVATE_KEY` into a local file
1. [Set-up authorization](http://docs.metamind.io/docs/set-up-auth)
  * Use the value of `PREDICTIVE_SERVICES_ACCOUNT_ID` for the `email_address`
  * Use the file path for `PREDICTIVE_SERVICES_PRIVATE_KEY` for the `key_file`
1. [Create & train the model](http://docs.metamind.io/docs/step-1-create-the-dataset)
1. Once trained, set the Heroku app to use the custom `$MODEL_ID`

  ```bash
  heroku config:set PREDICTIVE_VISION_MODEL_ID=$MODEL_ID --app $APP_NAME
  ```

## Sharing a Custom Model

Share an add-on containing custom-trained models between multiple apps by attaching the add-on:

```bash
# First, fetch the `predictive-services` add-on identifier from the original app.
heroku addons --app $APP_NAME

# Then, attach that add-on to another app.
heroku addons:attach $ADD_ON_IDENTIFIER --app $OTHER_APP_NAME

# Finally, set the custom model ID on the other app.
heroku config:set PREDICTIVE_VISION_MODEL_ID=$MODEL_ID --app $OTHER_APP_NAME
```

👓 **Background** When a Predictive Services add-on is created, it gets a new Predictive Services account. As custom models are created, they are scoped to that account. To share those models, you may attach the add-on to multiple apps.


## API Authentication

Predictive Services Add-on sets three configuration variables to gain full access to its API:

* `PREDICTIVE_SERVICES_URL`
* `PREDICTIVE_SERVICES_ACCOUNT_ID`
* `PREDICTIVE_SERVICES_PRIVATE_KEY`

The steps to access the API are:

1. Exchange a JWT for an expiring oAuth token
  * `${PREDICTIVE_SERVICES_URL}v1/oauth2/token`
  * payload includes `$PREDICTIVE_SERVICES_ACCOUNT_ID`
  * signed with `$PREDICTIVE_SERVICES_PRIVATE_KEY`
  * reference implementation in [lib/update-token.js](lib/update-token.js)
2. Make API requests using the acquired oAuth token
  * `${PREDICTIVE_SERVICES_URL}v1/vision/*`
  * request Header `Authorization: Bearer ${token}`
  * detect status `401` for expired token, and refresh with step 1.
  * reference implementation in [lib/query-vision-api.js](lib/query-vision-api.js)


## Source-based Deploy

Instead of using the Deploy to Heroku button, you may deploy your own forked/customized version of the source code.

✏️ *Replace `$APP_NAME` in the following commands with the unique name of your app.*

```
git clone https://github.com/heroku/pvs-node.git
cd pvs-node

heroku create $APP_NAME
heroku addons:create cloudinary
heroku addons:create predictive-services
git push heroku master

heroku open
```

The app will default to the General Image identification model supplied by the Predictive Vision Service. If you [create your own model](#using-a-custom-model) you can use it by setting the config var:

```
heroku config:set PREDICTIVE_VISION_MODEL_ID=$modelId
```


## Development

### Run the API server

The simplest way to work locally is to use the config vars of an existing Heroku app with the *Predictive Services Add-on*. Use the **Deploy to Heroku** button (above) to provision such a dev app.

✏️ *Then, replace `$APP_NAME` in the following commands with the name of that Predictive Services dev app.*

```bash
# Initial setup
npm install
heroku plugins:install heroku-run-localjs

# Start the server
heroku run:local npm start --app $APP_NAME
```


### Run the React UI

A React app with hot-reloading via [create-react-app](https://github.com/facebookincubator/create-react-app) is served from `react-ui/`; automatically proxies backend requests to the local Node server.

In a separate terminal from the API server, start the UI:

```bash
# Initial setup
npm install --prefix react-ui

# Start the server
npm start --prefix react-ui
```


### Testing

```bash
npm test
```


### Manual environment config

```bash
cp .env.sample .env
# Then, update the variables in `.env` with your values.

# Point this at your locally-saved private key.
export PREDICTIVE_SERVICES_PRIVATE_KEY=`cat path/to/private.key`

# Run the API server with those environment variables.
heroku local
```

If you provide a Private Key the app takes care of JWT authentication for you. If you don't provide a private key you must provide a token yourself as `PREDICTIVE_SERVICES_TOKEN`.

