const express = require('express')
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express()
const port = 8082
const absolute_root = "C:/Users/Administrator/OneDrive/문서/test"
app.use(express.static('public'))
app.use('/static', express.static('C:/Users/Administrator/OneDrive/문서/test/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
var comp = '';

app.get('/', function(req,res) {
  // fs.writeFile(`test.html`, '', 'utf8', function(err){
  // })
  var music_arr = [];
  let headHTML = `
    <!doctype html>
    <html>
      <head>
          <title>asdsadsad</title>
          <script src="https://use.fontawesome.com/releases/v6.4.0/js/all.js"></script>
          <link rel="stylesheet" href="css/reset.css">
          <link rel="stylesheet" href="css/a.css">
      </head>
      <body>
          <div id="sidebar">
              <button><i class="fa-solid fa-check-to-slot icon fa-lg"></i>ㅤ노래 투표</button>
              <button><i class="fa-solid fa-thumbs-up icon fa-lg"></i>ㅤ노래 추천</button>
              <button><i class="fa-solid fa-mask icon fa-lg"></i></i>ㅤ커뮤니티</button>
              
              <button class="bottom_icon fa-lg"><i class="fa-solid fa-circle-info icon fa-lg"></i>ㅤ내 정보</button>
              <button><i class="fa-solid fa-gear icon fa-lg"></i>ㅤ설정</button>
          </div>
          
          <div id="contents">
              <div id="state">
                  현재 페이지
              </div>
              <form action="/create_song">
                  <input type="submit" value="글쓰기" id="write-button">
              </form>
              
      `
    filelist = fs.readdirSync('public/base')
    console.log(filelist)
    for (let i = 0; i < filelist.length; i++) {
      data = JSON.parse(fs.readFileSync(`public/base/${filelist[i]}`, 'utf-8'))
      console.log('ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ')
      console.log(data)
      console.log(data.song_name)
      console.log(data.artist_name)
      console.log('ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ')
      music_arr[i] = `
      <div id="music-box">
        <img id="song-profile" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3UBYNoWdypJJotOReLUIC_5rjcjrZ1l2kLw&usqp=CAU" alt="">
        <div id="artist-info">
            <div id="song-name">${data.song_name}</div>
            <div id="artist-name">${data.artist_name}</div>
        </div>
        <div id="button-group">
            <button id="play-stop-button"></button>
            <button id="reset-button"></button>
            <button id="vote-button"></button>
        </div>
      </div>
      `
    }
    tail = `</div></body></html>`
    console.log(headHTML+music_arr.join('')+tail)
    res.send(headHTML+music_arr.join('')+tail)
})



app.get('/create_song', function(req,res) {
  res.sendFile(absolute_root+"/public/createSong.html")
})
app.post('/create_song_process', function(req,res) {
  let student = {
    song_name: `${req.body.song_name}`,
    artist_name: `${req.body.artist_name}`,
    youtube_link: `${req.body.youtube_link}`,
  };
  let json = JSON.stringify(student);
  fs.writeFile(`public/base/${req.body.song_name}123.json`, 
      json, 'utf8', function(err){
  });
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`localhost:${port}`)
})