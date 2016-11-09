# metamind-image-identifier
Image Classification with Salesforce Metamind.

## Setup ##

Sign up for a Salesforce Metamind account and generate a JWT token:

http://docs.metamind.io/docs/what-you-need-to-call-api

Once you have a JWT token use the button below to deploy your app to Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Manual Setup ##

Note:
* `$app` represents your chosen name for your heroku metamind app.
* `$jwt_token` represents your jwt token you generated above. 

```
git clone https://github.com/trevorscott/metamind-image-identifier.git 

cd metamind-image-identifier

heroku create $app
heroku addons:create cloudinary:starter
heroku config:set METAMIND_TOKEN=$jwt_token
```

The app will default to the General Image identification model supplied by Salesforce Metamind. If you create your own model you can use it by setting the config var:

```
heroku config:set METAMIND_MODELID=<your_modelID>
```
