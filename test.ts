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
    
  const daily_posts = sequelize.define('daily_posts_test', {
    post_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  post_name: {
    type: DataTypes.STRING
  }
  , community_id: {type: DataTypes.INTEGER}
  , post_date_number: {type: DataTypes.BIGINT, allowNull : false}
  , post_id: {type: DataTypes.BIGINT}

}, {
    tableName: 'daily_posts_log_test'
  // Other model options go here
});



const utd_fixtures = sequelize.define('utd_fixtures_test', {
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



daily_posts.sync({force:true})



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
interface Fixture_list {
    [key:string]: string;
    comp: string;
    opponent: string;
    type: string; 
    date: string;
    score: string
     
} 





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
 

