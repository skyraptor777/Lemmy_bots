import { describe } from 'node:test';
import { scheduler } from 'timers/promises';
import { createProgram } from 'typescript';
import * as fs from 'fs';
const path = require('path')
import { createRestAPIClient } from "masto";
import { listenerCount } from 'process';
import { get_list_of_fixtures } from './fixtures';
import { resolve } from 'path';



//news_sources_guide.sync({force:true})
export function add_j_data(form_data) {


    let is_db_connected = false
    let env_vars = {
        USERNAME: ''
        , PASSWORD: ''
        , PORT: 0
        , JDBC_CONNECTION_STRING: ''
    }


    try {
        const raw_env_vars = fs.readFileSync(path.resolve(__dirname, 'src/env.json'), 'utf-8');
        env_vars = JSON.parse(raw_env_vars);

    } catch (err) {
        console.error(err);
    }

    let jdbc_connection = env_vars.JDBC_CONNECTION_STRING
    console.log(jdbc_connection)
    const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = new Sequelize(jdbc_connection, { dialect: 'mysql' });

    const news_sources_guide = sequelize.define('news_sources_guide', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        twitter_url: {
            type: DataTypes.STRING
        }
        , mastodoon_url: { type: DataTypes.STRING }
        , mastodoon_id: { type: DataTypes.STRING }
        , tier: { type: DataTypes.INTEGER }
        , image_url: { type: DataTypes.STRING }


    }, {
        tableName: 'news_sources_guide'
        // Other model options go here
    });

    Promise.resolve(
        news_sources_guide.create({
            name: form_data.jname
            , mastodoon_id: form_data.jid
            , tier: form_data.jtier

        }))
}
//sample API output to work with Delete this in production


export function journalist_data_record() {

    let env_vars = {
        USERNAME: ''
        , PASSWORD: ''
        , PORT: 0
        , JDBC_CONNECTION_STRING: ''
    }


    try {
        const raw_env_vars = fs.readFileSync(path.resolve(__dirname, 'src/env.json'), 'utf-8');
        env_vars = JSON.parse(raw_env_vars);

    } catch (err) {
        console.error(err);
    }

    let jdbc_connection = env_vars.JDBC_CONNECTION_STRING
    console.log(jdbc_connection)
    const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = new Sequelize(jdbc_connection, { dialect: 'mysql' });


    const masto = createRestAPIClient({
        url: env_vars.MASTODON_URL,
        accessToken: env_vars.MASTODON_TOKEN,
    });

    const list_of_tweets = sequelize.define('list_of_tweets', {
        post_id: {
            type: DataTypes.STRING,
            allowNull: false
            ,primaryKey: true
        },
        account_id: {
            type: DataTypes.STRING
        }
        , account_display_name: { type: DataTypes.STRING }
        , tweet_url: { type: DataTypes.STRING }
        , mastodoon_url: { type: DataTypes.STRING }
        , post_content: { type: DataTypes.TEXT  }
        , first_id_in_batch: { type: DataTypes.STRING }
        , is_reviewed: { type: DataTypes.BOOLEAN }
        , is_posted: { type: DataTypes.BOOLEAN }


    }, {
        tableName: 'list_of_tweets'
        // Other model options go here
    });

    //const last_post =  list_of_tweets.findOne({
        // todo Update to add where clause of daily posts -- effectively add where post type is daily
     //     order: [ [ 'createdAt', 'DESC' ]],
     // });
     // Promise.resolve(last_post)
    


    const status = masto.v1.timelines.list.$select("64916").list({limit:40})
    let relevant_list = [{}]
    Promise.resolve(status).then(value =>{
        let first_id = value[0].id
        
        value.forEach( tweet =>
            {
                if (tweet.content.includes("Man United")|| tweet.content.includes("MUFC") || tweet.content.includes("Manchester United") || tweet.content.includes("Man U"))
                {
                    relevant_list.push({"account_id" :tweet.account.id, "account_display_name" :tweet.account.displayName, "post_id" : tweet.id, "post_content" : tweet.content, "tweet_url" : tweet.url  })
                }

            }
        )
        relevant_list.shift()
        console.log(relevant_list);

        
       // list_of_tweets.sync({force:true});
        Promise.resolve(list_of_tweets.bulkCreate(
            relevant_list
            , {ignoreDuplicates:true}
        
        ))
        
     /*   relevant_list.forEach( tweet => { 
            Promise.resolve(
                list_of_tweets.create({
                    post_id: tweet.mastodon_post_id∏
                    , account_id: tweet.mastodon_acct_id
                    , account_display_name: tweet.mastodon_acct_name
                    , tweet_url: tweet.twitter_link
                    , post_content: tweet.mastodon_post_content
                    , first_id_in_batch: first_id
          
        
                }))
        })*/


    })

}

