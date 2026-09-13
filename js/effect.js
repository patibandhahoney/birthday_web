/**
 * ✨ MAGICAL BIRTHDAY CELEBRATION SCRIPT (BESTIE EDITION) ✨
 * Fully equipped with Live Webcam, Responsive Photo Sizing, Confetti, SFX, Surprise Note & Interactive Cake
 */

// ==========================================================================
// 1. WEB AUDIO SYNTHESIZER FOR SOUND EFFECTS & AIRHORNS
// ==========================================================================
var SoundFX = (function() {
    var audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone(freq, type, duration, delay, gainValue) {
        try {
            var ctx = getAudioContext();
            if (!ctx) return;
            
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            
            var startTime = ctx.currentTime + (delay || 0);
            var endTime = startTime + duration;
            
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            
            gain.gain.setValueAtTime(gainValue || 0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, endTime);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(endTime);
        } catch (e) {}
    }

    return {
        // Magical chime on button step
        chime: function() {
            var notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach(function(freq, i) {
                playTone(freq, 'triangle', 0.35, i * 0.08, 0.12);
            });
        },
        // Camera shutter click
        shutter: function() {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var node = ctx.createBufferSource();
                var buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
                var data = buffer.getChannelData(0);
                for (var i = 0; i < buffer.length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                node.buffer = buffer;
                var gain = ctx.createGain();
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
                node.connect(gain);
                gain.connect(ctx.destination);
                node.start();
                playTone(800, 'sine', 0.12, 0.04, 0.15);
            } catch(e) {}
        },
        // Balloon pop sound
        pop: function() {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.4, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } catch(e) {}
        },
        // Magic sparkle sound for candle flame
        sparkle: function() {
            var freqs = [880, 1174.66, 1396.91, 1760, 2093];
            freqs.forEach(function(f, i) {
                playTone(f, 'sine', 0.35, i * 0.06, 0.08);
            });
        },
        // Candle blow-out whoosh
        whoosh: function() {
            playTone(220, 'sine', 0.3, 0, 0.2);
            playTone(180, 'triangle', 0.35, 0.05, 0.15);
        },
        // Funny Party Airhorn / Fanfare
        airhorn: function() {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var baseNotes = [466.16, 466.16, 466.16, 622.25]; // Bb4, Bb4, Bb4, Eb5
                baseNotes.forEach(function(f, i) {
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();
                    var t = ctx.currentTime + (i * 0.12);
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(f, t);
                    gain.gain.setValueAtTime(0.2, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(t);
                    osc.stop(t + 0.25);
                });
            } catch(e) {}
        }
    };
})();

// ==========================================================================
// 2. AMBIENT STARRY DUST BACKGROUND PARTICLES
// ==========================================================================
(function initAmbientCanvas() {
    var canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var width = 0, height = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    var particleCount = Math.min(65, Math.floor(window.innerWidth / 22));
    for (var i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2.5 + 0.8,
            speedY: -(Math.random() * 0.4 + 0.15),
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.7 + 0.3,
            pulse: Math.random() * 0.03 + 0.01,
            color: ['#ffd700', '#ff69b4', '#00f2fe', '#ffffff', '#ff9a9e'][Math.floor(Math.random() * 5)]
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.y += p.speedY;
            p.x += p.speedX;
            p.opacity += Math.sin(Date.now() * 0.002 + i) * 0.01;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));
            ctx.shadowBlur = p.size * 3;
            ctx.shadowColor = p.color;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        requestAnimationFrame(render);
    }
    render();
})();

