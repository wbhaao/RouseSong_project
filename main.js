const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const { stringify } = require("querystring");
const app = express();
const port = 3000;

// 노래 많을 시 페이지 나누기
let page = 0;
let banword = [
  "무현",
  "노무",
  "응디시티",
  "섹스",
  "애미",
  "ㄴㅇㅁ",
  "느금",
  "시발",
  "병신",
  "일베",
  "안예성",
];
// 본명 기능 보류
// let studentName = ['강민지', '김규민', '김상윤', '김영은',
//                    '김은혜', '박수빈', '내사랑', '오아린',
//                    '오창민', '이승현', '이재현', '이준원',
//                    '전영현', '최성훈' ,'추성우', '한태영']

function dataDifference(date, time) {
  var today = new Date();

  var year = Number(today.getFullYear());
  var month = Number(("0" + (today.getMonth() + 1)).slice(-2));
  var day = Number(("0" + today.getDate()).slice(-2));

  var hours = Number(("0" + today.getHours()).slice(-2));
  var minutes = Number(("0" + today.getMinutes()).slice(-2));
  var seconds = Number(("0" + today.getSeconds()).slice(-2));

  beforeDate = String(date).split("-");
  beforeTime = String(time).split(":");

  if (year - Number(beforeDate[0]) > 0) {
    return year - Number(beforeDate[0]) + "년전";
  }
  if (month - Number(beforeDate[1]) > 0) {
    return month - Number(beforeDate[1]) + "달전";
  }
  if (day - Number(beforeDate[2]) > 0) {
    return day - Number(beforeDate[2]) + "일전";
  }
  if (hours - Number(beforeTime[0]) > 0) {
    return hours - Number(beforeTime[0]) + "시간전";
  }
  if (minutes - Number(beforeTime[1]) > 0) {
    return minutes - Number(beforeTime[1]) + "분전";
  } else {
    return "방금전";
  }
}

app.use(express.static("public"));

app.use(
  "/static",
  express.static("C:/Users/Administrator/OneDrive/문서/test/public")
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "qwewqeqw",
    resave: false,
    saveUninitialized: true,
  })
);
fs.writeFileSync("public/playmusic", "");

app.get("/error/:errorMessege", function (req, res) {
  errorMessege = req.params.errorMessege;
  errorMessege = String(errorMessege).split("$");
  // res.send(`<script>alert('');</script>`)
  console.log("errorMessege:" + errorMessege[0]);
  console.log("errorMessege:" + errorMessege[1]);

  res.send(
    `<script>alert('${errorMessege[0]}');location.href='/${errorMessege[1]}'</script>`
  );
});

