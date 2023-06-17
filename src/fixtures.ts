import { isFunctionExpression } from "typescript";
import * as moment from 'moment'
import { format } from "node:path";

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

    const md_markdown = require('json2md')
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
let sample_api_output = {
    "get": "fixtures",
    "parameters": {
        "next": "5",
        "team": "33"
    },
    "errors": [],
    "results": 5,
    "paging": {
        "current": 1,
        "total": 1
    },
    "response": [
        {
            "fixture": {
                "id": 1030298,
                "referee": null,
                "timezone": "UTC",
                "date": "2023-07-12T15:00:00+00:00",
                "timestamp": 1689174000,
                "periods": {
                    "first": null,
                    "second": null
                },
                "venue": {
                    "id": 11603,
                    "name": "Ullevaal Stadion",
                    "city": "Oslo"
                },
                "status": {
                    "long": "Not Started",
                    "short": "NS",
                    "elapsed": null
                }
            },
            "league": {
                "id": 667,
                "name": "Friendlies Clubs",
                "country": "World",
                "logo": "https://media-1.api-sports.io/football/leagues/667.png",
                "flag": null,
                "season": 2023,
                "round": "Club Friendlies 1"
            },
            "teams": {
                "home": {
                    "id": 33,
                    "name": "Manchester United",
                    "logo": "https://media-3.api-sports.io/football/teams/33.png",
                    "winner": null
                },
                "away": {
                    "id": 63,
                    "name": "Leeds",
                    "logo": "https://media-3.api-sports.io/football/teams/63.png",
                    "winner": null
                }
            },
            "goals": {
                "home": null,
                "away": null
            },
            "score": {
                "halftime": {
                    "home": null,
                    "away": null
                },
                "fulltime": {
                    "home": null,
                    "away": null
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 1030300,
                "referee": null,
                "timezone": "UTC",
                "date": "2023-07-19T13:00:00+00:00",
                "timestamp": 1689771600,
                "periods": {
                    "first": null,
                    "second": null
                },
                "venue": {
                    "id": null,
                    "name": "Murrayfield Stadium",
                    "city": "Edinburgh"
                },
                "status": {
                    "long": "Not Started",
                    "short": "NS",
                    "elapsed": null
                }
            },
            "league": {
                "id": 667,
                "name": "Friendlies Clubs",
                "country": "World",
                "logo": "https://media-1.api-sports.io/football/leagues/667.png",
                "flag": null,
                "season": 2023,
                "round": "Club Friendlies 1"
            },
            "teams": {
                "home": {
                    "id": 33,
                    "name": "Manchester United",
                    "logo": "https://media-1.api-sports.io/football/teams/33.png",
                    "winner": null
                },
                "away": {
                    "id": 80,
                    "name": "Lyon",
                    "logo": "https://media-2.api-sports.io/football/teams/80.png",
                    "winner": null
                }
            },
            "goals": {
                "home": null,
                "away": null
            },
            "score": {
                "halftime": {
                    "home": null,
                    "away": null
                },
                "fulltime": {
                    "home": null,
                    "away": null
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 1030302,
                "referee": null,
                "timezone": "UTC",
                "date": "2023-07-22T21:00:00+00:00",
                "timestamp": 1690059600,
                "periods": {
                    "first": null,
                    "second": null
                },
                "venue": {
                    "id": null,
                    "name": "MetLife Stadium",
                    "city": "East Rutherford, New Jersey"
                },
                "status": {
                    "long": "Not Started",
                    "short": "NS",
                    "elapsed": null
                }
            },
            "league": {
                "id": 667,
                "name": "Friendlies Clubs",
                "country": "World",
                "logo": "https://media-1.api-sports.io/football/leagues/667.png",
                "flag": null,
                "season": 2023,
                "round": "Club Friendlies 1"
            },
            "teams": {
                "home": {
                    "id": 42,
                    "name": "Arsenal",
                    "logo": "https://media-3.api-sports.io/football/teams/42.png",
                    "winner": null
                },
                "away": {
                    "id": 33,
                    "name": "Manchester United",
                    "logo": "https://media-1.api-sports.io/football/teams/33.png",
                    "winner": null
                }
            },
            "goals": {
                "home": null,
                "away": null
            },
            "score": {
                "halftime": {
                    "home": null,
                    "away": null
                },
                "fulltime": {
                    "home": null,
                    "away": null
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 1030307,
                "referee": null,
                "timezone": "UTC",
                "date": "2023-07-26T02:30:00+00:00",
                "timestamp": 1690338600,
                "periods": {
                    "first": null,
                    "second": null
                },
                "venue": {
                    "id": null,
                    "name": "Snapdragon Stadium",
                    "city": "San Diego, California"
                },
                "status": {
                    "long": "Not Started",
                    "short": "NS",
                    "elapsed": null
                }
            },
            "league": {
                "id": 667,
                "name": "Friendlies Clubs",
                "country": "World",
                "logo": "https://media-1.api-sports.io/football/leagues/667.png",
                "flag": null,
                "season": 2023,
                "round": "Club Friendlies 1"
            },
            "teams": {
                "home": {
                    "id": 33,
                    "name": "Manchester United",
                    "logo": "https://media-2.api-sports.io/football/teams/33.png",
                    "winner": null
                },
                "away": {
                    "id": 1837,
                    "name": "Wrexham",
                    "logo": "https://media-1.api-sports.io/football/teams/1837.png",
                    "winner": null
                }
            },
            "goals": {
                "home": null,
                "away": null
            },
            "score": {
                "halftime": {
                    "home": null,
                    "away": null
                },
                "fulltime": {
                    "home": null,
                    "away": null
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        },
        {
            "fixture": {
                "id": 1030312,
                "referee": null,
                "timezone": "UTC",
                "date": "2023-07-27T02:30:00+00:00",
                "timestamp": 1690425000,
                "periods": {
                    "first": null,
                    "second": null
                },
                "venue": {
                    "id": null,
                    "name": "NRG Stadium",
                    "city": "Houston, Texas"
                },
                "status": {
                    "long": "Not Started",
                    "short": "NS",
                    "elapsed": null
                }
            },
            "league": {
                "id": 667,
                "name": "Friendlies Clubs",
                "country": "World",
                "logo": "https://media-1.api-sports.io/football/leagues/667.png",
                "flag": null,
                "season": 2023,
                "round": "Club Friendlies 1"
            },
            "teams": {
                "home": {
                    "id": 541,
                    "name": "Real Madrid",
                    "logo": "https://media-3.api-sports.io/football/teams/541.png",
                    "winner": null
                },
                "away": {
                    "id": 33,
                    "name": "Manchester United",
                    "logo": "https://media-2.api-sports.io/football/teams/33.png",
                    "winner": null
                }
            },
            "goals": {
                "home": null,
                "away": null
            },
            "score": {
                "halftime": {
                    "home": null,
                    "away": null
                },
                "fulltime": {
                    "home": null,
                    "away": null
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        }
    ]
}

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
  



  async function get_fixtures(){
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
            //console.log(data)
            let formatted_response = format_fixtures(data.data) 
            
            const markdown_response:string = send_fixtures(formatted_response);
            //console.log(markdown_response)
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

function format_fixtures (data: any){
    let fix_list: Fixture_list[] = []
    //let working_copy =   sample_api_output
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
        //fixt.teams.home.id 
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
        return fix_list;
    }
//format_fixtures('');
get_fixtures();

export async function get_list_of_fixtures (){
    const promise_1 = new Promise((resolve, reject) => {
        resolve(get_fixtures())
    })
    promise_1.then(value => { console.log(`Exporting Value ${output_to_export}`)
        return output_to_export})
    return output_to_export
}