// ==========================================================================
// 3. CONFETTI CANNON ENGINE
// ==========================================================================
var Confetti = {
    fireCannon: function() {
        if (typeof confetti !== 'function') return;
        confetti({
            particleCount: 75,
            angle: 60,
            spread: 65,
            origin: { x: 0, y: 0.85 },
            colors: ['#ff416c', '#ff4b2b', '#ffd700', '#00f2fe', '#99c96a', '#8377e4']
        });
        confetti({
            particleCount: 75,
            angle: 120,
            spread: 65,
            origin: { x: 1, y: 0.85 },
            colors: ['#ff416c', '#ff4b2b', '#ffd700', '#00f2fe', '#99c96a', '#8377e4']
        });
    },
    fireCandleBurst: function() {
        if (typeof confetti !== 'function') return;
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { x: 0.5, y: 0.45 },
            colors: ['#ffd700', '#ff9900', '#ff2200', '#ffffff', '#ff69b4'],
            shapes: ['circle', 'square']
        });
    },
    fireGrandFinale: function() {
        if (typeof confetti !== 'function') return;
        var duration = 4.5 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ffd700', '#ff6b8b', '#00f2fe', '#ff416c']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ffd700', '#ff6b8b', '#00f2fe', '#ff416c']
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    },
    burstAt: function(xRatio, yRatio) {
        if (typeof confetti !== 'function') return;
        confetti({
            particleCount: 35,
            spread: 60,
            origin: { x: xRatio, y: yRatio },
            colors: ['#ff416c', '#ffd700', '#00f2fe', '#8377e4']
        });
    }
};

// ==========================================================================
// 4. LIVE WEBCAM CONTROLLER (BEST FRIEND EDITION)
// ==========================================================================
var WebcamManager = (function() {
    var video = null;
    var canvas = null;
    var stream = null;
    var isStreaming = false;
    var stickers = ['👑', '🕶️', '🥸', '🤡', '🥳', '⭐', '🔥', '🎂', '🎉'];
    var currentStickerIdx = 0;

    function init() {
        video = document.getElementById('webcam-video');
        canvas = document.getElementById('webcam-canvas');
        
        $('#btn-enable-cam').click(function(e) {
            e.stopPropagation();
            startCamera();
        });
        $('#btn-toggle-camera').click(function(e) {
            e.stopPropagation();
            toggleCamera();
        });
        $('#btn-snap-photo').click(function(e) {
            e.stopPropagation();
            snapSelfie();
        });
        $('#btn-cycle-sticker').click(function(e) {
            e.stopPropagation();
            cycleSticker();
        });
    }

    function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn("Camera API not supported or requires secure HTTPS context.");
            return;
        }

        var constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            },
            audio: false
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(s) {
                stream = s;
                video.srcObject = stream;
                video.play();
                isStreaming = true;
                $('#webcam-fallback').fadeOut(300);
                $('.live-dot').css('background', '#00ff88');
                SoundFX.chime();
            })
            .catch(function(err) {
                console.warn("Webcam access declined or unavailable:", err);
                $('#webcam-fallback').show();
                $('.fallback-text').text("Camera Access Off");
            });
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(function(track) { track.stop(); });
            stream = null;
        }
        isStreaming = false;
        $('#webcam-fallback').fadeIn(300);
        $('.live-dot').css('background', '#ff2d55');
    }

    function toggleCamera() {
        if (isStreaming) {
            stopCamera();
        } else {
            startCamera();
        }
    }

    function cycleSticker() {
        currentStickerIdx = (currentStickerIdx + 1) % stickers.length;
        var sticker = stickers[currentStickerIdx];
        $('#party-sticker-overlay').text(sticker);
        SoundFX.chime();
    }

    function snapSelfie() {
        SoundFX.shutter();

        var $flash = $('#camera-flash');
        $flash.addClass('flash-active');
        setTimeout(function() {
            $flash.removeClass('flash-active');
        }, 400);

        Confetti.fireCannon();

        if (!canvas) canvas = document.getElementById('webcam-canvas');
        var w = video.videoWidth || 480;
        var h = video.videoHeight || 480;
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');

        if (isStreaming && video.readyState >= 2) {
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, w, h);
            ctx.restore();

            var sticker = $('#party-sticker-overlay').text();
            if (sticker) {
                ctx.font = Math.round(w * 0.18) + 'px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(sticker, w / 2, Math.round(h * 0.22));
            }
        } else {
            var grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#ff416c');
            grad.addColorStop(1, '#ff4b2b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🎂 Bestie Birthday! 🌟', w / 2, h / 2 - 20);
            ctx.font = '24px Dancing Script, cursive';
            ctx.fillText('Legendary Moment 📸', w / 2, h / 2 + 30);
        }

        var photoDataUrl = canvas.toDataURL('image/jpeg', 0.92);

        var snapshotId = 'snap_' + Date.now();
        var $newPolaroid = $(
            '<div class="polaroid-card webcam-snapshot-card album-right-2" id="' + snapshotId + '" data-photo="' + photoDataUrl + '" data-caption="Bestie Selfie 📸✨">' +
                '<div class="polaroid-tape"></div>' +
                '<div class="polaroid-img-wrapper">' +
                    '<img src="' + photoDataUrl + '" alt="Live Bestie Selfie">' +
                '</div>' +
                '<div class="polaroid-caption">Bestie Selfie 📸✨</div>' +
            '</div>'
        );

        $('.album-right-2').remove();
        $('#album-container').append($newPolaroid);
        $newPolaroid.fadeIn(500);

        openLightbox(photoDataUrl, 'Bestie Selfie 📸✨');
    }

    return {
        init: init,
        startCamera: startCamera,
        stopCamera: stopCamera,
        toggleCamera: toggleCamera,
        snapSelfie: snapSelfie,
        cycleSticker: cycleSticker
    };
})();

