// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import express, { Express, Request, Response } from 'express';
import 'dotenv/config'
import LemmyBot, { Vote, BotActions, BotTask } from 'lemmy-bot';
import { Login, LemmyHttp, GetCommunity, EditCommunity, CreatePost } from 'lemmy-js-client';
import { describe } from 'node:test';
import { get_list_of_fixtures } from './src/fixtures';
import { scheduler } from 'timers/promises';
import { createProgram } from 'typescript';

const {google} = require('googleapis');

//import createTable from  'json-to-markdown-table'


let jwt = ''
const PORT = process.env.PORT || 25557;
const app: Express = express();
const post_template = {
  name: "🍻 The Lounge: Daily Discussion Thread",
  community_id: 9451
  , body: "This is a post from Lemmywinkx u/frostbot"
  ,auth : ''

}
const baseURL = 'Https://lemmy.world';
let client: LemmyHttp = new LemmyHttp(baseURL);

/**
 * Import the GoogleAuth library, and create a new GoogleAuth client.
 */
const {GoogleAuth} = require('google-auth-library');

/**
 * Acquire a client, and make a request to an API that's enabled by default.
 */
async function access_sheets(
  // Full path to the sevice account credential
  keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  const auth = new GoogleAuth({
    keyFile: keyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  })  ;
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1-JfjQB1m1EjsrbP3K4cW1r9rQT6d0Ztnvm5T1XRj_yk',
    range: 'fixtures!A1:B1',
  });
  //console.log(res)
  return await sheets
}

/*
function get_some_values_from_google_sheets (sheets){
  console.log(`Start of get value function value is ${sheets}`)
  sheets.then(value => 
    { 
      console.log(`Start of get value function value is ${value}`)
    new Promise ((resolve, reject) =>{
      console.log(`Start of get value function value is ${value}`)
      resolve(value.spreadsheets.values.get({
        spreadsheetId: '1-JfjQB1m1EjsrbP3K4cW1r9rQT6d0Ztnvm5T1XRj_yk',
        range: 'fixtures!A1:D1',
      });)
    }).then(value =>{
      console.log(value)
     })
    
  
})

}
*/

const lemmywinx = new LemmyBot({
  instance: 'lemmy.world',
  credentials: {    
    username:  "__lemmywinks_bot" || process.env.USERNAME ,
    password: process.env.PASSWORD || "XYzbU1IhAuW$D%N"
  },
  connection: {
    minutesUntilReprocess: 10
  },
  federation: {
    allowList: [
      {
        instance: 'lemmy.world',
        communities: ['sky_7_bot_testing']
      }
    ]
  },
  dbFile :'/home/container/chi.db'

   handlers: {
    post: (res) => {
      console.log(res.postView.post.name);
    },
    /*  mention : ({
        mentionView:
          {
              comment: {creator_id, id}
            },
            botActions: { voteComment }
          }) => {
          voteComment(Vote.Upvote);
        }
     */
    mention: ({
      mentionView:
      {
        comment: { creator_id, id: comment_id, content }
        , post: { id }
      },
      botActions: { createComment, voteComment, createPost }

    }) => {
      createComment({
        "content": "Hi there, Lemmywinx reporting for duty",
        "postId": id,
        "parentId": comment_id
      })
      //createPost(post_template)
      console.log(creator_id, id, content);
    }


    //  mention : (res) => {


    //    console.log(res.mentionView.comment.content)

    // }
  }

});
lemmywinx.start();


//
async function js_client_login (community_name : string){
  let form: Login = {    
    username_or_email:  "__lemmywinks_bot" || process.env.USERNAME ,
    password: process.env.PASSWORD || "XYzbU1IhAuW$D%N"
  }

  const login_response = new Promise((resolve, reject) => {
    resolve(client.login(form));
  });
  let community_id_form: GetCommunity = { name: community_name }
  /*const community_id_response = new Promise((resolve, reject) =>
  {
    resolve(client.getCommunity(community_id_form))
  }
  ) 
  community_id_response.then(value => {console.log(value)})
  /* Id was 9451 of the tet site 
  */
  const response = await login_response.then((value: any) => {
    jwt = value.jwt;
    console.log("the token is : " + jwt);
    Promise.resolve(0); 
})
return response
}



// ======================================
// Update Fixtures
// ======================================

//update_fixture_table()

function update_fixture_table() {

    const new_md_output = new Promise<string>((resolve, reject) => {
      resolve(get_list_of_fixtures());
    });
    new_md_output.then(value => {

      let edit_community_form: EditCommunity = {
        auth: jwt,
        community_id: 9451,
        description: value
      }
      setTimeout(function () {
        client.editCommunity(edit_community_form);
        console.log(`Value of the table is\n+++++++++++++++\n${value}`);
      }, 5000)
    })
  }


// ======================================
// End Update Fixtures
// ======================================

// Daily Posts
function create_daily_posts (){
  let post_details = post_template
  const moment = require('moment'); // require
  let utc_date_as_object = moment().utc().toObject()
  let utc_day_of_week =  moment().utc().day();
  // to do If it is match day if ()
  if (utc_day_of_week == 5) //check if its friday
    {
      post_details.name = "💬 Free Talk Friday"
      post_details.body = "It's that time of the week!! What's the craic?"
    }
  else{
    post_details.name = "🍻 The Lounge: Daily Discussion Thread"
    post_details.body = "A thread to discuss daily events discussions etc. Please be civil and encourage discourse."
 
  }
  post_details.auth = jwt
  let new_post: CreatePost = post_details
  client.createPost(new_post)
}

//

// =========================================
// Cron Jobs using manual JS client due to promise issue 
//
//
// =========================================
// Daily Cron 
    
var cron = require('node-cron');

cron.schedule('* 9 * * *', async () => {
    update_fixture_table()
    console.log('Run the Daily thread stuff; Friday special Free talk friday');
    //let login_response = await js_client_login('sky_7_bot_testing')
    //console.log('Login response was '+login_response)
    let test = 'sky_7_bot_testing'
    let login_response = new Promise ((resolve, reject) =>
      {return resolve(js_client_login('sky_7_bot_testing'))
      }).then((value) => {
      create_daily_posts()
      return (0)
    })
  // Check if its match day

  
},{
    timezone: 'Europe/London'
    , scheduled : true
});


            
// =========================================
// End of Cron 
// =========================================




app.get('/', (req: Request, res: Response) => {
  res.send('the user name of the bot is:- ' + process.env.USERNAME);
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = server;
