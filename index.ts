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
import LemmyBot, { Vote } from 'lemmy-bot';
import { Login, LemmyHttp, GetCommunity, EditCommunity } from 'lemmy-js-client';
import { describe } from 'node:test';
import { get_list_of_fixtures } from './src/fixtures';
//import createTable from  'json-to-markdown-table'

const PORT = process.env.PORT || 8021;
const app: Express = express();

const lemmywinx = new LemmyBot({
  instance: 'lemmy.world',
  credentials: {
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || ""
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
  }
  
  ,handlers: {
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
      botActions: { createComment, voteComment }

    }) => {
      createComment({
        "content": "Hi there, Lemmywinx reporting for duty",
        "postId": id,
        "parentId": comment_id
      })
      console.log(creator_id, id, content);
    }


    //  mention : (res) => {


    //    console.log(res.mentionView.comment.content)

    // }
  }

});
lemmywinx.start();


// Auto Create Posts


//





 // ======================================
  // Update Fixtures
  // ======================================
  
//update_fixture_table()

function update_fixture_table() {
  let form: Login = {
    username_or_email: process.env.USERNAME || "",
    password: process.env.PASSWORD || ""
  }
  let baseURL = 'Https://lemmy.world';
  let client: LemmyHttp = new LemmyHttp(baseURL);
  const login_response = new Promise((resolve, reject) => {
    resolve(client.login(form));
  });
  let community_id_form: GetCommunity = { name: 'sky_7_bot_testing' }
  /*const community_id_response = new Promise((resolve, reject) =>
  {
    resolve(client.getCommunity(community_id_form))
  }
  ) 
  community_id_response.then(value => {console.log(value)})
  /* Id was 9451 of the tet site 
  */
 login_response.then((value: any) => {
    let jwt = value.jwt;
    console.log("the token is : " + jwt);
    let test_string = ''
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
  })
}

// ======================================
// End Update Fixtures
// ======================================

app.get('/', (req: Request, res: Response) => {
  res.send('the user name of the bot is:- ' + process.env.USERNAME);
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = server;
