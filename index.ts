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
import { Login, LemmyHttp, GetCommunity, EditCommunity, CreatePost, FeaturePost } from 'lemmy-js-client';
import { describe } from 'node:test';
import { get_list_of_fixtures } from './fixtures';
import { scheduler } from 'timers/promises';
import { createProgram } from 'typescript';
import * as fs from 'fs';

//import createTable from  'json-to-markdown-table'
const path = require('path')
const app: Express = express();
let jwt = ''
const baseURL = 'Https://lemmy.world';
let client: LemmyHttp = new LemmyHttp(baseURL);
let env_vars = {
    USERNAME:''
    , PASSWORD:''
    , PORT : 0
    , JDBC_CONNECTION_STRING : ''
}
let env = 'TEST'
const post_template = {
  		name: "🍻 The Lounge: Daily Discussion Thread"
  		,community_id: 9451
 		 , body: "Howdy folks! Hope everyone is having a good day. This is the daily discussion thread to talk about all things United or otherwise. \n\n This is a post from Lemmywinkx_bot"
 		 ,auth : ''
	}
const reddevils_side_bar_text =  'All things Manchester United. \n'+        '\n' +
        'New to the community? Come say hi in the [Welcome thread.](https://lemmy.world/post/47358)\n' +        '\n' +'Got any suggestions on how we can improve and grow as a community? [Let us know!](https://lemmy.world/post/56208)\n' +
        '\n' +
        'Basic rules:\n' +
        '\n' +
        '1. Fuck the Glazers\n' +
        '2. Be civil to each other\n' +
        '3. No non-Manchester United/football content. Non-United content is allowed if it affects United in some way. Otherwise, use the Weekly Discussion Thread\n' +
        '4. Fuck the Glazers\n' +
        '5. Posting news from other social media sites is allowed, but stick to reliable sources (may implement a tier system in future)\n' +
        '6. Keep it legal - no streams please :)\n' +
        '7. Have fun!\n' +
        '8. Fuck the Glazers\n';
let community_id = 9451
const { Sequelize, DataTypes } = require('sequelize');

let PORT = 0
try {
  const raw_env_vars = fs.readFileSync(path.resolve(__dirname, 'src/env.json'), 'utf-8');
  env_vars = JSON.parse(raw_env_vars);
	PORT = env_vars.PORT || 25557;
    if (env_vars.USERNAME =="__lemmywinks_bot"){
        env = 'PROD'; //should not be needed but just in case
        community_id = 9451//2317 // community id for c/RedDevils

    }

} catch (err) {
  console.error(err);
}

const jdbc_connection = env_vars.JDBC_CONNECTION_STRING
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
    username:  env_vars.USERNAME ,
    password: env_vars.PASSWORD
  },
  connection: {
    minutesUntilReprocess: 10
  },
  federation: {
    allowList: [
      {
        instance: 'lemmy.world',
        communities: ['sky_7_bot_testing', 'reddevils']
      }
    ]
  },
    dbFile :path.resolve(__dirname, 'chi.db'),

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
 
    username_or_email:  env_vars.USERNAME ,
    password: env_vars.PASSWORD
  }
  
  

  const login_response = new Promise((resolve, reject) => {
    resolve(client.login(form));
  });
  let community_id_form: GetCommunity = { name: community_name }
  const community_id_response = new Promise((resolve, reject) =>
  {
    resolve(client.getCommunity(community_id_form))
  }
  ) 
  //community_id_response.then(value => {console.log(value)})
  /* Id was 9451 of the tet site 
  */
  const response = await login_response.then((value: any) => {
    jwt = value.jwt;
    Promise.resolve(0); 
})
return response
}
//js_client_login('reddevils')


