let response;
const axios = require('axios')

exports.lambdaHandler = async (event, context) => {
    
    let username = event.queryStringParameters.username;
    let userId = null;
    let result = '';

    let dataUserName = await retriveDataFromAPI(`/users/by/username/${username}`);
    
    if(dataUserName.error == false){
        userId = dataUserName.result.id;
        let dataTweets = await retriveDataFromAPI(`/users/${userId}/tweets`);
        
        result = {
            error: false,
            result: dataTweets.result
        }
    } else {
        result = {
            error: true,
            messageError: dataUserName.messageError
        }
    }
    
    return response = {
        'statusCode': 200,
        'body': JSON.stringify(result)
    }
};


async function retriveDataFromAPI(url){
    let error = false;
    let messageError = "";
    let result = "";
    let errorsDetailed = [];
    const bearerToken = process.env.twitterBearerToken;
    const twitterEndPoint = process.env.twitterEndPoint;

    try {
        response = await axios.get(
            twitterEndPoint + url,
            {
                headers: { Authorization:  `Bearer ${bearerToken}`}
            }
        );
        
        if(response.data.errors){
            response.data.errors.forEach(element => {
                errorsDetailed.push(element.detail);
            });
            error = true;
            messageError = errorsDetailed;
        } else {
            result = response.data.data;
        }
    } catch (error) {
        console.log(error)
        error = true;
        messageError = "Internal Server Error";
    }

    return {
        error: error,
        messageError: messageError,
        result: result
    }
}