export function get_tweets() {

    let return_object = [{}]
    let env_vars = {
        USERNAME: ''
        , PASSWORD: ''
        , PORT: 0
        , JDBC_CONNECTION_STRING: ''
    }


    try {
        const raw_env_vars = fs.readFileSync(path.resolve(__dirname, 'src/env.json'), 'utf-8');
        env_vars = JSON.parse(raw_env_vars);

    } catch (err) {
        console.error(err);
    }

    let jdbc_connection = env_vars.JDBC_CONNECTION_STRING
    //console.log(jdbc_connection)
    const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = new Sequelize(jdbc_connection, { dialect: 'mysql' });


      const list_of_tweets = sequelize.define('list_of_tweets', {
        post_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_id: {
            type: DataTypes.STRING
        }
        , account_display_name: { type: DataTypes.STRING }
        , tweet_url: { type: DataTypes.STRING }
        , mastodoon_url: { type: DataTypes.STRING }
        , post_content: { type: DataTypes.TEXT  }
        , first_id_in_batch: { type: DataTypes.STRING }
        , is_reviewed: { type: DataTypes.BOOLEAN }
        , is_posted: { type: DataTypes.BOOLEAN }


    }, {
        tableName: 'list_of_tweets'
        // Other model options go here
    });


    const jj = list_of_tweets.findAll({
        attributes: ['post_id', 'account_display_name', 'post_content']
        , where: {is_posted : null}
      })


return jj.then(value =>{
        
            value.forEach( tweet => { 
                return_object.push({'post_id':tweet.dataValues.post_id, "account_display_name":tweet.dataValues.account_display_name, "post_content":tweet.dataValues.post_content })

                console.log(tweet.dataValues.post_id)
            })
            return_object.shift()
        return return_object}
            )
    
     


/*
       return( Promise.resolve(jj).then(value=> 

        {
            
            value.forEach( tweet => { 
                return_object.push({'post_id':tweet.dataValues.post_id, "account_display_name":tweet.dataValues.account_display_name, "post_content":tweet.dataValues.post_content })

                console.log(tweet.dataValues.post_id)
            

        })
        return_object.shift() 
        //console.log(return_object)
        return(return_object) 

    }
    ))
    */
}

/*
64916


function format_fixtures (data: any){
    let fix_list: Fixture_list[] = []
    //let working_copy =   sample_api_output
    let insert_string = "insert ignore into `upcoming_fixtures`(`match_date_number`, `home_team`, `away_team`, `venue`, `played`, `home_team_score`, `away_team_score`, `competition`, `home_lineup`, `away_lineup`, `match_date_time`)  values"
    let working_copy =   data || sample_api_output
       // console.log(data.data.response)
    const moment = require('moment')
    working_copy.response.forEach(fixt => {
        let current_fixture: Fixture_list = {
            type  : '', //home away or neutral
            comp  : '',
            date  : '',
            score : '',
            opponent: ''

        }
        insert_string += `( ${moment(fixt.fixture.date, moment.ISO_8601). format('YYYYDDMM')}, '${fixt.teams.home.name}', '${fixt.teams.away.name}', '${fixt.fixture.venue.name}', ${fixt.fixture.status.short == 'NS'?false:true}, ${fixt.goals.home}, ${fixt.goals.away}, '${fixt.league.name}' , '','', '${fixt.fixture.date}' ),\n` ;
        //fixt.teams.home.id 
         if (current_fixture.type == 'H'){
            //current_fixture.opponent = `![crest](${fixt.teams.away.logo}) ${fixt.teams.away.name}`
            current_fixture.opponent = ` **${fixt.teams.away.name}**`
        }
        else{
            //current_fixture.opponent = `![crest](${fixt.teams.home.logo}) ${fixt.teams.home.name}`
            current_fixture.opponent = `**${fixt.teams.home.name}**`
        }
        
        if (fixt.league.id == 667){
            current_fixture.comp = "FR"
            //todo add more leagues info
        }
        //console.log (current_fixture)
        let date_for_sheets = moment(fixt.fixture.date, moment.ISO_8601). format('YYYY-DD-MM');
        fix_list.push(current_fixture)

        })
        console.log(insert_string)        
        insert_string= insert_string.slice(0, insert_string.length-2)
    }

//let fix_list = format_fixtures(sample_api_output)    
 

*/