const express = require('express')
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express()
const port = 8082

let isSignin = false;
let myID = '';
let errorMessege = ''
let address = ''

app.use(express.static('public'))

app.use('/static', express.static('C:/Users/Administrator/OneDrive/문서/test/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
fs.writeFileSync('public/playmusic', '')

app.get('/error', function(req,res) {
  console.log(errorMessege)
  console.log(address)
  // res.send(`<script>alert('');</script>`)
  res.send(`<script>alert('${errorMessege}');location.href='${address}'</script>`)
})

app.get('/', function(req,res) {
  // fs.writeFile(`test.html`, '', 'utf8', function(err){
  // })
  var music_arr = [];
  let headHTML = 
  
  `
    <!doctype html>
    <html>
      <head>
          <title>RouseProject</title>
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
              
              <button class="bottom_icon fa-lg"><i class="fa-solid fa-circle-info icon fa-lg"></i>ㅤ${isSignin?`${myID}`:`내 정보`}</button>
              <button><i class="fa-solid fa-gear icon fa-lg"></i>ㅤ설정</button>
              
           
              ${isSignin?
                `<form action="/signout" method="get">
                  <input type="submit" value="로그아웃" id="signout-button">
                </form>
                <form action="/signup" method="get">
                  <input type="submit" value="회원가입" id="signup-button">
                </form>`:
                `<form action="/signin" method="get">
                  <input type="submit" value="로그인" id="signin-button">
                </form>
                <form action="/signup" method="get">
                  <input type="submit" value="회원가입" id="signup-button">
                </form>`
              }
              <form action="/create_song" method="get">
                <input type="submit" value="글쓰기" id="signout-button">
              </form>
              
            </div>
          
          <div id="contents">
              
              
      `


    data = JSON.parse(fs.readFileSync(`public/base/songList.json`, 'utf-8'))
    let i = 0;
    for (i = 0; i < Object.keys(data.song_list).length; i++) {
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
        <div id="vote-value">
          <span>
           ${data.song_list[i].vote_user_list.length}
          </span>
        </div>
        <div id="button-group">
          <form style="display:inline-block" action="/play_song" method="post">
            <input type="hidden" name="link" value="${regular_link}">
            <input id="play-stop-button" type="submit" value="재생">
          </form>
          <form style="display:inline-block" action="/play_song" method="post">
            <input type="hidden" name="link" value="" >
            <input id="play-stop-button" type="submit" value="멈춤">
          </form>
          <form style="display:inline-block" action="/vote_process" method="post">
            <input type="hidden" name="vote_i" value="${i}">
            <input id="vote-button" type="submit" value="투표">
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
    vote_user_list: []
  };
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

app.post('/signin_process', function(req, res) {
  data = JSON.parse(fs.readFileSync(`public/base/user.json`, 'utf-8'))
  for (var i = 0; i < Object.keys(data.user_list).length; i++){
    if (data.user_list[i].id == req.body.id && 
        data.user_list[i].password == req.body.password){
          isSignin = true;
          myID = req.body.id
          res.redirect('/')
          return
    }
  }
  errorMessege = '아이디를 찾을 수 없거나 아이디나 비밀번호가 잘못되었습니다'
  address = 'signin'
  res.redirect('/error')
})

app.post('/signup_process', function(req, res) {
  // 아이디 조건 : 중복 없이
  // 비번 조건 : 반복 X, 숫자만 X, 8글자 이상,
  let student = {
    id: `${req.body.id}`,
    password: `${req.body.password}`,
    grade: `${req.body.grade}`,
    class: `${req.body.class}`,
    number: `${req.body.number}`
  };
  data = JSON.parse(fs.readFileSync(`public/base/user.json`, 'utf-8'))
  // 아이디 중복 검사
  console.log("aa"+Object.keys(data.user_list).length)
  for (var i = 0; i < Object.keys(data.user_list).length; i++){
    if (data.user_list[i].id == req.body.id){
      res.redirect('/signup')
      return
    }
    if (data.user_list[i].grade == req.body.grade &&
        data.user_list[i].class == req.body.class &&
        data.user_list[i].number == req.body.number)
    {
      errorMessege = '중복된 학번이 있습니다'
      address = 'signup'
      res.redirect('/error')
      return
    }
    if (data.user_list[i].id == req.body.id){
      errorMessege = '중복된 아이디가 있습니다'
      address = 'signup'
      res.redirect('/error')
      return
    }
    if (1 != req.body.grade ||
        3 != req.body.class){
      errorMessege = '너 1학년 3반 아니잖아'
      address = 'signup'
      res.redirect('/error')
      return
    }
  }
  data.user_list[Object.keys(data.user_list).length] = student;
  fs.writeFile('public/base/user.json', JSON.stringify(data), (err)=>{ //수정된 JSON 을 파일에 적어주기
    if (err) throw err;
  });
  res.redirect('/signin')
})

app.post('/vote_process', function(req, res) {
  if (isSignin) {
    data = JSON.parse(fs.readFileSync(`public/base/songList.json`, 'utf-8'))
    let len = data.song_list[req.body.vote_i].vote_user_list.length
    console.log("len:"+data.song_list[req.body.vote_i].vote_user_list.length)
    for (let i = 0; i < len; i++) {
      if (data.song_list[req.body.vote_i].vote_user_list[i].user_name == myID){
        // data.song_list[req.body.vote_i].vote_user_list[i] = '';
        fs.writeFile('public/base/songList.json', JSON.stringify(data), (err)=>{ 
          if (err) throw err;
          fs.writeFileSync('public/playmusic', '')
          errorMessege = '이미 투표했습니다'
          address = '/'
          res.redirect('/error')
          return;
        });
        return;
      }
    }
    console.log(typeof data.song_list[req.body.vote_i].vote_user_list)
    data.song_list[req.body.vote_i].vote_user_list.push({user_name:`${myID}`});
    fs.writeFile('public/base/songList.json', JSON.stringify(data), (err)=>{ 
      if (err) throw err;
      fs.writeFileSync('public/playmusic', '')
      res.redirect('/')
      return;
    });
  }
  else{
    errorMessege = '먼저 로그인 해주세요';
    address = 'signin';
    res.redirect('/error')
  }
})

app.get('/signout', function(req, res) {
  myID = ''
  isSignin = false
  
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`localhost:${port}`)
})