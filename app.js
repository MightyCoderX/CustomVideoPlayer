const customVideoPlayer = document.getElementById('customVideoPlayer');
const videoPlayer = customVideoPlayer.querySelector('video#videoPlayer');
const overlay = customVideoPlayer.querySelector('#overlay');

//Options Menu
const btnOptions = customVideoPlayer.querySelector('#btnOptions');
const optionsUl = customVideoPlayer.querySelector('#options');

const optionsMenu = [
    {
        id: 'download',
        label: 'Download',
        icon: 'download',
        action: downloadCurrentSrc
    },
    {
        id: 'pip',
        label: 'Picture in Picture',
        icon: 'picture_in_picture_alt',
        action()
        {
            if(!document.pictureInPictureElement)
            {
                videoPlayer.requestPictureInPicture();
            }
            else
            {
                document.exitPictureInPicture();
            }
        }
    },
    {
        id: 'speed',
        label: 'Playback Speed',
        icon: 'speed',
        currentValue: () => videoPlayer.playbackRate,
        action(value)
        {
            videoPlayer.playbackRate = value;
        },
        values: [
            0.1,
            0.25,
            0.5,
            0.75,
            1,
            1.25,
            1.5,
            1.75,
            2,
            2.5,
            4
        ]
    }
];

//Playback Controls
const loader = customVideoPlayer.querySelector('#loader');
const btnPlayPause = customVideoPlayer.querySelector('#btnPlayPause');
const btnPrev = customVideoPlayer.querySelector('#btnPrev');
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

    if(videoPlayer.paused)
    {
        btnPlayPause.querySelector('span').innerText = 'play_arrow';
    }

    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
    customVideoPlayer.querySelector('p.title').textContent = videoPlayer.src.split('/').slice(-1);
});

let videoPlayerStartSize = { width: getComputedStyle(videoPlayer).width, height: getComputedStyle(videoPlayer).height };

window.addEventListener('resize', () =>
{
    if(!document.fullscreenElement) return;
    
    videoPlayer.style.width = window.innerWidth + 'px';
    videoPlayer.style.height = window.innerHeight + 'px';
});

customVideoPlayer.addEventListener('fullscreenchange', e =>
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

videoPlayer.addEventListener('play', e =>
{
    btnPlayPause.querySelector('span').innerText = 'pause';
});

videoPlayer.addEventListener('pause', e =>
{
    btnPlayPause.querySelector('span').innerText = 'play_arrow';
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

window.addEventListener('keydown', e =>
{
    if(e.code === 'Space')
    {
        e.preventDefault();
        playPause();
    }

    if(e.code === 'ArrowLeft')
    {
        skip(-10);
    }
    else if(e.code === 'ArrowRight')
    {
        skip(10);
    }

    if(e.key === 'm')
    {
        toggleMute();
    }

    if(e.key === 'f')
    {
        toggleFullScreen();
    }
});

btnOptions.addEventListener('click', e =>
{
    if(optionsUl.classList.contains('hidden'))
    {
        generateOptionsMenu();
    }
    optionsUl.classList.toggle('hidden');
});

window.addEventListener('click', e =>
{
    if(!e.path.includes(document.querySelector('.options-dropdown')))
    {
        optionsUl.classList.add('hidden');
    }
});

let currentEp = 1;
const episodeCount = 900;

btnPrev.addEventListener('click', e => changeEp(-1));

btnNext.addEventListener('click', e => changeEp(1));

function generateOptionsMenu()
{
    optionsUl.innerHTML = '';
    for(const option of optionsMenu)
    {
        const optionLi = document.createElement('li');

        const optionBtn = document.createElement('button');
        optionBtn.classList.add('player-button');
        
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('material-icons');
        iconSpan.innerText = option.icon;

        optionBtn.appendChild(iconSpan);

        optionBtn.innerHTML += ` ${option.label}`;

        optionLi.appendChild(optionBtn);

        if(option?.values)
        {
            optionBtn.addEventListener('click', e =>
            {
                optionsUl.innerHTML = '';
                for(const value of option.values)
                {
                    const valueLi = document.createElement('li');

                    const valueBtn = document.createElement('button');
                    valueBtn.classList.add('player-button');

                    const checkmarkSpan = document.createElement('span');
                    checkmarkSpan.classList.add('material-icons');

                    if(value === option.currentValue())
                    {
                        checkmarkSpan.innerText = 'checkmark';
                        valueLi.classList.add('selected');
                    }

                    valueBtn.addEventListener('click', e =>
                    {
                        option.action(value);
                        optionsUl.classList.add('hidden');
                        

                        for(const li of optionsUl.querySelectorAll('li'))
                        {
                            if(e.target === li.querySelector('button'))
                            {
                                li.querySelector('span').innerText = 'checkmark';
                                li.classList.add('selected');
                            }
                            else
                            {
                                li.querySelector('span').innerText = '';
                                li.querySelector('span').classList.add('remove');
                            }
                        }
                    });
                    
                    valueBtn.appendChild(checkmarkSpan);

                    valueBtn.innerHTML += ` ${value}x`;

                    valueLi.appendChild(valueBtn);
                    optionsUl.appendChild(valueLi);
                }

                optionsUl.querySelector('li.selected')?.scrollIntoView?.();
            });
        }
        else
        {
            optionBtn.addEventListener('click', option.action);
            optionsUl.classList.add('hidden');
        }

        optionsUl.appendChild(optionLi);
    }
}

btnPlayPause.addEventListener('click', () => playPause());

btnVolume.addEventListener('click', toggleMute);

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

btnToggleFullScreen.addEventListener('click', toggleFullScreen);

progress.addEventListener('input', e =>
{
    videoPlayer.currentTime = progress.value;
    time.textContent = `${formatSeconds(videoPlayer.currentTime)} / ${formatSeconds(videoPlayer.duration)}`;
});

function playPause()
{
    if(videoPlayer.paused || videoPlayer.ended)
    { 
        videoPlayer.play();
    }
    else
    {
        videoPlayer.pause();
    }
}

function changeEp(dir)
{
    if(dir ===  1 && currentEp >= episodeCount) return;
    if(dir === -1 && currentEp <= 1) return;
    currentEp += dir;
    videoPlayer.src = `https://server22.streamingaw.online/DDL/ANIME/OnePieceITA/OnePiece_Ep_${String(currentEp).padStart(3, '0')}_ITA.mp4`;

    console.log(currentEp);
}

function toggleFullScreen()
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
}

function toggleMute()
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

    if(date.toTimeString() == 'Invalid Date')
    {
        return '00:00';
    }

    return date.toTimeString().replace(regex, "$1");
}