app.get("/", function (req, res) {
  // fs.writeFile(`test.html`, '', 'utf8', function(err){
  // })
  var data = JSON.parse(fs.readFileSync(`public/base/songList.json`, "utf-8"));
  var music_arr = [];
  let headHTML = `
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
      <iframe style="display:none" width="1" height="1" 
      src="https://www.youtube.com/embed/${fs.readFileSync(
        "public/playmusic",
        "utf8"
      )}?autoplay=1" 
      title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
      </iframe>
          <div id="sidebar">
              <button><i class="fa-solid fa-check-to-slot icon fa-lg"></i>ㅤ홈</button>
              <button><i class="fa-solid fa-thumbs-up icon fa-lg"></i>ㅤ추천한 노래</button>
              <form action="/create_song" method="get">
                <input type="submit" value="글쓰기" id="write-button">
              </form>
              <button class="bottom_icon fa-lg"><i class="fa-solid fa-circle-info icon fa-lg"></i>ㅤ${
                !(
                  req.session.isSignin == undefined ||
                  req.session.isSignin == false
                )
                  ? `${req.session.myID}`
                  : `내 정보`
              }
              </button>
              <button><i class="fa-solid fa-gear icon fa-lg"></i>ㅤ설정</button>
              

              ${
                !(
                  req.session.isSignin == undefined ||
                  req.session.isSignin == false
                )
                  ? `<form action="/signout" method="get">
                  <input type="submit" value="로그아웃" id="signout-button">
                </form>
                <form action="/signup" method="get">
                  <input type="submit" value="회원가입" id="signup-button">
                </form>`
                  : `<form action="/signin" method="get">
                  <input type="submit" value="로그인" id="signin-button">
                </form>
                <form action="/signup" method="get">
                  <input type="submit" value="회원가입" id="signup-button">
                </form>`
              }
              
              
            </div>
          <div id="updown-div">
            <form id="down-btn" action="/down" method="get">
              <input type="submit" value="down">
            </form>
            <span>page:${page + 1}</span>
            <form id="up-btn" action="/up" method="post">
              <input  type="hidden" name="len" value="${
                Object.keys(data.song_list).length
              }" >
              <input type="submit" value="up" >
            </form>
          </div>
          <div id="contents">
      `;

  //console.log("asd:"+data.song_list[0].song_name)
  //console.log("키부터 시작:"+Object.keys(data.song_list).length-1)
  //console.log("asds:"+page)
  // 페이지별로 인덱싱
  for (
    i = page * 6;
    i < Math.min(Object.keys(data.song_list).length, 6 + page * 6);
    i++
  ) {
    //console.log("ㅁㄴㅇ부터 시작:"+data.song_list[i].song_name)
    let regular_link = data.song_list[i].youtube_link.substring(
      data.song_list[i].youtube_link.indexOf("=") + 1,
      data.song_list[i].youtube_link.indexOf("&") == -1
        ? data.song_list[i].youtube_link.length
        : data.song_list[i].youtube_link.indexOf("&")
    );
    music_arr[Object.keys(data.song_list).length - i + 1] = `
      <div id="music-box">
        <a target="_blank" href="${data.song_list[i].youtube_link}">
          <img id="song-profile" src="
          https://img.youtube.com/vi/${regular_link}/maxresdefault.jpg" alt="">
        </a>
        <div id="artist-info">
          <div id="song-name">${data.song_list[i].song_name}</div>
          <div id="artist-name">${data.song_list[i].artist_name}</div>
          <div id="author-info">글쓴이 : ${data.song_list[i].author}</div>
        </div>
        <div id="date-info">
          ${dataDifference(data.song_list[i].date, data.song_list[i].time)}
          <span >
            (${data.song_list[i].date})
          </span>
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
      `;
  }
  tail = `</div></body></html>`;
  res.send(headHTML + music_arr.join("") + tail);
});

app.get("/create_song", function (req, res) {
  console.log("create_song");
  console.log(`req.session.isSignin:${req.session.isSignin}`);
  if (!(req.session.isSignin === undefined || req.session.isSignin === false)) {
    res.sendFile(__dirname + "/public/createSong.html");
  } else {
    res.redirect("/error/먼저_로그인해주세요$signin");
    return;
  }
});
app.post("/create_song_process", function (req, res) {
  console.log("create_song_process");
  var today = new Date();
  // 날짜 구하기
  var year = today.getFullYear();
  var month = ("0" + (today.getMonth() + 1)).slice(-2);
  var day = ("0" + today.getDate()).slice(-2);
  var dateString = year + "-" + month + "-" + day;
  var hours = ("0" + today.getHours()).slice(-2);
  var minutes = ("0" + today.getMinutes()).slice(-2);
  var seconds = ("0" + today.getSeconds()).slice(-2);
  var timeString = hours + ":" + minutes + ":" + seconds;

  let student = {
    song_name: `${req.body.song_name}`,
    artist_name: `${req.body.artist_name}`,
    youtube_link: `${req.body.youtube_link}`,
    vote_user_list: [],
    author: `${req.session.myID}`,
    date: `${dateString}`,
    time: `${timeString}`,
  };
  data = JSON.parse(fs.readFileSync(`public/base/songList.json`, "utf-8"));
  // console.log("asdsads:" + Object.keys(data.song_list).length);
  // 링크가 정규식에 맞지 않다면
  // console.log("aaaaaaaaaaaaaaaaaaaa\n" + stringify(req.session));

  if (
    req.body.youtube_link.substring(
      req.body.youtube_link.indexOf("=") + 1,
      req.body.youtube_link.indexOf("&") == -1
        ? req.body.youtube_link.length
        : req.body.youtube_link.indexOf("&")
    ) == "?" ||
    req.body.youtube_link.indexOf("https://www.youtube.com/watch?v=") == -1
  ) {
    res.redirect("/error/올바른_링크가_아닙니다$create_song");
    return;
  }
  // 노래이름이나 유튜브 링크가 중복된다면
  for (var i = 0; i < Object.keys(data.song_list).length; i++) {
    if (
      data.song_list[i].song_name == req.body.song_name ||
      data.song_list[i].youtube_link == req.body.youtube_link
    ) {
      res.redirect("/error/중복된_노래가_있습니다$create_song");
      return;
    }
  }
  for (var z = 0; z < banword.length; z++) {
    if (
      req.body.song_name.indexOf(banword[z]) != -1 ||
      req.body.artist_name.indexOf(banword[z]) != -1
    ) {
      res.redirect(
        "/error/노래_제목_또는_작곡가에_금지어가_포함되어_있습니다$create_song"
      );
      return;
    }
  }
  data.song_list[Object.keys(data.song_list).length] = student;
  fs.writeFile("public/base/songList.json", JSON.stringify(data), (err) => {
    //수정된 JSON 을 파일에 적어주기
    if (err) throw err;
    fs.writeFileSync("public/playmusic", "");
    res.redirect("/");
  });
});

