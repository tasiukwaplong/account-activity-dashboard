const request = require('request');
const util = require('util');
const post = util.promisify(request.post);
require('dotenv').config();

const oAuthConfig = {
  token: process.env.TWITTER_ACCESS_TOKEN,
  token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
};

async function sendReply(recipient_id){
    const message = 'Hello, This is an autoresponder.'  
  if (recipient_id === process.env.TWITTER_USER_ID) return 'Cannot send message to yourself'
  
    const requestConfig = {
      url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
      oauth: oAuthConfig,
      json: {
        event: {
          type: 'message_create',
          message_create: {
            target: {
              recipient_id,
            },
            message_data: {
              text: message,
            },
          },
        },
      },
    };
    return await post(requestConfig).catch((e) => {
      console.log(e);
    });
}

module.exports = {
  async handleRequest(sender_id, message) {
      if(message.toUpperCase() === 'TESTING TESTING'){
        return sendReply(sender_id).then((d) => {
            console.log('sent');
        }).catch((e)=>{
            console.log('Failed');
        })
      }
      // message sent was not 'testing testing'
  }
};