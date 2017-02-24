# Einstein Vision<br/>Image Recognition demo [![Build Status](https://travis-ci.com/heroku/einstein-vision-node.svg?token=fjyAVgyXed9CuzyfbQus&branch=master)](https://travis-ci.com/heroku/einstein-vision-node)

This Node.js sample app lets you upload an image to get predictions from Salesforce [Einstein Vision](http://docs.metamind.io/docs/what-is-the-predictive-vision-service) general classifier using the [Add-on](https://elements.heroku.com/addons/einstein-vision).

When deploying this app, a new Einstein Vision add-on will be created which includes an Einstein Vision account.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/heroku/einstein-vision-node)

## Select a Model

[Pre-built models](http://docs.metamind.io/docs/use-pre-built-models) let you get started quickly with the service. You can use these models instead of creating your own custom model. When you call the service, you pass in the ID of the model. The model IDs are:

* `GeneralImageClassifier` (default for this app)
  * identify a variety of images
  * contains thousands of labels
* `FoodImageClassifier`
  * identify different foods
  * contains over 500 labels.

To set the model ID for an app:

✏️ *Replace each `$VARIABLE` in the following command with a specific value: the desired model ID and the Heroku app name.*

```bash
heroku config:set CUSTOM_MODEL_ID=$MODEL_ID --app $APP_NAME
```

## Create a Custom Model

Once a Heroku app is deployed with the Einstein Vision add-on, use the app credentials to create a custom model and upload training images.

1. Fetch your credentials from the app

  ✏️ *Replace `$APP_NAME` in the following commands with the unique name of the Heroku app w/ Einstein Vision Add-on.*

  ```bash
  heroku config --app $APP_NAME
  ```
1. [Set-up authorization](http://docs.metamind.io/docs/set-up-auth)
  * Use the value of `EINSTEIN_VISION_ACCOUNT_ID` for the **Account ID**
  * Use the complete multi-line value of `EINSTEIN_VISION_PRIVATE_KEY` for the **Private Key**
1. [Create & train the model](http://docs.metamind.io/docs/step-1-create-the-dataset)
1. Once trained, set the Heroku app to use its `modelId`

  ```bash
  heroku config:set CUSTOM_MODEL_ID=$MODEL_ID --app $APP_NAME
  ```

## Share a Custom Model

Share an add-on containing custom-trained models between multiple apps by attaching the add-on to each app:

```bash
# First, fetch the `einstein-vision` add-on identifier from the original app.
heroku addons --app $APP_NAME

# Then, attach that add-on to another app.
heroku addons:attach $ADD_ON_IDENTIFIER --app $OTHER_APP_NAME

# Finally, set the custom model ID on the other app.
heroku config:set CUSTOM_MODEL_ID=$MODEL_ID --app $OTHER_APP_NAME
```

👓 **Background** When a Einstein Vision add-on is created, it gets a new Einstein Vision account. As custom models are created, they are scoped to that account. To share those models, you may attach the add-on to multiple apps.


## API Authentication

The Einstein Vision add-on sets three configuration variables to provide full access to its API:

* `EINSTEIN_VISION_URL`—The API endpoint.
* `EINSTEIN_VISION_ACCOUNT_ID`—Your account ID.
* `EINSTEIN_VISION_PRIVATE_KEY`—An RSA key in PEM format.

The steps this app uses to access the API are:

1. **Exchange a JWT for an expiring access token**
  * implemented in [lib/update-token.js](lib/update-token.js)
  * endpoint `${EINSTEIN_VISION_URL}v1/oauth2/token`
  * payload includes `$EINSTEIN_VISION_ACCOUNT_ID`
  * signed with `$EINSTEIN_VISION_PRIVATE_KEY`  
2. **Make API requests using the acquired access token**
  * implementated in [lib/query-vision-api.js](lib/query-vision-api.js)
  * endpoints `${EINSTEIN_VISION_URL}v1/vision/*`
  * request Header `Authorization: Bearer ${token}`
3. **Auto-refresh the access token, when it expires**
  * implementated in [lib/query-vision-api.js](lib/query-vision-api.js)
  * detects status `401` for expired token, and refresh with step 1.

👓 For more details see [Einstein Vision authorization](https://devcenter.heroku.com/articles/einstein-vision?preview=1#einstein-vision-authorization).

## Source-Based Deploy

Instead of using the Deploy to Heroku button, you may deploy your own forked/customized version of the source code.

✏️ *Replace `$APP_NAME` in the following commands with the unique name of your app.*

```
git clone https://github.com/heroku/einstein-vision-node.git
cd einstein-vision-node

heroku create $APP_NAME
heroku addons:create cloudinary
heroku addons:create einstein-vision
git push heroku master

heroku open
```

The app defaults to the General Image identification model supplied by the Einstein Vision. If you [create your own model](#using-a-custom-model) you can use it by setting the config var:

```
heroku config:set CUSTOM_MODEL_ID=$modelId
```


## Development

### Run the API Server

The simplest way to work locally is to use the config vars of an existing Heroku app with the *Einstein Vision Add-on*. Use the **Deploy to Heroku** button (above) to provision such a dev app.

✏️ *Then, replace `$APP_NAME` in the following commands with the name of that Einstein Vision dev app.*

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


### Manual Environment Config

```bash
cp .env.sample .env
# Then, update the variables in `.env` with your values.

# Point this at your locally-saved private key.
export EINSTEIN_VISION_PRIVATE_KEY=`cat path/to/private.key`

# Run the API server with those environment variables.
heroku local
```

If you a private key is not provided, an access token may be explicitly set as `EINSTEIN_VISION_TOKEN`.

