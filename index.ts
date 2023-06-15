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

import express, {Express, Request, Response} from 'express';
import 'dotenv/config'
import LemmyBot , { Vote }  from 'lemmy-bot';


const PORT = process.env.PORT || 8021;
const app: Express = express();

const lemmywinx = new LemmyBot({
  instance: 'lemmy.world',
  credentials: {
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || ""
  },
  connection: {
    minutesUntilReprocess : 10
  },
  federation:{
    allowList: [
      {
        instance: 'lemmy.world',
        communities: ['sky_7_bot_testing']
      }
    ]
  },
  handlers: {
    post: (res) =>{
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
    mention : ({
      mentionView:
        {
            comment: {creator_id, id:comment_id, content}
            , post: {id}
          },
          botActions: {createComment, voteComment}

        }) => {
          createComment({
            "content": "Hi there, Lemmywinx reporting for duty",
            "postId": id,
            "parentId" : comment_id
          })
        console.log(creator_id, id, content);
      }
   

      //  mention : (res) => {

      
//    console.log(res.mentionView.comment.content)
    
 // }
        }

      
    
      
      

    


  
     




});
lemmywinx.start();

app.get('/', (req: Request, res: Response) => {
  //res.send('🎉 Hello TypeScript! 🎉');
  res.send('the user name of the bot is:- '+process.env.USERNAME);
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = server;
