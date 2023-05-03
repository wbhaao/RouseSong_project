var player;
var playButton = document.getElementById('play-button');
var pauseButton = document.getElementById('pause-button');
var progress = document.getElementById('progress');

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'VIDEO_ID',
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'showinfo': 0,
      'rel': 0,
      'modestbranding': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  progress.style.width = '0%';
  playButton.addEventListener('click', function() {
    player.playVideo();
  });
  pauseButton.addEventListener('click', function() {
    player.pauseVideo();
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    var duration = player.getDuration();
    var interval = setInterval(function() {
      var percent = (player.getCurrentTime() / duration) * 100;
      progress.style.width = percent + '%';
    }, 10);
  } else {
    clearInterval(interval);
  }
}