// ==========================================================================
// 5. LIGHTBOX & SURPRISE MODAL HANDLERS
// ==========================================================================
function openLightbox(imgSrc, captionText) {
    if (!imgSrc) return;
    $('#lightbox-img').attr('src', imgSrc);
    $('#lightbox-caption').text(captionText || 'Aryan Birthday Memory 📸');
    $('#lightbox-download-link').attr('href', imgSrc).attr('download', 'aryan-memory-' + Date.now() + '.jpg');
    $('#lightbox').addClass('active').fadeIn(200);
}

function closeLightbox() {
    $('#lightbox').removeClass('active').fadeOut(150);
}

function openSurpriseModal() {
    SoundFX.airhorn();
    Confetti.fireGrandFinale();
    $('#surprise-modal').addClass('active').fadeIn(200);
}

function closeSurpriseModal() {
    $('#surprise-modal').removeClass('active').fadeOut(150);
}

// ==========================================================================
// 6. MAIN CELEBRATION FLOW
// ==========================================================================
$(window).load(function() {
    $('.loading').fadeOut('slow');
    $('.container.main-stage').fadeIn('slow');
    WebcamManager.init();
});

$('document').ready(function() {
    var candleLit = false;

    // Surprise Modal Close Handlers
    $('#surprise-close, #btn-ack-surprise').click(function(e) {
        e.stopPropagation();
        closeSurpriseModal();
    });

    $('#surprise-modal').click(function(e) {
        if (e.target === this) {
            closeSurpriseModal();
        }
    });

    $('#btn-party-horn').click(function(e) {
        e.stopPropagation();
        SoundFX.airhorn();
        Confetti.fireGrandFinale();
        $(this).animate({ transform: 'scale(1.15)' }, 100).animate({ transform: 'scale(1)' }, 100);
    });

    // Step 1: Turn On Lights
    $('#turn_on').click(function() {
        SoundFX.chime();
        $('#bulb_yellow').addClass('bulb-glow-yellow');
        $('#bulb_red').addClass('bulb-glow-red');
        $('#bulb_blue').addClass('bulb-glow-blue');
        $('#bulb_green').addClass('bulb-glow-green');
        $('#bulb_pink').addClass('bulb-glow-pink');
        $('#bulb_orange').addClass('bulb-glow-orange');
        $('body').addClass('peach');

        $(this).fadeOut(400, function() {
            $('#play').fadeIn(500).addClass('pulse-btn');
        });
    });

    // Step 2: Play Music
    $('#play').click(function() {
        SoundFX.chime();
        var audio = $('#birthday-audio')[0];
        if (audio) {
            audio.play().catch(function(err) {
                console.log("Audio autoplay note:", err);
            });
        }

        $('#music-pill').addClass('visible');
        $('#equalizer-bars').addClass('playing');
        $('#music-toggle-btn').text('❚❚');

        $('#bulb_yellow').addClass('bulb-glow-yellow-after');
        $('#bulb_red').addClass('bulb-glow-red-after');
        $('#bulb_blue').addClass('bulb-glow-blue-after');
        $('#bulb_green').addClass('bulb-glow-green-after');
        $('#bulb_pink').addClass('bulb-glow-pink-after');
        $('#bulb_orange').addClass('bulb-glow-orange-after');

        $('body').addClass('peach-after');

        $(this).fadeOut(400, function() {
            $('#bannar_coming').fadeIn(500).addClass('pulse-btn');
        });
    });

    // Music Pill Toggle Button
    $('#music-toggle-btn').click(function(e) {
        e.stopPropagation();
        var audio = $('#birthday-audio')[0];
        if (!audio) return;
        if (audio.paused) {
            audio.play();
            $('#equalizer-bars').addClass('playing');
            $(this).text('❚❚');
        } else {
            audio.pause();
            $('#equalizer-bars').removeClass('playing');
            $(this).text('▶');
        }
    });

    // Step 3: Banner Drop & Show Photo Album
    $('#bannar_coming').click(function() {
        SoundFX.chime();
        $('.bannar').addClass('bannar-come');
        Confetti.fireCannon();

        $('.polaroid-card').fadeIn(1000);
        $('.zoom-hint').fadeIn(1200);

        $(this).fadeOut(400, function() {
            $('#balloons_flying').fadeIn(500).addClass('pulse-btn');
        });
    });

    // Balloon Movement Loops
    function loopBalloon(id) {
        var randLeft = ($(window).width() - 140) * Math.random() + 20;
        var randBottom = ($(window).height() * 0.45) * Math.random() + 80;
        var duration = 9000 + Math.random() * 4000;
        $(id).animate({ left: randLeft, bottom: randBottom }, duration, function() {
            if ($(id).is(':visible')) {
                loopBalloon(id);
            }
        });
    }

    // Step 4: Fly Balloons
    $('#balloons_flying').click(function() {
        SoundFX.chime();
        $('.balloon-border').animate({ top: -500 }, 7000);
        $('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
        $('#b2,#b3,#b6,#b8').addClass('balloons-rotate-behaviour-two');

        var totalBalloons = $('.balloons').length || 8;
        for (var b = 1; b <= totalBalloons; b++) {
            loopBalloon('#b' + b);
        }

        Confetti.fireCannon();

        $(this).fadeOut(400, function() {
            $('#cake_fadein').fadeIn(500).addClass('pulse-btn');
        });
    });

    // Interactive Balloon Popping on Click
    $('.balloons').click(function(e) {
        var $b = $(this);
        var offset = $b.offset();
        var xRatio = (offset.left + 50) / $(window).width();
        var yRatio = (offset.top + 80) / $(window).height();

        SoundFX.pop();
        Confetti.burstAt(xRatio, yRatio);

        $b.animate({ opacity: 0, transform: 'scale(1.4)' }, 200, function() {
            setTimeout(function() {
                $b.css({ opacity: 0.85, transform: 'scale(1)' });
                loopBalloon('#' + $b.attr('id'));
            }, 3000);
        });
    });

    // Step 5: Cake & Live Webcam Reveal (Side-by-side flexbox!)
    $('#cake_fadein').click(function() {
        SoundFX.chime();
        $('#cake-and-cam-stage').css('display', 'flex').hide().fadeIn(700);
        
        WebcamManager.startCamera();
        Confetti.fireCannon();

        $(this).fadeOut(400, function() {
            $('#light_candle').fadeIn(500).addClass('pulse-btn');
        });
    });

    // Step 6: Light Candle
    $('#light_candle').click(function() {
        SoundFX.sparkle();
        $('.fuego').fadeIn(600);
        $('#candle-hint').fadeIn(600);
        candleLit = true;
        Confetti.fireCandleBurst();

        $(this).fadeOut(400, function() {
            $('#wish_message').fadeIn(500).addClass('pulse-btn');
        });
    });

    // Interactive Candle Click (Blow out / Relight)
    $('#birthday-cake').on('click', '.velas, .fuego', function(e) {
        e.stopPropagation();
        if (candleLit) {
            SoundFX.whoosh();
            $('.fuego').fadeOut(250);
            $('#candle-smoke').addClass('puff');
            setTimeout(function() {
                $('#candle-smoke').removeClass('puff');
            }, 1500);
            $('#candle-hint').text('✨ Tap candle to relight flame! 🕯️');
            Confetti.fireCandleBurst();
            candleLit = false;
        } else {
            SoundFX.sparkle();
            $('.fuego').fadeIn(300);
            $('#candle-hint').text('✨ Tap flame to make a wish!');
            Confetti.fireCandleBurst();
            candleLit = true;
        }
    });

    // Step 7: Wish Message & Align Balloons (Spell H B D A R Y A N)
    $('#wish_message').click(function() {
        SoundFX.chime();
        var vw = $(window).width() / 2;
        var totalBalloons = $('.balloons').length || 8;

        $('.balloons').stop();
        for (var k = 1; k <= totalBalloons; k++) {
            $('#b' + k).attr('id', 'b' + k + k);
        }

        var spacing = Math.min(68, $(window).width() / (totalBalloons + 1));
        var startX = vw - (spacing * (totalBalloons - 1) / 2);

        for (var i = 1; i <= totalBalloons; i++) {
            var targetId = '#b' + i + i;
            var targetX = startX + (spacing * (i - 1));
            $(targetId).animate({ top: 160, left: targetX }, 800);
        }

        $('.balloons').css('opacity', '0.95');
        $('.balloons h2').fadeIn(1500);

        Confetti.fireGrandFinale();

        $(this).fadeOut(400, function() {
            $('#story').fadeIn(500).addClass('pulse-btn');
        });
    });

    // Step 8: Story Narration Loop (Best Friend banter) -> Reveals Surprise Note Button at the End!
    $('#story').click(function() {
        SoundFX.chime();
        $(this).fadeOut(400);

        // 1. Remove balloons completely as requested so they don't block the screen
        $('.balloons h2').fadeOut(300);
        $('.balloons').stop().fadeOut(600).animate({ top: -500, opacity: 0 }, 800, function() {
            $(this).hide();
        });

        // 2. Hide polaroid images and zoom hint during reading so messages are never obscured
        $('.polaroid-card').fadeOut(500);
        $('.zoom-hint').fadeOut(400);

        // 3. Hide cake & webcam stage, then display centered message card
        $('#cake-and-cam-stage').fadeOut(400, function() {
            $('.message-card').fadeIn(600);
        });

        var $messages = $("#message-container p");
        var totalMessages = $messages.length;

        function msgLoop(i) {
            if (i < totalMessages - 1) {
                $messages.eq(i).fadeIn(700).delay(2300).fadeOut(500).promise().done(function() {
                    msgLoop(i + 1);
                });
            } else {
                // Final wish stays -> Bring back cake & webcam + polaroids -> Show Surprise Note Button!
                $messages.eq(i).fadeIn(900).promise().done(function() {
                    $('#cake-and-cam-stage').css('display', 'flex').hide().fadeIn(800);
                    $('.polaroid-card').fadeIn(800);
                    $('.zoom-hint').fadeIn(1000);
                    Confetti.fireGrandFinale();
                    
                    // Reveal the grand Surprise Note action button!
                    $('#continue_to_surprise').fadeIn(600).addClass('pulse-btn');
                });
            }
        }

        msgLoop(0);
    });

    // Grand Climax: Continue to Surprise Note
    $('#continue_to_surprise').click(function(e) {
        e.stopPropagation();
        openSurpriseModal();
    });

    // Resize Handler for Spell Balloons (H B D A R Y A N)
    $(window).resize(function() {
        if ($('#b11').length && $('#b11').is(':visible')) {
            var vw = $(window).width() / 2;
            var totalBalloons = $('.balloons').length || 8;
            var spacing = Math.min(68, $(window).width() / (totalBalloons + 1));
            var startX = vw - (spacing * (totalBalloons - 1) / 2);

            for (var i = 1; i <= totalBalloons; i++) {
                var targetId = '#b' + i + i;
                var targetX = startX + (spacing * (i - 1));
                $(targetId).animate({ top: 160, left: targetX }, 300);
            }
        }
    });

    // Polaroid Card Zoom Click (Open Any of the 4 Photos in Lightbox Modal)
    $(document).on('click', '.polaroid-card, .polaroid-card img, .polaroid-img-wrapper, .polaroid-caption', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $card = $(this).closest('.polaroid-card');
        var photoSrc = $card.attr('data-photo') || $card.find('img').attr('src');
        var caption = $card.attr('data-caption') || $card.find('.polaroid-caption').text() || 'Aryan Birthday Memory 📸';
        if (photoSrc) {
            SoundFX.chime();
            openLightbox(photoSrc, caption);
        }
    });

    // Lightbox Close Handlers
    $('#lightbox-close').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
    });

    $('#lightbox').on('click', function(e) {
        if (e.target === this || $(e.target).hasClass('lightbox')) {
            closeLightbox();
        }
    });

    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            closeLightbox();
            closeSurpriseModal();
        }
    });
});