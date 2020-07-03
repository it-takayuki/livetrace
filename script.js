$(function() {

  const video = document.getElementById("video-player");
  const fileSelector = document.getElementById("video-file");
  const videoSelectButton = document.getElementById("video-select");

  const $playTimeBar = $('#play-time-bar');

  $('#play-pause').on('click', function() {
    if ($(this).hasClass('play')) {
      video.pause();
      $(this).removeClass('play');
      $(this).html('<i class="fas fa-play"></i>');
    } else {
      video.play();
      $(this).addClass('play');
      $(this).html('<i class="fas fa-pause"></i>');
    }
  });

  $playTimeBar.on('change', function() {
    video.currentTime = $(this).val();
  });
  
  videoSelectButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileSelector.click();
  });

  video.addEventListener('loadedmetadata', function() {
    $playTimeBar.attr('max', video.duration);

    const gcd = function(x, y) {
      if (y === 0) return x;
      return gcd(y, x % y);
    };

    const vW = video.videoWidth;
    const vH = video.videoHeight;

    const g = gcd(vW, vH);
    const chMag = (vH / g) / (vW / g);

    cW = 200;
    cH = cW * chMag;
  });

  fileSelector.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file.type.match("video.*")) {
      console.log("This file is not video.");
      return;
    }
    video.src = window.URL.createObjectURL(file);
    video.play();

    $('#play-pause').addClass('play');
    $('#play-pause').html('<i class="fas fa-pause"></i>');
  });

  video.addEventListener("timeupdate", () => {
    $playTimeBar.val(video.currentTime);
    if (video.currentTime === video.duration) {
      $('#play-pause').removeClass('play');
      $('#play-pause').html('<i class="fas fa-undo"></i>');
    } else if (!$('#play-pause').hasClass('play')) {
      $('#play-pause').html('<i class="fas fa-play"></i>');
    }
  });

  $playTimeBar.on({
    'mousemove': function(e) {
      const percent = (e.pageX - ($playTimeBar[0].getBoundingClientRect().left + window.pageXOffset)) / $playTimeBar[0].clientWidth;
      video.currentTime = video.duration * percent;
      const canvas = document.getElementById("c");
	    canvas.getContext("2d").drawImage(video, 0, 0, cW, cH);
    },
    'mouseleave': function() {
      console.log('マウスが離れた！');
    }
  });

});
