import { describe } from 'node:test';
import { scheduler } from 'timers/promises';
import { createProgram } from 'typescript';
import * as fs from 'fs';
const path = require('path')

let is_db_connected = false
let env_vars = {
    USERNAME:''
    , PASSWORD:''
    , PORT : 0
    , JDBC_CONNECTION_STRING : ''
}

let jdbc_connection = ''
try {
    const raw_env_vars = fs.readFileSync(path.resolve(__dirname, 'src/env.json'), 'utf-8');
    env_vars = JSON.parse(raw_env_vars);
    
  } catch (err) {
    console.error(err);
  }

  jdbc_connection = env_vars.JDBC_CONNECTION_STRING
  console.log(jdbc_connection)
  const { Sequelize, DataTypes } = require('sequelize');
  const sequelize = new Sequelize(jdbc_connection, {dialect: 'mysql'});
    
  const news_sources_guide = sequelize.define('news_sources_guide', {
    name : {
    type: DataTypes.STRING,
    allowNull: false
  },
  twitter_url: {
    type: DataTypes.STRING
  }
  , mastodoon_url: {type: DataTypes.STRING}
  , mastodoon_id: {type: DataTypes.STRING}
  , tier: {type: DataTypes.INTEGER}
  , image_url: {type: DataTypes.STRING}


}, {
    tableName: 'news_sources_guide'
  // Other model options go here
});



/*const utd_fixtures = sequelize.define('utd_fixtures_test', {
    match_date_number: {type: DataTypes.BIGINT, primaryKey: true}
    , home_team: {type: DataTypes.STRING}
    , away_team: {type: DataTypes.STRING}
    , venue: {type: DataTypes.STRING}
    , is_played: {type: DataTypes.BOOLEAN}
    , home_goals: {type: DataTypes.INTEGER}
    , away_goals: {type: DataTypes.INTEGER}
    , league_name : {type: DataTypes.STRING}
    , fixture_date: {type:DataTypes.DATE} 
}, {
    tableName: 'utd_fixtures_test'
  // Other model options go here
});

*/

//news_sources_guide.sync({force:true})
export function add_j_data (form_data) {
    const path = require('path')

    let is_db_connected = false
    let env_vars = {
        USERNAME:''
        , PASSWORD:''
        , PORT : 0
        , JDBC_CONNECTION_STRING : ''
    }
    
    let jdbc_connection = ''
    try {
        const raw_env_vars = fs.readFileSync(path.resolve(__dirname, 'src/env.json'), 'utf-8');
        env_vars = JSON.parse(raw_env_vars);
        
      } catch (err) {
        console.error(err);
      }
    
      jdbc_connection = env_vars.JDBC_CONNECTION_STRING
      console.log(jdbc_connection)
      const { Sequelize, DataTypes } = require('sequelize');
      const sequelize = new Sequelize(jdbc_connection, {dialect: 'mysql'});
        
      const news_sources_guide = sequelize.define('news_sources_guide', {
        name : {
        type: DataTypes.STRING,
        allowNull: false
      },
      twitter_url: {
        type: DataTypes.STRING
      }
      , mastodoon_url: {type: DataTypes.STRING}
      , mastodoon_id: {type: DataTypes.STRING}
      , tier: {type: DataTypes.INTEGER}
      , image_url: {type: DataTypes.STRING}
    
    
    }, {
        tableName: 'news_sources_guide'
      // Other model options go here
    });

    Promise.resolve(
    news_sources_guide.create({
        name: form_data.jname
        , mastodoon_id : form_data.jid
        , tier: form_data.jtier

    }))
}
//sample API output to work with Delete this in production


/*



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