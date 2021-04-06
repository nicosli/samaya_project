// Global vars
let response;
const axios = require('axios')

exports.lambdaHandler = async (event, context) => {

    // Vars
    let result = '';
    let KEY = process.env.API_KEY;
    let SECRET = process.env.API_KEY_SECRET;
    let auth = Buffer.from(`${KEY}:${SECRET}`).toString('base64')
    let headerAuth = {Authorization:  'Basic ' + auth}
    

    /*
    * POST oauth2/token
    * Allows a registered application to obtain an OAuth 2 Bearer Token
    */
   let token = await retriveDataFromAPI(`/oauth2/token?grant_type=client_credentials`, headerAuth);
   console.log(token)

    /*
    * Retweets a tweet. Returns the original Tweet with Retweet details embedded.
    */
    //let dataUserName = await retriveDataFromAPI(`/1.1/statuses/retweet/${tweetId}.json`);
    
    return response = {
        'statusCode': 200,
        'body': JSON.stringify(result)
    }
};


async function retriveDataFromAPI(url, headerAuth){
    // vars
    let error = false;
    let messageError = "";
    let result = "";
    let errorsDetailed = [];
    const twitterEndPoint = process.env.twitterEndPoint;
    
    // Try catch statement
    try {
        /*
        * Use of the axio to get the Twetter API Response
        * Autorization Bearer in the header
        */
        response = await axios.post(
            twitterEndPoint + url,
            {},
            { headers: headerAuth }
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
            result = response.data;
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