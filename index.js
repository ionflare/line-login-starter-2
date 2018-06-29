"use strict";

require("dotenv").config();

// ライブラリのインポート。
const express = require("express");
const app = express();
const line_login = require("line-login");
const session = require("express-session");
const session_options = {
    secret: "2fb6dfcbe678318000471b205f84829c",
    resave: false,
    saveUninitialized: false
}
app.use(session(session_options));

// 認証の設定。
const login = new line_login({
    channel_id: "1590015276",
    channel_secret: "2fb6dfcbe678318000471b205f84829c",
    callback_url: "https://line-login-starter-2.herokuapp.com/callback"
});

// サーバー起動設定。
app.listen(process.env.PORT || 5000, () => {
    console.log(`server is listening to ${process.env.PORT || 5000}...`);
});

// 認証フローを開始するためのルーター設定。
app.get("/auth", login.auth());

// ユーザーが承認したあとに実行する処理のためのルーター設定。
app.get("/callback", login.callback(
    (req, res, next, token_response) => {
        // 認証フロー成功時
        res.json(token_response);
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
app.get("/index", async (req, res) => {
    var shopInfo = req.param('shop');
    await window.sessionStorage.setItem("shopname", shopInfo);
    var q_info = await mongoQuery();
    await res.render(__dirname + "/index" ,{ posts: q_info, shopName:  shopInfo});
    
    
    
});


/*
app.set("view engine", "ejs");  
app.get('/', function(req, res, next) {  
   let blogPosts = [
        {
            title: 'Perk is for real!',
            body: '...',
            author: 'Aaron Larner',
            publishedAt: new Date('2016-03-19'),
            createdAt: new Date('2016-03-19')
        },
        {
            title: 'Development continues...',
            body: '...',
            author: 'Aaron Larner',
            publishedAt: new Date('2016-03-18'),
            createdAt: new Date('2016-03-18')
        },
        {
            title: 'Welcome to Perk!',
            body: '...',
            author: 'Aaron Larner',
            publishedAt: new Date('2016-03-17'),
            createdAt: new Date('2016-03-17')
        }
    ]
    
    
    res.render(__dirname + "/index" ,{ posts: blogPosts });
    //var q_info = await mongoQuery();
   //await res.render('index1', { title: 'Hey', message: 'xxx' })
   //await res.render(__dirname + "/index");
   //var q_info = await mongoQuery();
   //await res.send(q_info[0].queue);
   //await res.send(q_info.queue.toString());
// var geo = await testGeoIP("58.10.224.143");  
});
*/


app.get('/sitemap',function(req,res){
  res.sendFile(__dirname+'/sitemap.html');
});







var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017";
var url = "mongodb://chanon:chanon1234@ds121341.mlab.com:21341/linebookingsys";

/*
function mongoQuery() {
    
    return new Promise( ( resolve, reject ) => {
   
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //var dbo = db.db("mydb");
    var dbo = db.db("linebookingsys");
    var query = { name: "chanon"};
    dbo.collection("q_info").find(query).toArray(function(err, result)

    {
    if (err) { return reject( err );}
    else{
        resolve(result);
    }
    db.close();
    });
    });
  });
}    
*/
function mongoQuery() {
    
    return new Promise( ( resolve, reject ) => {
   
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //var dbo = db.db("mydb");
    var dbo = db.db("linebookingsys");
    
    dbo.collection("q_info").findOne({}, function(err, result) {
      
       if ( err )
       return reject( err );
        else
                {
                 resolve(result);
                }
        //if (err) throw err;
        //console.log(result.name + " " +result.address);
        db.close();
        });
    });
   
  });
  
}    
 