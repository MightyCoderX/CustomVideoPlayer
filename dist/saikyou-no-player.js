const saikyouNoPlayerTemplate = document.createElement('template');

saikyouNoPlayerTemplate.innerHTML = `
    <style>
        *
        {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: sans-serif;
        }
        
        .player-button
        {
            --font-size: 2.5rem;
            cursor: pointer;
            background: transparent;
            border: none;
            color: white;
            outline: none;
            transition: color 0.1s;
            height: var(--font-size);
            width: var(--font-size);
        }
        
        .player-button span
        {
            font-size: var(--font-size);
            pointer-events: none;
        }
        
        .player-button:active
        {
            color: #ccc;
        }
        
        .custom-video-player
        {
            background: #050505;
            position: relative;
            display: grid;
            place-items: center;
            width: max-content;
            height: max-content;
        }
        
        .custom-video-player *
        {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        
        .custom-video-player video
        {
            display: block;
            aspect-ratio: 16 / 9;
            width: 90vmin;
            object-fit: contain;
        }
        
        .custom-video-player .overlay
        {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            transition: opacity 0.5s;
            display: grid;
            grid-template-rows: max-content 1fr 2.5rem max-content;
            place-items: center;
            grid-template-areas: 
                "title-bar"
                "playback-controls"
                "progress-controls"
                "progress-bar";
            padding: 0.5rem;
        }
        
        .custom-video-player .overlay.hidden
        {
            opacity: 0;
            cursor: none;
        }
        
        .custom-video-player .overlay.hidden *
        {
            pointer-events: none;
        }
        
        .custom-video-player .overlay.hidden #btnPlayPause
        {
            pointer-events: all;
        }
        
        .custom-video-player .overlay .title-bar
        {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            grid-area: title-bar;
        }
        
        .custom-video-player .title-bar .title
        {
            color: white;
            width: 60%;
            display: block;
            text-overflow: ellipsis;
            overflow: hidden;
            height: max-content;
        }
        
        .custom-video-player .title-bar .options-dropdown .options-button.player-button
        {
            display: block;
            text-align: left;
            --font-size: 1.5rem;
        }
        
        .custom-video-player .title-bar .options-dropdown .options
        {
            position: absolute;
            right: 0;
            top: 35px;
            background: #222;
            width: max-content;
            min-width: 10rem;
            max-height: 50vh;
            font-size: 20px;
            list-style: none;
            border-radius: 5px;
            overflow: auto;
            z-index: 2;
        }
        
        .custom-video-player .title-bar .options-dropdown .options.hidden
        {
            opacity: 0;
            pointer-events: none;
        }
        
        .custom-video-player .title-bar .options-dropdown .options button
        {
            font-size: 15px;
            display: flex;
            align-items: center;
            padding: 30px 20px;
            width: 100%;
        }
        
        .custom-video-player .title-bar .options-dropdown .options button:hover
        {
            background-color: #333;
        }
        
        .custom-video-player .title-bar .options-dropdown .options button span
        {
            font-size: 1.5rem;
            margin-right: 20px;
            pointer-events: none;
            width: 1.5rem;
        }
        
        .custom-video-player .playback-controls
        {
            grid-area: playback-controls;
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-top: 1.5rem;
        }
        
        .custom-video-player .loader 
        {
            border: 2px solid transparent;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            animation: spin 2s linear infinite;
            pointer-events: none;
            display: none;
        }
        
        @keyframes spin
        {
            to { transform: rotate(360deg); }
        }
        
        .custom-video-player .playback-controls button:active
        {
            color: #ccc;
        }
        
        .custom-video-player .overlay .progress-controls
        {
            grid-area: progress-controls;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .custom-video-player .overlay .progress
        {
            grid-area: progress-bar;
            width: 100%;
            border-radius: 10px;
            cursor: pointer;
            background-color: transparent;
            accent-color: #fff;
        }
        
        .custom-video-player .overlay .progress:focus
        {
            outline: none;
        }
        
        .custom-video-player .overlay .progress::-webkit-slider-runnable-track
        {
            background: rgba(255, 255, 255, 0.2);
            height: 7.5px;
            position: relative;
            border-radius: 100vh;
        }
        
        .custom-video-player .overlay .progress::-webkit-slider-thumb
        {
            width: 14px;
            height: 14px;
            transform: translateY(-50%);
            margin-top: 3.75px;
            box-shadow: 0 0 5px #000000;
            border-radius: 50%;
        }
        
        .custom-video-player .progress-controls .time
        {
            color: white;
            font-size: 14px;
        }
        
        .custom-video-player .progress-controls button
        {
            --font-size: 24px;
        }
        
        .custom-video-player .progress-controls .box .volume
        {
            display: inline-flex;
            border-radius: 100rem;
            position: relative;
        }
        
        .custom-video-player .progress-controls .volume .volume-slider
        {
            border-radius: 10px;
            cursor: pointer;
            background-color: transparent;
            opacity: 0;
            height: 24px;
            width: 0;
            pointer-events: none;
            transition: opacity 0.5s, width 0.5s;
            accent-color: #fff;
        }
        
        .custom-video-player .progress-controls .volume:hover .volume-slider
        {
            opacity: 1;
            pointer-events: all;
            width: 100px;
        }
        
        .custom-video-player .progress-controls .volume .volume-slider:focus
        {
            outline: none;
        }
        
        .custom-video-player .progress-controls .volume .volume-slider::-webkit-slider-runnable-track
        {
            height: 8px;
            position: relative;
            border-radius: 10px;
        }
        
        .custom-video-player .progress-controls .volume .volume-slider::-webkit-slider-thumb
        {
            width: 15px;
            height: 15px;
            transform: translateY(-50%);
            margin-top: 4px;
            box-shadow: 0 0 5px #000000;
            border-radius: 50%;
        }
    </style>
    <div id="customVideoPlayer" class="custom-video-player">
        <video width="720" id="videoPlayer" class="video" src="" preload="metadata"></video>
        <div id="overlay" class="overlay">
            <div id="titleBar" class="title-bar">
                <p id="title" class="title"></p>
                <div class="options-dropdown">
                    <button id="btnOptions" class="options-button player-button"><span class="material-icons">settings</span></button>
                    <ul id="options" class="options hidden"></ul>
                </div>
            </div>
            <div id="playbackControls" class="playback-controls">
                <button class="player-button" id="btnPrev"><span class="material-icons">skip_previous</span></button>
                <div id="loader" class="loader"></div>
                <button class="player-button" id="btnPlayPause"><span class="material-icons">play_arrow</span></button>
                <button class="player-button" id="btnNext"><span class="material-icons">skip_next</span></button>
            </div>
            <div id="progressControls" class="progress-controls">
                <span id="time" class="time">00:00 / 00:00</span>
                <div class="box">
                    <div id="volume" class="volume">
                        <input id="rngVolume" class="volume-slider" type="range" min="0" max="1" step="0.01" value="1">
                        <button id="btnVolume" class="player-button"><span class="material-icons">volume_up</span></button>
                    </div>
                    <button id="btnToggleFullScreen" class="player-button" id="btnToggleFullScreen"><span class="material-icons">fullscreen</span></button>
                </div>
            </div>
            <input type="range" id="progress" class="progress" min="0" value="0">
        </div>
    </div>
`;

class SaikyouNoPlayer extends HTMLElement
{
    constructor()
    {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(saikyouNoPlayerTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        const customVideoPlayer = this.shadow.getElementById('customVideoPlayer');
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

        //Properties
        const props = {
            srcTemplateUrl: this.getAttribute('src-template-url'),

        }

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

            const epNum = props.srcTemplateUrl
                .substring(
                    props.srcTemplateUrl.indexOf('{')+1, 
                    props.srcTemplateUrl.indexOf('}')
                );

            videoPlayer.src = props.srcTemplateUrl.replace('\{\d+\}', String(currentEp).padStart(epNum.length, '0'));

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
    }
}

customElements.define('saikyou-no-player', SaikyouNoPlayer);