const customVideoPlayer = document.getElementById('customVideoPlayer');
const videoPlayer = customVideoPlayer.querySelector('#videoPlayer');
const overlay = customVideoPlayer.querySelector('#overlay');

//Options Menu
const btnOptions = customVideoPlayer.querySelector('#btnOptions');
const options = customVideoPlayer.querySelector('#options');
const btnDownload = customVideoPlayer.querySelector('#btnDownload');
const btnPiP = customVideoPlayer.querySelector('#btnPiP');

//Playback Controls
const btnPrev = customVideoPlayer.querySelector('#btnPrev');
const loader = customVideoPlayer.querySelector('#loader');
const btnPlayPause = customVideoPlayer.querySelector('#btnPlayPause');
const btnNext = customVideoPlayer.querySelector('#btnNext');

//Progress Bar
const time = customVideoPlayer.querySelector('#time');
const btnToggleFullScreen = customVideoPlayer.querySelector('#btnToggleFullScreen');
const btnVolume = customVideoPlayer.querySelector('#btnVolume');
const rngVolume = customVideoPlayer.querySelector('#rngVolume');
const progress = customVideoPlayer.querySelector('#progress');

videoPlayer.addEventListener('loadedmetadata', e =>
{
    progress.setAttribute('max', videoPlayer.duration);

    customVideoPlayer.style.width = videoPlayer.clientWidth + 'px';
    customVideoPlayer.style.height = videoPlayer.clientHeight + 'px';
    overlay.style.width = videoPlayer.getAttribute('width') + 'px';
    overlay.style.height = videoPlayer.getAttribute('height') + 'px';

    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
    customVideoPlayer.querySelector('p.title').textContent = videoPlayer.src.split('/').slice(-1);
});

window.addEventListener('resize', e =>
{
    overlay.style.width = videoPlayer.getAttribute('width') + 'px';
    overlay.style.height = videoPlayer.getAttribute('height') + 'px';
});

customVideoPlayer.addEventListener('fullscreenchange', e =>
{
    if(!document.fullscreenElement)
    {
        videoPlayer.setAttribute('width', 720);
    }
    else
    {
        videoPlayer.setAttribute('width', window.innerWidth);
    }
    customVideoPlayer.style.width = videoPlayer.clientWidth + 'px';
    customVideoPlayer.style.height = videoPlayer.clientHeight + 'px';
    overlay.style.width = videoPlayer.getAttribute('width') + 'px';
    overlay.style.height = videoPlayer.getAttribute('height') + 'px';

});

videoPlayer.addEventListener('timeupdate', e =>
{
    progress.value = videoPlayer.currentTime;
});

videoPlayer.addEventListener('waiting', e =>
{
    btnPlayPause.style.display = 'none';
    loader.style.display = 'block';
    videoPlayer.waiting = true;
});

videoPlayer.addEventListener('canplay', e =>
{
    btnPlayPause.style.display = 'block';
    loader.style.display = 'none';
    videoPlayer.waiting = false;
});

overlay.addEventListener('mouseleave', e =>
{
    if(!videoPlayer.paused && !videoPlayer.waiting && !overlay.classList.contains('hidden'))
    {
        overlay.classList.add('hidden');
    }
});

let timeout;
overlay.addEventListener('mousemove', e =>
{
    if(overlay.classList.contains('hidden'))
    {
        overlay.classList.remove('hidden');
    }

    clearTimeout(timeout);
    timeout = setTimeout(() =>
    {
        if(!videoPlayer.paused && !videoPlayer.waiting && !overlay.classList.contains('hidden'))
        {
            overlay.classList.add('hidden');
        }
    }, 2500);
});

overlay.addEventListener('mousedown', e => 
{
    if(overlay.classList.contains('hidden'))
    {
        overlay.classList.remove('hidden');
    }
});

document.addEventListener('keydown', e =>
{
    if(e.key == 'ArrowLeft')
    {
        skip(-10);
    }
    else if(e.key == 'ArrowRight')
    {
        skip(10)
    }
});

btnOptions.addEventListener('click', e =>
{
    options.classList.toggle('hidden');
});

window.addEventListener('click', e =>
{
    if(!e.target.matches('#btnOptions'))
    {
        options.classList.add('hidden');
    }
});

btnDownload.addEventListener('click', e =>
{
    videoPlayer.download();
});

btnPiP.addEventListener('click', e=>
{
    if(!document.pictureInPictureElement)
    {
        videoPlayer.requestPictureInPicture();
    }
    else
    {
        document.exitPictureInPicture();
    }
});

btnPlayPause.addEventListener('click', playPause);

btnVolume.addEventListener('click', e =>
{
    if(videoPlayer.volume == 0)
    {
        if(rngVolume.value == 0)
        {
            rngVolume.value = 1;
        }
        videoPlayer.volume = rngVolume.value;
        btnVolume.querySelector('span').innerHTML = 'volume_up';
    }
    else if(videoPlayer.volume > 0)
    {
        videoPlayer.volume = 0;
        btnVolume.querySelector('span').innerHTML = 'volume_off';
    }
});

rngVolume.addEventListener('input', e =>
{
    if(rngVolume.value == 0)
    {
        btnVolume.querySelector('span').innerHTML = 'volume_off';
    }
    else if(rngVolume.value > 0)
    {
        btnVolume.querySelector('span').innerHTML = 'volume_up';
    }
    videoPlayer.volume = rngVolume.value;
});

btnToggleFullScreen.addEventListener('click', e =>
{
    if(!document.fullscreenElement)
    {
        btnToggleFullScreen.querySelector('span').innerHTML = 'fullscreen_exit';
        customVideoPlayer.requestFullscreen();
    }
    else
    {
        btnToggleFullScreen.querySelector('span').innerHTML = 'fullscreen';
        document.exitFullscreen();
    }
});

progress.addEventListener('input', e =>
{
    videoPlayer.currentTime = progress.value;
    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
});

function playPause()
{
    if (videoPlayer.paused || videoPlayer.ended)
    { 
        videoPlayer.play();
        btnPlayPause.querySelector('span').innerHTML = 'pause';
    }
    else
    {
        videoPlayer.pause();
        btnPlayPause.querySelector('span').innerHTML = 'play_arrow';
    }
}

function skip(amount)
{
    videoPlayer.currentTime += amount;
    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
}

function formatSeconds(seconds)
{
    var date = new Date(1970,0,1);
    date.setSeconds(seconds);

    let regex = seconds > 3600 ? /.*(\d{2}:\d{2}:\d{2}).*/ : /.*(\d{2}:\d{2}).*/;

    return date.toTimeString().replace(regex, "$1");
}