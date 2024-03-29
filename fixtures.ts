import { isFunctionExpression } from "typescript";
import * as moment from 'moment'
import { format } from "node:path";
import * as fs from 'fs';

const path = require('path')

const { Sequelize, DataTypes } = require('sequelize');

let env_vars = {
    USERNAME:''
    , PASSWORD:''
    , PORT : 0
    , JDBC_CONNECTION_STRING : ''
}


try {
    const raw_env_vars = fs.readFileSync(path.resolve(__dirname, 'src/env.json'), 'utf-8');
    env_vars = JSON.parse(raw_env_vars);
    
  } catch (err) {
    console.error(err);
  }

//jdbc_connection = env_vars.JDBC_CONNECTION_STRING

interface Fixture_list {
    [key:string]: string;
    comp: string;
    opponent: string;
    type: string; 
    date: string;
    score: string
     
} 
const ID_FOR_UNITED_API = 33
const API_KEY_FOR_RAPID = '5jmYs3r2MTmshlSTY0CJbRNCQ0typ1WOIWEjsnfoTt8iWvZgCz';
//const API_KEY_FOR_RAPID = '5jmYs3r2MTmshlSTY0CJbRNCQ0typ1WOIWEjsnfoTt8iWvZgCq'; //fake key
const RAPID_API_HOST = 'api-football-v1.p.rapidapi.com';
const BASE_URL_FOR_API = 'https://'+RAPID_API_HOST+'/v3/';
var output_to_export = ''

function send_fixtures (list_of_fixtures :Fixture_list[]){

    let columns = ['Op','Comp',' ','Date', 'Score'];
    let out_string = '|';
    columns.forEach(element => {
        out_string+= element+'|'

    })
    out_string+= '\n |'
    columns.forEach(element => {
        out_string+= ':----|'
    })
    out_string +='\n'

    list_of_fixtures.forEach(element =>{
     out_string+=   '|'+element.opponent +'|'+ element.comp +'|'+ element.type +'|'+ element.date +'|'+ element.score ;
     out_string+= '| \n'
    
    })

        
        
    //console.log(out_string)
    return(out_string)
     console.log('sending fixtures');
}

//sample API output to work with Delete this in production

function callback(err) {
	console.log(err);
  }

  function get_type_of_fixture(home_team : number){
    if (home_team == 33){
        return "H";
    }
    else {
        return "A";
    }
  }


  function get_score(
    home_goal : number,
    away_goal : number 
    )
    {
        return home_goal.toString()+" - "+away_goal.toString();
    }
  



  async function get_fixtures(sqlize){
    const axios = require('axios');
	let endpoint = 'fixtures';
	let api_url = BASE_URL_FOR_API+endpoint;
	//querystring is needed 
    //console.log("Iam running")
	let query_string = {team:ID_FOR_UNITED_API
	//	, season: 2023
		//, last:2
		, next: 5
	}

    const options = {
		method: 'GET',
		url: api_url,
		params: query_string,
		headers: {
			'X-RapidAPI-Key': API_KEY_FOR_RAPID,
			'X-RapidAPI-Host': RAPID_API_HOST,
		},
	};
	axios
		.request(options)
		.then(function (data:any) {
            console.log(data)
            let formatted_response = format_fixtures(data.data, sqlize) 
            
            const markdown_response:string = send_fixtures(formatted_response);
            console.log(markdown_response)
            //return markdown_response || ''
            output_to_export = markdown_response 
			/*
			console.log(options);
			console.log("");
			console.log("===================================");
			console.log("");
			console.log(data);
			*/
			//const json = JSON.stringify(data);
			//const fs = require('fs');
			//fs.writeFile('myjsonfile.json', json, 'utf8', callback);
		
		})
		.catch(function (error: any) {
			console.error(error);
		});
}

function format_fixtures (data: any, sqlize){
    let fix_list: Fixture_list[] = []
    //let working_copy =   sample_api_output
    //con.connect(function(err) {
    //    if (err) throw err;
    //    console.log("Connected!");
     //   is_db_connected = true;
     const utd_fixtures = sqlize.define('utd_fixtures_test', {
        match_date_number: {type: DataTypes.BIGINT,  primaryKey: true}
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
    //utd_fixtures.sync({force : true})
    let final_insert = [{}]
    //     });
    //let insert_string = "insert ignore into `upcoming_fixtures`(`match_date_number`, `home_team`, `away_team`, `venue`, `played`, `home_team_score`, `away_team_score`, `competition`, `home_lineup`, `away_lineup`, `match_date_time`)  values"
	let working_copy =   data 
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
        //fixt.teams.home.id 
        //insert_string += `( ${moment(fixt.fixture.date, moment.ISO_8601). format('YYYYDDMM')}, '${fixt.teams.home.name}', '${fixt.teams.away.name}', '${fixt.fixture.venue.name}', ${fixt.fixture.status.short == 'NS'?false:true}, ${fixt.goals.home}, ${fixt.goals.away}, '${fixt.league.name}' , '','', '${fixt.fixture.date}' ),\n` ;
         final_insert.push({
            match_date_number: moment(fixt.fixture.date, moment.ISO_8601). format('YYYYDDMM')
            , home_team: fixt.teams.home.name
            , away_team: fixt.teams.away.name
            , venue: fixt.fixture.venue.name
            , is_played: fixt.fixture.status.short == 'NS'?false:true
            , home_goals: fixt.goals.home
            , away_goals: fixt.goals.away
            , league_name : fixt.league.name
            , fixture_date: fixt.fixture.date 
         })
        current_fixture.type = get_type_of_fixture(fixt.teams.home.id)
        if (fixt.goals.home == null || fixt.goals.away == null){
            current_fixture.score = ' - ' ;   
        }
        else {
        current_fixture.score = get_score(fixt.goals.home, fixt.goals.away);
        }

        current_fixture.date = (moment(fixt.fixture.date).format('MM/DD'));
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
        Promise.resolve(utd_fixtures.bulkCreate(final_insert.shift(), {updateOnDuplicate : ['is_played','home_goals','away_goals']}))

        
        
        return fix_list;
    }
//format_fixtures('');
//get_fixtures();

export async function get_list_of_fixtures (connection){
    const promise_1 = new Promise((resolve, reject) => {
        resolve(get_fixtures(connection))
    })
    promise_1.then(value => { console.log(`Exporting Value ${output_to_export}`)
        return output_to_export})
    return Promise.resolve(promise_1)
}