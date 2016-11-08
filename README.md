# metamind-image-identifier
Heroku Node app - upload an image to Metamind. 

Clone or download then:

`npm install`

Generate a token here: http://docs.metamind.io/docs/what-you-need-to-call-api

Set the config var:

`METAMIND_TOKEN=<your_token>`

The app will default to the General Image identification model supplied by metamind. If you create your own model you can use it by setting the config var:

`METAMIND_MODEL=<your_modelID>`

