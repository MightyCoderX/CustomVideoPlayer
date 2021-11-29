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

    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
    customVideoPlayer.querySelector('p.title').textContent = videoPlayer.src.split('/').slice(-1);
});

let videoPlayerStartSize = { width: getComputedStyle(videoPlayer).width, height: getComputedStyle(videoPlayer).height };

window.addEventListener('resize', () =>
{
    videoPlayer.style.width = window.innerWidth + 'px';
    videoPlayer.style.height = window.innerHeight + 'px';
});

customVideoPlayer.addEventListener('fullscreenchange', () =>
{
    if(!document.fullscreenElement)
    {
        videoPlayer.removeAttribute('style');
    }
    else
    {
        videoPlayer.style.width = window.innerWidth + 'px';
        videoPlayer.style.height = window.innerHeight + 'px';
    }
});

videoPlayer.addEventListener('timeupdate', e =>
{
    progress.value = videoPlayer.currentTime;
    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
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
    if(e.code == 'Space')
    {
        playPause();
    }

    if(e.code == 'ArrowLeft')
    {
        skip(-10);
    }
    else if(e.code == 'ArrowRight')
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
    downloadCurrentSrc();
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
        btnVolume.querySelector('span').innerText = 'volume_up';
    }
    else if(videoPlayer.volume > 0)
    {
        videoPlayer.volume = 0;
        btnVolume.querySelector('span').innerText = 'volume_off';
    }
});

rngVolume.addEventListener('input', e =>
{
    if(rngVolume.value == 0)
    {
        btnVolume.querySelector('span').innerText = 'volume_off';
    }
    else if(rngVolume.value > 0)
    {
        btnVolume.querySelector('span').innerText = 'volume_up';
    }
    videoPlayer.volume = rngVolume.value;
});

btnToggleFullScreen.addEventListener('click', e =>
{
    if(!document.fullscreenElement)
    {
        btnToggleFullScreen.querySelector('span').innerText = 'fullscreen_exit';
        customVideoPlayer.requestFullscreen();
    }
    else
    {
        btnToggleFullScreen.querySelector('span').innerText = 'fullscreen';
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
        btnPlayPause.querySelector('span').innerText = 'pause';
    }
    else
    {
        videoPlayer.pause();
        btnPlayPause.querySelector('span').innerText = 'play_arrow';
    }
}

function skip(amount)
{
    videoPlayer.currentTime += amount;
    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
}

function downloadCurrentSrc()
{  
    const aElem = document.createElement('a');
    aElem.download = videoPlayer.currentSrc.split('/').slice(-1);
    aElem.style.display = 'none';

    fetch(videoPlayer.currentSrc)
    .then(res => res.blob())
    .then(blob =>
    {
        aElem.href = URL.createObjectURL(blob);
    })
    .catch(err =>
    {
        console.error(err);
        aElem.href = videoPlayer.currentSrc;
    })
    .finally(() =>
    {
        document.body.appendChild(aElem);
        aElem.click();
        aElem.remove();
    });

}

function formatSeconds(seconds)
{
    var date = new Date(1970,0,1);
    date.setSeconds(seconds);

    let regex = seconds > 3600 ? /.*(\d{2}:\d{2}:\d{2}).*/ : /.*(\d{2}:\d{2}).*/;

    return date.toTimeString().replace(regex, "$1");
}