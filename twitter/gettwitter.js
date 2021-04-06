// Global vars
let response;
const axios = require('axios')

exports.lambdaHandler = async (event, context) => {
    
    // Vars
    let username = event.queryStringParameters.username;
    let userId = null;
    let result = '';

    /*
    * Call the async function to get the username id from twetter
    */
    let dataUserName = await retriveDataFromAPI(`/users/by/username/${username}`);

    /*
    * If the result has an error, then return 
    * in messages with the detailed error
    * If the result doesn't have an error, get the user id
    */
    if(dataUserName.error == false){
        userId = dataUserName.result.id;

        /*
        * Call the async function to get the tweets form the user id
        */
        let dataTweets = await retriveDataFromAPI(`/users/${userId}/tweets`);
        
        // Object with the tweets results
        result = {
            error: false,
            result: dataTweets.result
        }
    } else {
        // Object with the error
        result = {
            error: true,
            messageError: dataUserName.messageError
        }
    }
    
    /*
    * Retrun the response with the result
    */
    return response = {
        'statusCode': 200,
        'body': JSON.stringify(result)
    }
};


async function retriveDataFromAPI(url){
    // vars
    let error = false;
    let messageError = "";
    let result = "";
    let errorsDetailed = [];
    const bearerToken = process.env.twitterBearerToken;
    const twitterEndPoint = process.env.twitterEndPoint;

    // Try catch statement
    try {
        /*
        * Use of the axio to get the Twetter API Response
        * Autorization Bearer in the header
        */
        response = await axios.get(
            twitterEndPoint + url,
            {
                headers: { Authorization:  `Bearer ${bearerToken}`}
            }
        );
        
        /*
        * If the response has error
        * all errors are captured with a loop
        */
        if(response.data.errors){
            response.data.errors.forEach(element => {
                errorsDetailed.push(element.detail);
            });
            error = true;
            messageError = errorsDetailed;
        } else {

            // The data is saved in the result var
            result = response.data.data;
        }
    } catch (error) {
        /*
        * Handle the error
        */
        error = true;
        messageError = "Internal Server Error";
    }

    /*
    * Retrun the result 
    */
    return {
        error: error,
        messageError: messageError,
        result: result
    }
}