// ======================================
// Update Fixtures
// ======================================
function update_fixture_table(sequelize) {

    const new_md_output = new Promise<string>((resolve, reject) => {
      resolve(get_list_of_fixtures(sequelize));
    });
    new_md_output.then(value => {

      let edit_community_form: EditCommunity = {
        auth: jwt,
        community_id: community_id,
        description: `${reddevils_side_bar_text}📅  **Upcoming Fixtures**
\n  ${value}`
      }
      setTimeout(function () {
        client.editCommunity(edit_community_form);
      }, 5000)
    })
    return(new_md_output)
  }
 

// ======================================
// End Update Fixtures
// ======================================

// Daily Posts
function create_daily_posts (sequelize){
  let post_details = post_template
  const moment = require('moment'); // require
  let utc_date_as_object = moment().utc().toObject()
  let utc_day_of_week =  moment().utc().day();
  // to do If it is match day if ()
  let db_instance_name = env == "PROD"?'daily_posts':'daily_posts_test'
  let table_name = env == "PROD"?'daily_posts_log':'daily_posts_log_test'
      
  const daily_posts = sequelize.define(db_instance_name, {
    post_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  post_name: {
    type: DataTypes.STRING
  }
  , community_id: {type: DataTypes.INTEGER}
  , post_date_number: {type: DataTypes.BIGINT, allowNull : false}

}, {
    tableName: table_name
  // Other model options go here
});
//sequelize.sync({force:true})
  let post_type = 'The Lounge'
  if (utc_day_of_week == 5) //check if its friday
    {
      post_details.name = "💬 Free Talk Friday"
      post_details.body = "It's that time of the week!! What's the craic?"
      post_type = "Free Talk Friday"
    }
  else{
    post_details.name = "🍻 The Lounge: Daily Discussion Thread"
    post_details.body = "A thread to discuss daily events discussions etc. Please be civil and encourage discourse."
 
  }
  post_details.auth = jwt
  post_details.community_id = community_id
  let new_post: CreatePost = post_details
  let post_id = 0
  let is_posted = new Promise((resolve, reject) => {
    resolve(client.createPost(new_post))
    
  }
  ).then(value => {
    post_id = value.post_view.post.id ;console.log(post_id)
    let feature_new_post: FeaturePost = {auth: jwt, featured : true, feature_type: 'Community', post_id: value.post_view.post.id}
    client.featurePost(feature_new_post)
    

    Promise.resolve(
        daily_posts.create(
          {
            post_type: post_type
            , post_name:post_details.name
            , community_id : community_id
            , post_date_number: moment().utc().format('YYYYDDMM')
            , post_id : post_id
          }
          )
          )
})
  return (is_posted)
}

//

// =========================================
// Cron Jobs using manual JS client due to promise issue 
//
//
// =========================================
// Daily Cron 
async function daily_cron () {
  const { Sequelize, DataTypes } = require('sequelize');
  const sequelize = new Sequelize(jdbc_connection, {dialect: 'mysql'});
  console.log("this is running");
  let update_everything = new Promise ((resolve, reject) =>{ resolve(update_fixture_table(sequelize))}).then(value => {
    console.log('Run the Daily thread stuff; Friday special Free talk friday');
    //let login_response = await js_client_login('sky_7_bot_testing')
    //console.log('Login response was '+login_response)
    let test = 'sky_7_bot_testing'
    let login_response = new Promise ((resolve, reject) =>
      {return resolve(js_client_login(env == "PROD"?'reddevils':'sky_7_bot_testing'))
      }).then((value) => {
      create_daily_posts(sequelize).then(value => {console.log('Connection Closed')})
    })
  }
    )
    Promise.resolve(update_everything)
}



var cron = require('node-cron');
cron.schedule('* * * * *', function() {daily_cron()} 
  // Check if its match day
,{
    timezone: 'Europe/London'
    , scheduled : true
});


            
// =========================================
// End of Cron 
// =========================================




app.get('/', (req: Request, res: Response) => {
  res.send('the user name of the bot is:- ' + env_vars.USERNAME);
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = server;
