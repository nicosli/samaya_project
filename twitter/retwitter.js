// Global vars
let response;
const axios = require('axios')

exports.lambdaHandler = async (event, context) => {
    return response = {
        'statusCode': 200,
        'body': JSON.stringify({})
    }
};

