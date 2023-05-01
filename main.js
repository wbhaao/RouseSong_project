const express = require('express')
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express()
const port = 1234
const absolute_root = "C:/Users/Administrator/OneDrive/문서/test"
app.use(express.static('public'))
app.use('/static', express.static('C:/Users/Administrator/OneDrive/문서/test/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

function set_ss() {
  let comp = `
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
      <div id="music-box">
      `
    fs.readdir('public/base', function(error, filelist){
      console.log(filelist)
      for (let i = 0; i < filelist.length; i++) {
        comp += `\
        <img id="song-profile" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3UBYNoWdypJJotOReLUIC_5rjcjrZ1l2kLw&usqp=CAU" alt="">
        <div id="artist-info">
            <div id="song-sca">${filelist[i].song_name}</div>
            <div id="artist-name">${filelist[i].artist_name}</div>
        </div>
        <div id="button-group">
            <button id="play-stop-button"></button>
            <button id="reset-button"></button>
            <button id="vote-button"></button>
        </div>`
      }
      comp += `</div></div></body></html>`
    })
    console.log(comp)
    return comp
}

app.get('/', function(req,res) {
  res.send(comp)
})
app.get('/create_song', function(req,res) {
  res.sendFile(absolute_root+"/public/createSong.html")
})
app.post('/create_song_process', function(req,res) {
  let student = {
    name: `${req.body.song_name}`,
    age: `${req.body.artist_name}`,
    isAdmin: `${req.body.youtube_link}`,
  };
  let json = JSON.stringify(student);
  fs.writeFile(`public/base/${req.body.song_name}123.json`, 
      json, 'utf8', function(err){
  });
  res.writeHead(302, {Location: `/`});
  res.end();
})

app.listen(port, () => {
  console.log(`localhost:${port}`)
})