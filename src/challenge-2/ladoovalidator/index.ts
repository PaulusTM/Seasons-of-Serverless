import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { PredictionAPIClient } from "@azure/cognitiveservices-customvision-prediction"
import { ApiKeyCredentials } from "@azure/ms-rest-js"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    context.log('HTTP trigger Ladoos Classifier started.');

    if (!req.body || !req.body.url) {

        let result = { error: "Pass an image URL in the JSON body of your request" }

        context.res = {
            "status": 400,
            "body": JSON.stringify(result),
            "headers": {
                'Content-Type': 'application/json'
            }
        }

    } else {

        const payloadUrl = req.body.url

        const predictorCredentials = new ApiKeyCredentials({ inHeader: { "Prediction-key": process.env["predictionKey"] } })
        const predictor = new PredictionAPIClient(predictorCredentials, process.env["endPoint"])

        let results = await predictor.classifyImageUrl(process.env["projectID"], process.env["publishIterationName"], { "url": payloadUrl })

        context.res = {
            "status": 200,
            "body": results.predictions,
            "headers": {
                'Content-Type': 'application/json'
            }
        }
    }

};

export default httpTrigger;