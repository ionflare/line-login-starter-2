"use strict";

require("dotenv").config();


const lineBot = require('@line/bot-sdk');
const Client = require('@line/bot-sdk').Client;

const clientBot_2 = new Client({
  channelAccessToken:  '+Z00sQIfBQjVouvA+bFr9LpyYi5pErdfu0hejVGhtzlEmw3RJRyV0V5tohj832ykJqb2S+6mcIRvWhw7V7PDpFNWzRZlVNLg59J8PU+71rxjCqPJxfSIET6QcCoU1Vcb6UnJSMb/I5qVtwr4XpIhKQdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'cb7cdb67c6a8f02f2b7119365518108b'
});

// ライブラリのインポート。
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const line_login = require("line-login");
const session = require("express-session");
const session_options = {
    secret: "2fb6dfcbe678318000471b205f84829c",
    resave: false,
    saveUninitialized: false
}
app.use(session(session_options));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.bodyParser());

// 認証の設定。
const login = new line_login({
    channel_id: "1590015276",
    channel_secret: "2fb6dfcbe678318000471b205f84829c",
    callback_url: "https://line-login-starter-2.herokuapp.com/callback",
    prompt: "consent"
});

// サーバー起動設定。
app.listen(process.env.PORT || 5000, () => {
    console.log(`server is listening to ${process.env.PORT || 5000}...`);
});




// 認証フローを開始するためのルーター設定。
app.get("/auth", login.auth());



app.set("view engine", "ejs");  
app.get("/callback", login.callback(
    (req, res, next, token_response) => {
        // 認証フロー成功時
        //res.json(token_response);
         //res.send(token_response.id_token.name);
        res.render(__dirname + "/callback",{ userInfo: token_response} );
       
        
        
    },(req, res, next, error) => {
        // 認証フロー失敗時
        res.status(400).json(error);
    }
));


// ファイルの末尾に追加
//app.use(express.static(__dirname + "/public"));

//app.set('view engine', 'pug');
//app.get("/", async (req, res) => {

/*
app.get('/', function (req, res) {
  res.render('index1', { title: 'Hey', message: 'Hello there!' });
})
*/
app.set("view engine", "ejs");  
app.get("/", async (req, res) => {
    var shopInfo = await req.param('shop');
    //await window.sessionStorage.setItem("shopname", shopInfo);
     
    var q_info = await mongoQuery(shopInfo);
    if(q_info != "failed")
    {
        if(q_info[0] == null)
        {
             await res.render(__dirname + "/index" ,{ newQ_Info: 1, shopName:  shopInfo});
        
        }
        else
        {
        var MaxQNum =0;
        for(var qIdx =0; qIdx < q_info.length; qIdx++ )
        {
            if(MaxQNum <  parseInt(q_info[qIdx].queue))
            {
                MaxQNum = await parseInt(q_info[qIdx].queue);
            }
        }
        var qNum =  await MaxQNum + 1;
        await res.render(__dirname + "/index" ,{ newQ_Info: qNum, shopName:  shopInfo});
        }
    }
    
    

    
    
});



app.get('/sitemap',function(req,res){
  res.sendFile(__dirname+'/sitemap.html');
});
/*
app.post('/insert_Q_info', function(req,res){
  //res.sendFile(__dirname+'/sitemap.html');
  //res.send("Yeah");
  res.send("Yeah");
  //var obj = JSON.parse(req.body);
  //if (obj.name == "chanon") {
    //  res.send(req.body);
  //}
  
});
*/


app.post("/insert_Q_info", async (req, res) => {
    var latest_Que = await getLatest_Que(req.body);
    
    if (latest_Que == "failed") {
        await res.send("failed");
    }
    else
    {
        await res.send(latest_Que.shopName);
    }
    
    
    /*
    else 
    {
        var resultInsert = await Insert_Que(req.body);
        if (resultInsert == "good")
        {
            if(resultInsert != null)
            {
                await res.send("Failed to Booking queue(Duplicate).");
            }
            else
            {
                clientBot_2.pushMessage(req.body.lineCode, { 
                type: "text",
                text: "Success!! You just booked Queue No. : "+ req.body.qNum +" From Shop : "+ req.body.shop +"." 
                });
                await res.send("Successfully booking queue.");
            }
           
        }
        else
        {
             await res.send("Error occurred while inserting queue data into Mlab.");
        }
       
    }
    */



});

var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017";
var url = "mongodb://chanon:chanon1234@ds121341.mlab.com:21341/linebookingsys";

function pushText(client, userID, returnStr,postBackStr) {

   return new Promise( ( resolve, reject ) => {
       
      
    resolve('gg');
        
  });
}


function mongoQuery(inputShop) {
    
    return new Promise( ( resolve, reject ) => {
   
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //var dbo = db.db("mydb");
    var dbo = db.db("linebookingsys");
    
    dbo.collection("q_info").find({ shopName: { $eq: inputShop } }).toArray( function(err, result) {
          if ( err )
          {
               db.close();
              reject( "failed" );
          }
                
           else
          {
               db.close();
                 resolve(result);
            }
        }); 
    });
   
  });
  
}    
 
function  getLatest_Que(input_Q) {
    
    return new Promise( ( resolve, reject ) => {
   
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //var dbo = db.db("mydb");
    var dbo = db.db("linebookingsys");
    let inp_q = parseInt(input_Q.qNum); 
    //dbo.collection("q_info").findOne( { queue: { $gte: in_q } } , function(err, result) {
    
   dbo.collection("q_info").find( { $and: [ { shopName: input_Q.shop }, { queue: { $gte:   inp_q   } } ] }, function(err, result)  {
    //dbo.collection("q_info").findOne( { queue: { $gte: in_q } } , function(err, result) {
         if ( err )
          {
               db.close();
              reject( "failed" );
          }
                
           else
          {
               db.close();
              resolve(result);
            }
        });
    });
   
  });
  
}    

function  Insert_Que(input_Q) {
    
    return new Promise( ( resolve, reject ) => {
   
   
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //var dbo = db.db("mydb");
    var dbo = db.db("linebookingsys");
    
    
    dbo.collection("q_info").insertOne( { shopName: input_Q.shop, queue: parseInt(input_Q.qNum), name:  input_Q.name, Line_code: parseInt(input_Q.lineCode) }, function(err, result)  {
    //dbo.collection("q_info").findOne( { queue: { $gte: in_q } } , function(err, result) {
      
       if ( err )
       {
           db.close();
           reject( "failed" );}
       
       else
       {
           db.close();
                 resolve("good");
       }
        
        
        });
    });
   
  });
  
}    