app.post("/play_song", function (req, res) {
  fs.writeFileSync("public/playmusic", req.body.link);
  res.redirect("/");
});

app.get("/signin", function (req, res) {
  res.sendFile(__dirname + "/public/signin.html");
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/public/signup.html");
});

app.post("/signin_process", function (req, res) {
  data = JSON.parse(fs.readFileSync(`public/base/user.json`, "utf-8"));
  for (var i = 0; i < Object.keys(data.user_list).length; i++) {
    if (
      data.user_list[i].id == req.body.id &&
      data.user_list[i].password == req.body.password
    ) {
      req.session.isSignin = true;
      req.session.myID = req.body.id;
      res.redirect("/");
      return;
    }
  }
  res.redirect(
    "/error/아이디를_찾을_수_없거나_아이디나_비밀번호가_잘못되었습니다$signin"
  );
});

app.post("/signup_process", function (req, res) {
  // 아이디 조건 : 중복 없이
  // 비번 조건 : 반복 X, 숫자만 X, 8글자 이상,
  let student = {
    id: `${req.body.id}`,
    password: `${req.body.password}`,
    grade: `${req.body.grade}`,
    class: `${req.body.class}`,
    number: `${req.body.number}`,
  };
  data = JSON.parse(fs.readFileSync(`public/base/user.json`, "utf-8"));
  // 아이디 중복 검사
  console.log("aa" + Object.keys(data.user_list).length);
  for (var i = 0; i < Object.keys(data.user_list).length; i++) {
    if (
      data.user_list[i].grade == req.body.grade &&
      data.user_list[i].class == req.body.class &&
      data.user_list[i].number == req.body.number
    ) {
      res.redirect("/error/중복된_학번이_있습니다&signup");
      return;
    }
    if (data.user_list[i].id == req.body.id) {
      res.redirect("/error/중복된_아이디가_있습니다$signup");
      return;
    }
  }
  data.user_list[Object.keys(data.user_list).length] = student;
  fs.writeFile("public/base/user.json", JSON.stringify(data), (err) => {
    //수정된 JSON 을 파일에 적어주기
    if (err) throw err;
  });
  res.redirect("/signin");
});

app.post("/vote_process", function (req, res) {
  if (req.session.isSignin == undefined ? false : req.session.isSignin) {
    data = JSON.parse(fs.readFileSync(`public/base/songList.json`, "utf-8"));
    let len = data.song_list[req.body.vote_i].vote_user_list.length;
    console.log("len:" + data.song_list[req.body.vote_i].vote_user_list.length);
    for (let i = 0; i < len; i++) {
      if (
        data.song_list[req.body.vote_i].vote_user_list[i].user_name ==
        req.session.myID
      ) {
        // data.song_list[req.body.vote_i].vote_user_list[i] = '';
        fs.writeFile(
          "public/base/songList.json",
          JSON.stringify(data),
          (err) => {
            if (err) throw err;
            fs.writeFileSync("public/playmusic", "");
            res.redirect("/error/이미_투표했습니다$");
            return;
          }
        );
        return;
      }
    }
    console.log(typeof data.song_list[req.body.vote_i].vote_user_list);
    data.song_list[req.body.vote_i].vote_user_list.push({
      user_name: `${req.session.myID}`,
    });
    fs.writeFile("public/base/songList.json", JSON.stringify(data), (err) => {
      if (err) throw err;
      fs.writeFileSync("public/playmusic", "");
      res.redirect("/");
      return;
    });
  } else {
    res.redirect("/error/먼저_로그인_해주세요$signin");
  }
});

app.get("/signout", function (req, res) {
  req.session.myID = undefined;
  req.session.isSignin = false;

  res.redirect("/");
});

app.get("/down", function (req, res) {
  page = Math.max(page - 1, 0);
  console.log("page:" + page);
  res.redirect("/");
});

app.post("/up", function (req, res) {
  page = Math.min(page + 1, Math.floor(req.body.len / 6));
  console.log("page:" + page);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
