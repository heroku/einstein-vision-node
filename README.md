# Einstein Vision<br/>Heroku Brand Recognition demo

This is the sample app from the blog post [Introducing the Einstein Vision Add-on for Image Recognition](https://blog.heroku.com/einstein-vision-image-recognition).

Demo deployment at [heroku-recognizer.herokuapp.com](https://heroku-recognizer.herokuapp.com).

Based on the general-purpose [Einstein Vision Node.js example](https://github.com/heroku/einstein-vision-node).

## Training Walkthrough

🚦 Requirements:

* [Heroku](https://www.heroku.com/home)
  * [command-line tools (CLI)](https://toolbelt.heroku.com)
  * [a free account](https://signup.heroku.com)
* [curl](https://curl.haxx.se/docs/install.html)
  * open terminal and check if it's installed: `curl --version`

### 1. Deploy this app

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/heroku/einstein-vision-node/tree/heroku-recognizer)

This creates a new Heroku app including the [Einstein Vision add-on](https://elements.heroku.com/addons/einstein-vision).

✏️ *Note the app name for use in upcomings commands as `$APP_NAME`.*

### 2. Get access token

Once the Heroku app is deployed, use the app's credentials to generate an access token for the Einstein Vision API.

1. Fetch your credentials from the app

  ```bash
  heroku config --app $APP_NAME
  ```
1. [Generate an access token](https://api.metamind.io/token)
  * Use the value of `EINSTEIN_VISION_ACCOUNT_ID` for the **Account ID**
  * Use the complete multi-line value of `EINSTEIN_VISION_PRIVATE_KEY` for the **Private Key**
  * Set expiry to `10080` minutes (1-week)

✏️ *Note the new token value to use in upcoming commands for `$TOKEN`.*

👓 *More about [Einstein Vision authorization](http://docs.metamind.io/docs/set-up-auth).*

### 3. Upload the dataset

We'll use the Heroku brand example set hosted on S3.

```bash
$ curl -X POST \
  -F "path=https://einstein-vision.s3.amazonaws.com/heroku-recognizer/HerokuBrandDataset-002.zip" \
  -H "Authorization: Bearer $TOKEN" \
  https://api.metamind.io/v1/vision/datasets/upload/sync
```

Sample response:

```json
{
  "id": 1000517,
  "name": "HerokuBrandDataset-002",
  "createdAt": "2017-03-02T23:23:53.000+0000",
  "updatedAt": "2017-03-02T23:23:53.000+0000",
  "labelSummary": {
    "labels": [
      {
        "id": 5523,
        "datasetId": 1000517,
        "name": "Heroku Swag",
        "numExamples": 135
      },
      {
        "id": 5524,
        "datasetId": 1000517,
        "name": "Heroku Artwork",
        "numExamples": 52
      },
      {
        "id": 5525,
        "datasetId": 1000517,
        "name": "Heroku Logo",
        "numExamples": 45
      },
      {
        "id": 5526,
        "datasetId": 1000517,
        "name": "unknown",
        "numExamples": 139
      }
    ]
  },
  "totalExamples": 371,
  "totalLabels": 4,
  "available": true,
  "statusMsg": "SUCCEEDED",
  "object": "dataset"
}
```

✏️ *Note the returned dataset `"id"` to use in upcoming commands as `$DATASET_ID`.*

👓 *More about Einstein Vision [synchronous](https://metamind.readme.io/docs/create-a-dataset-zip-sync) and [asynchronous dataset upload](https://metamind.readme.io/docs/create-a-dataset-zip-async).*

### 4. Train the model

✏️ *Name the model by setting the `name=` parameter, `name=Heroku brand` in this example.*

```bash
$ curl -X POST \
  -F "name=Heroku brand" \
  -F "datasetId=$DATASET_ID" \
  -H "Authorization: Bearer $TOKEN" \
  https://api.metamind.io/v1/vision/train
```

Sample response:

```json
{
  "datasetId": 1000517,
  "datasetVersionId": 0,
  "name": "Heroku brand",
  "status": "QUEUED",
  "progress": 0,
  "createdAt": "2017-03-02T23:26:44.000+0000",
  "updatedAt": "2017-03-02T23:26:44.000+0000",
  "learningRate": 0.001,
  "epochs": 3,
  "queuePosition": 1,
  "type": "image",
  "jobParams": null,
  "jobResults": null,
  "object": "training",
  "modelId": "2PZ2U47YFR6P3NA2AZK2P7MW6Y"
}

```

✏️ *Note the returned `"modelId"` to use in upcoming commands as `$MODEL_ID`.*

👓 *More about Einstein Vision [training](https://metamind.readme.io/docs/train-a-dataset).*

### 5. Training status

```bash
$ curl -X GET  \
  -H "Authorization: Bearer $TOKEN" \
  -H "Cache-Control: no-cache" \
  https://api.metamind.io/v1/vision/train/$MODEL_ID
```

Sample response:

```json
{
  "datasetId": 1000517,
  "datasetVersionId": 183,
  "name": "Heroku brand",
  "status": "RUNNING",
  "progress": 0.67,
  "createdAt": "2017-03-02T23:26:44.000+0000",
  "updatedAt": "2017-03-02T23:27:54.000+0000",
  "learningRate": 0.001,
  "epochs": 3,
  "type": "image",
  "jobParams": null,
  "jobResults": null,
  "object": "training",
  "modelId": "2PZ2U47YFR6P3NA2AZK2P7MW6Y"
}
```

🚦 *Wait to proceed until `"status"` is `SUCCEEDED` for the model.*

👓 *More about Einstein Vision [training status](https://metamind.readme.io/docs/get-training-status).*


### 6. Inspect the model

Get metrics to understand the model's performance and plan improvements for the training dataset.

```bash
$ curl -X GET  \
  -H "Authorization: Bearer $TOKEN" \
  -H "Cache-Control: no-cache" \
  https://api.metamind.io/v1/vision/models/$MODEL_ID
```

Sample response:

```json
{
  "metricsData": {
    "f1": [
      0.9333333333333332,
      0.9090909090909092,
      0.8571428571428571,
      0.9230769230769232
    ],
    "labels": [
      "Heroku Swag",
      "Heroku Artwork",
      "Heroku Logo",
      "unknown"
    ],
    "testAccuracy": 0.9189,
    "trainingLoss": 0.3281,
    "confusionMatrix": [
      [14, 0, 1, 1],
      [ 0, 5, 0, 0],
      [ 0, 0, 3, 0],
      [ 0, 1, 0,12]
    ],
    "trainingAccuracy": 0.8755
  },
  "createdAt": "2017-03-02T23:28:18.000+0000",
  "id": "2PZ2U47YFR6P3NA2AZK2P7MW6Y",
  "object": "metrics"
}
```

👓 *More about Einstein Vision [model metrics](https://metamind.readme.io/docs/get-model-metrics).*


## Query for predictions

Once training is complete, the new model will answer queries about images by URL reference or direct upload.

### Web UI queries

Set your Heroku app to use this new model:

```bash
heroku config:set CUSTOM_MODEL_ID=$MODEL_ID
```

Then, open the web app in your browser to query with images:

```bash
heroku open
```

### Command-line queries

We'll query with an image contained in this Github repo in `data/unseen/` which was not in the training dataset.

```bash
$ curl -X POST \
  -F "sampleContent=@./data/unseen/screen-shot-000.png" \
  -F "modelId=$MODEL_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: multipart/form-data" \
  https://api.metamind.io/v1/vision/predict
```

Sample response:

```json
{
  "probabilities": [
    {
      "label": "Heroku Artwork",
      "probability": 0.53223926
    },
    {
      "label": "unknown",
      "probability": 0.46305126
    },
    {
      "label": "Heroku Swag",
      "probability": 0.0038324401
    },
    {
      "label": "Heroku Logo",
      "probability": 0.0008770062
    }
  ],
  "object": "predictresponse"
}
```

👓 *More about Einstein Vision [prediction with an image file](https://metamind.readme.io/docs/prediction-with-image-file), [an image URL](https://metamind.readme.io/docs/prediction-with-image-url), and [base64 encoded image data](https://metamind.readme.io/docs/prediction-with-image-base64-string).*
