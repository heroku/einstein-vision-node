# Einstein Vision<br/>Heroku Brand Recognition demo

This is the sample app from the blog post [Introducing the Einstein Vision 
Add-on for Image Recognition]().

Based on the general-purpose [Node.js example](https://github.com/heroku/einstein-vision-node).

## Training Walkthrough

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
  -F "path=https://marsikai.s3.amazonaws.com/Heroku-brand.zip" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Cache-Control: no-cache" \
  -H "Content-Type: multipart/form-data" \
  https://api.metamind.io/v1/vision/datasets/upload/sync
```

Sample response:

```json
{
  "id": 1000327,
  "name": "Heroku-brand",
  "createdAt": "2017-02-24T05:36:33.000+0000",
  "updatedAt": "2017-02-24T05:36:33.000+0000",
  "labelSummary": {
    "labels": [
      {
        "id": 4079,
        "datasetId": 1000327,
        "name": "Heroku-logo",
        "numExamples": 15
      },
      {
        "id": 4080,
        "datasetId": 1000327,
        "name": "Heroku-artwork",
        "numExamples": 19
      },
      {
        "id": 4081,
        "datasetId": 1000327,
        "name": "unknown",
        "numExamples": 22
      }
    ]
  },
  "totalExamples": 56,
  "totalLabels": 3,
  "available": true,
  "statusMsg": "SUCCEEDED",
  "object": "dataset"
}
```

✏️ *Note the returned dataset `"id"` to use in upcoming commands as `$DATASET_ID`.*

👓 *More about Einstein Vision [synchronous](https://metamind.readme.io/docs/create-a-dataset-zip-sync) and [asynchronous dataset upload](https://metamind.readme.io/docs/create-a-dataset-zip-async).*

### 4. Train the model

```bash
$ curl -X GET \
  -F "name=Heroku brand" \
  -F "datasetId=$DATASET_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Cache-Control: no-cache" \
  https://api.metamind.io/v1/vision/train
```

Sample response:

```json
{
  "datasetId": 1000327,
  "name": "Heroku brand",
  "status": "QUEUED",
  "progress": 0,
  "createdAt": "2017-02-24T05:30:08.000+0000",
  "updatedAt": "2017-02-24T05:30:08.000+0000",
  "learningRate": 0.001,
  "epochs": 3,
  "queuePosition": 1,
  "type": "image",
  "jobParams": null,
  "jobResults": null,
  "object": "training",
  "modelId": "YXYLHLXO2XFBWCKNAXJFWA5LLM"
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
  "datasetId": 1000325,
  "name": "Heroku brand",
  "status": "SUCCEEDED",
  "progress": 1,
  "createdAt": "2017-02-24T05:30:08.000+0000",
  "updatedAt": "2017-02-24T05:31:36.000+0000",
  "learningRate": 0.001,
  "epochs": 3,
  "type": "image",
  "jobParams": null,
  "jobResults": null,
  "object": "training",
  "modelId": "YXYLHLXO2XFBWCKNAXJFWA5LLM"
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
      1,1,1
    ],
    "labels": [
      "Heroku-logo",
      "Heroku-artwork",
      "unknown"
    ],
    "testAccuracy": 1,
    "trainingLoss": 0.0385,
    "confusionMatrix": [
      [1,0,0],
      [0,1,0],
      [0,0,1]
    ],
    "trainingAccuracy": 0.9819
  },
  "createdAt": "2017-02-24T05:31:35.000+0000",
  "id": "YXYLHLXO2XFBWCKNAXJFWA5LLM",
  "object": "metrics"
}
```

👓 *More about Einstein Vision [model metrics](https://metamind.readme.io/docs/get-model-metrics).*


## Query for predictions

Once training is complete, the new model will answer queries about images by URL reference or direct upload.

We'll use an unseen example image contained in this Github repo in `data/unseen`.

```bash
$ curl -X POST \
  -F "sampleContent=@./data/unseen/screen-shot-000.png" \
  -F "modelId=$MODEL_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Cache-Control: no-cache" \
  -H "Content-Type: multipart/form-data" \
  https://api.metamind.io/v1/vision/predict
```

Sample response:

```json
{
  "probabilities": [
    {
      "label": "Heroku-artwork",
      "probability": 0.77794427
    },
    {
      "label": "unknown",
      "probability": 0.22203164
    },
    {
      "label": "Heroku-logo",
      "probability": 2.4128907e-05
    }
  ],
  "object": "predictresponse"
}
```

👓 *More about Einstein Vision [prediction with an image file](https://metamind.readme.io/docs/prediction-with-image-file), [an image URL](https://metamind.readme.io/docs/prediction-with-image-url), and [base64 encoded image data](https://metamind.readme.io/docs/prediction-with-image-base64-string).*
