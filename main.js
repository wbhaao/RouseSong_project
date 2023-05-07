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
fs.writeFileSync('public/playmusic', '')

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
          <link rel="stylesheet" href="css/index.css">
          <script src="public/js/link.js"></script>
          </head>
      <body>
      <iframe style="display:none" width="560" height="315" 
      src="https://www.youtube.com/embed/${fs.readFileSync('public/playmusic', 'utf8')}?autoplay=1" 
      title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
      </iframe>
          
          <div id="sidebar">
              <button><i class="fa-solid fa-check-to-slot icon fa-lg"></i>ㅤ노래 투표</button>
              <button><i class="fa-solid fa-thumbs-up icon fa-lg"></i>ㅤ추천한 노래</button>
              <button><i class="fa-solid fa-mask icon fa-lg"></i></i>ㅤ커뮤니티</button>
              
              <button class="bottom_icon fa-lg"><i class="fa-solid fa-circle-info icon fa-lg"></i>ㅤ내 정보</button>
              <button><i class="fa-solid fa-gear icon fa-lg"></i>ㅤ설정</button>
              <form action="/signin" method="get">
                <input type="submit" value="로그인" id="signin-button">
              </form>
              <form action="/signup" method="get">
                <input type="submit" value="회원가입" id="signup-button">
              </form>
            </div>
          
          <div id="contents">
              <form action="/create_song">
                  <input type="submit" value="글쓰기" id="write-button">
              </form>
              
      `
    data = JSON.parse(fs.readFileSync(`public/base/songList.json`, 'utf-8'))
    console.log(Object.keys(data.song_list).length)
    for (let i = 0; i < Object.keys(data.song_list).length; i++) {
      console.log(i)
      let regular_link = data.song_list[i].youtube_link.substring((data.song_list[i].youtube_link.indexOf('=')+1), data.song_list[i].youtube_link.indexOf("&")==-1?data.song_list[i].youtube_link.length:data.song_list[i].youtube_link.indexOf("&"))
      music_arr[i] = `
      <div id="music-box">
        <img id="song-profile" src="
        https://img.youtube.com/vi/${
          regular_link}/maxresdefault.jpg" alt="">
        <div id="artist-info">
            <div id="song-name">${data.song_list[i].song_name}</div>
            <div id="artist-name">${data.song_list[i].artist_name}</div>
        </div>
        <div id="button-group">
          <form style="display:inline-block" action="/play_song" method="post">
            <input type="hidden" name="link" value="${regular_link}">
            <input id="play-stop-button" type="submit">
          </form>
          <form style="display:inline-block" action="/play_song" method="post">
            <input type="hidden" name="link" value="">
            <input id="play-stop-button" type="submit">
          </form>
          <form style="display:inline-block" action="/play_song" method="post">
            <input type="hidden" name="vote" value="">
            <input id="vote-button" type="submit">
          </form>
        </div>
      </div>
      `
    }
    tail = `</div></body></html>`
    res.send(headHTML+music_arr.join('')+tail)
})



app.get('/create_song', function(req,res) {
  res.sendFile(__dirname+'/public/createSong.html')
})
app.post('/create_song_process', function(req,res) {
  let student = {
    song_name: `${req.body.song_name}`,
    artist_name: `${req.body.artist_name}`,
    youtube_link: `${req.body.youtube_link}`,
  };
  console.log("a:"+typeof student)
  console.log("a:"+typeof json)
  data = JSON.parse(fs.readFileSync(`public/base/songList.json`, 'utf-8'))
  data.song_list[Object.keys(data.song_list).length] = student;
  fs.writeFile('public/base/songList.json', JSON.stringify(data), (err)=>{ //수정된 JSON 을 파일에 적어주기
    if (err) throw err;
    fs.writeFileSync('public/playmusic', '')
    res.redirect('/')
  });
})

app.post('/play_song', function(req, res) {
  fs.writeFileSync('public/playmusic', req.body.link)
  res.redirect('/')
})

app.get('/signin', function(req, res) {
  res.sendFile(__dirname+'/public/signin.html')
})

app.get('/signup', function(req, res) {
  res.sendFile(__dirname+'/public/signup.html')
})

app.listen(port, () => {
  console.log(`localhost:${port}`)
})