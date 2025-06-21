import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Gift } from 'lucide-react';

function App() {
  const [stage, setStage] = useState<'countdown' | 'spotlight' | 'curtains' | 'reveal'>('countdown');
  const [countdown, setCountdown] = useState(5);
  const [showRat, setShowRat] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [showCurtains, setShowCurtains] = useState(false);
  const [showSecondSpeech, setShowSecondSpeech] = useState(false);
  const [showRibbonButton, setShowRibbonButton] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [showClickHint, setShowClickHint] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);

  // Audio refs
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const ratEntranceAudioRef = useRef<HTMLAudioElement | null>(null);
  const curtainOpenAudioRef = useRef<HTMLAudioElement | null>(null);
  const birthdayMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create audio elements
    countdownAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/clock-ticking-3.wav');
    ratEntranceAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-02.wav');
    curtainOpenAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/ta-da.wav');
    birthdayMusicRef.current = new Audio('https://www.soundjay.com/misc/sounds/happy-birthday-song.wav');

    // Set audio properties
    if (countdownAudioRef.current) {
      countdownAudioRef.current.volume = 0.6;
      countdownAudioRef.current.loop = true;
    }
    if (ratEntranceAudioRef.current) {
      ratEntranceAudioRef.current.volume = 0.7;
    }
    if (curtainOpenAudioRef.current) {
      curtainOpenAudioRef.current.volume = 0.8;
    }
    if (birthdayMusicRef.current) {
      birthdayMusicRef.current.volume = 0.5;
      birthdayMusicRef.current.loop = true;
    }

    return () => {
      // Cleanup audio
      [countdownAudioRef, ratEntranceAudioRef, curtainOpenAudioRef, birthdayMusicRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  useEffect(() => {
    // Countdown stage
    if (stage === 'countdown' && countdown > 0) {
      // Play countdown music
      if (countdown === 5 && countdownAudioRef.current) {
        countdownAudioRef.current.play().catch(() => {
          // Fallback if audio doesn't play
          console.log('Audio autoplay blocked');
        });
      }

      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      // Stop countdown music
      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
      }

      // Move to spotlight stage
      setTimeout(() => {
        setStage('spotlight');
        // Rat enters after stage is set
        setTimeout(() => {
          setShowRat(true);
          // Play rat entrance sound
          if (ratEntranceAudioRef.current) {
            ratEntranceAudioRef.current.play().catch(() => {
              console.log('Audio play failed');
            });
          }
        }, 1000);
        // First speech bubble appears after rat
        setTimeout(() => setShowSpeechBubble(true), 2500);
        // Auto-transition to curtains stage after 5 seconds
        setTimeout(() => {
          setStage('curtains');
          setShowSpeechBubble(false);
          setShowCurtains(true);
          // Second speech bubble appears
          setTimeout(() => setShowSecondSpeech(true), 1000);
          // Ribbon button appears
          setTimeout(() => setShowRibbonButton(true), 2000);
        }, 6000);
      }, 500);
    }
  }, [stage, countdown]);

  const handleContinue = () => {
    setShowSecondSpeech(false);
    setShowRibbonButton(false);
    setCurtainOpen(true);
    
    // Play curtain opening sound
    if (curtainOpenAudioRef.current) {
      curtainOpenAudioRef.current.play().catch(() => {
        console.log('Audio play failed');
      });
    }
    
    // Wait for curtain animation to complete before showing night sky
    setTimeout(() => {
      setStage('reveal');
      // Show gift dialog after a moment
      setTimeout(() => {
        setShowGiftDialog(true);
        // Show gift box falling from sky after dialog
        setTimeout(() => {
          setShowGiftDialog(false);
          setShowGiftBox(true);
          // Show click hint after gift box lands
          setTimeout(() => {
            setShowClickHint(true);
          }, 3000);
          // Play birthday music
          if (birthdayMusicRef.current) {
            birthdayMusicRef.current.play().catch(() => {
              console.log('Audio play failed');
            });
          }
        }, 4000);
      }, 1000);
    }, 2000);
  };

  const handleGiftClick = () => {
    if (!giftOpened) {
      setGiftOpened(true);
      setShowClickHint(false);
      setShowConfetti(true);
      
      // Show balloons after confetti starts
      setTimeout(() => {
        setShowBalloons(true);
      }, 500);
      
      // Hide confetti and balloons after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      setTimeout(() => {
        setShowBalloons(false);
      }, 8000);
    }
  };

  // Enable audio on first user interaction
  const enableAudio = () => {
    [countdownAudioRef, ratEntranceAudioRef, curtainOpenAudioRef, birthdayMusicRef].forEach(ref => {
      if (ref.current) {
        ref.current.load();
      }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" onClick={enableAudio}>
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="film-grain"></div>
      </div>

      {/* Countdown Stage */}
      {stage === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="countdown-circle">
              <div className="countdown-glow"></div>
              <div className="countdown-number">
                {countdown || '✨'}
              </div>
            </div>
            {/* Countdown text */}
            <div className="countdown-text">
              Abb Ayega Maja !!!
            </div>
            {/* Musical notes animation during countdown */}
            <div className="musical-notes">
              <div className="note note-1">♪</div>
              <div className="note note-2">♫</div>
              <div className="note note-3">♪</div>
              <div className="note note-4">♫</div>
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Stage - Dark with spotlight on rat */}
      {stage === 'spotlight' && (
        <>
          <div className="spotlight-stage">
            {/* Spotlight effect */}
            <div className="spotlight-container">
              <div className="spotlight"></div>
              <div className="spotlight-particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`particle particle-${i}`}></div>
                ))}
              </div>
            </div>

            {/* Rat Character */}
            {showRat && (
              <div className="rat-container">
                <img 
                  src="/24889b63-2a23-4c1d-bdeb-c6bc764031e5.png" 
                  alt="Cute rat character" 
                  className="rat-image"
                />
                
                {/* Paw prints trail */}
                <div className="paw-prints">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`paw-print paw-print-${i}`}>🐾</div>
                  ))}
                </div>

                {/* Magic sparkles around rat */}
                <div className="magic-sparkles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
                  ))}
                </div>

                {/* First Speech bubble */}
                {showSpeechBubble && (
                  <div className="speech-bubble">
                    <div className="speech-content">
                      <Sparkles className="speech-icon" />
                      <p>Oyee Chuiyaa,</p>
                      <p>Tere liye ek suprise hai ....GAWAR!!!!</p>
                    </div>
                    <div className="speech-tail"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Curtains Stage - Lights on with curtains */}
      {(stage === 'curtains' || stage === 'reveal') && (
        <>
          {/* Stage background - Night sky for reveal, lights on for curtains */}
          <div className={`stage-background ${stage === 'reveal' ? 'night-sky' : 'lights-on'}`}>
            {stage === 'reveal' && (
              <>
                {/* Night sky with stars */}
                <div className="stars">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className={`star star-${i % 5}`}></div>
                  ))}
                </div>
                {/* Meteors */}
                <div className="meteors">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`meteor meteor-${i}`}></div>
                  ))}
                </div>
              </>
            )}
            
            {stage === 'curtains' && <div className="stage-floor"></div>}
            
            {/* Spotlight effect - dimmed for curtains stage */}
            {stage === 'curtains' && (
              <div className="spotlight-container">
                <div className="spotlight dimmed"></div>
                <div className="spotlight-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`particle particle-${i}`}></div>
                  ))}
                </div>
              </div>
            )}

            {/* Curtains */}
            {showCurtains && (
              <>
                <div className={`curtain-left ${curtainOpen ? 'curtain-open-left' : ''}`}></div>
                <div className={`curtain-right ${curtainOpen ? 'curtain-open-right' : ''}`}></div>
              </>
            )}
          </div>

          {/* Rat Character - stays visible in both curtains and reveal stages */}
          <div className={`rat-container ${stage === 'reveal' ? 'rat-reveal-position' : ''} ${stage === 'curtains' && (showSecondSpeech || showRibbonButton) ? 'rat-curtain-position' : ''}`}>
            <img 
              src="/24889b63-2a23-4c1d-bdeb-c6bc764031e5.png" 
              alt="Cute rat character" 
              className="rat-image"
            />

            {/* Magic sparkles around rat in reveal stage */}
            {stage === 'reveal' && (
              <div className="magic-sparkles celebration">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`sparkle sparkle-celebration-${i}`}>✨</div>
                ))}
              </div>
            )}

            {/* Second Speech bubble - only in curtains stage */}
            {stage === 'curtains' && showSecondSpeech && (
              <div className="speech-bubble">
                <div className="speech-content">
                  <Sparkles className="speech-icon" />
                  <p>Oyee isse Open kerke dekh ....</p>
                  <p>kya attitude dikha rhi !!!!</p>
                </div>
                <div className="speech-tail"></div>
              </div>
            )}

            {/* Gift dialog - only in reveal stage */}
            {stage === 'reveal' && showGiftDialog && (
              <div className="speech-bubble gift-dialog">
                <div className="speech-content">
                  <Gift className="speech-icon" />
                  <p>Itni Mahangi Gift ....</p>
                  <p>Tere jaise bhukkad ke liye</p>
                </div>
                <div className="speech-tail"></div>
              </div>
            )}
          </div>

          {/* Ribbon Button - only in curtains stage */}
          {stage === 'curtains' && showRibbonButton && (
            <div className="ribbon-button-container">
              <button 
                onClick={handleContinue}
                className="ribbon-button"
              >
                <span>✨ Open Curtains ✨</span>
              </button>
            </div>
          )}

          {/* Gift Box - only in reveal stage */}
          {stage === 'reveal' && showGiftBox && (
            <div className="gift-box-container">
              <div 
                className={`gift-box ${giftOpened ? 'gift-opened' : ''}`}
                onClick={handleGiftClick}
              >
                {!giftOpened ? (
                  <>
                    <div className="gift-box-body">
                      <div className="gift-ribbon-horizontal"></div>
                      <div className="gift-ribbon-vertical"></div>
                      <div className="gift-bow">
                        <div className="bow-left"></div>
                        <div className="bow-right"></div>
                        <div className="bow-center"></div>
                      </div>
                    </div>
                    
                    {/* Gift sparkles */}
                    <div className="gift-sparkles">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className={`gift-sparkle gift-sparkle-${i}`}>✨</div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="gift-contents">
                    <div className="birthday-cake">🎂</div>
                    <div className="balloons-small">
                      <div className="balloon-small balloon-small-1">🎈</div>
                      <div className="balloon-small balloon-small-2">🎈</div>
                      <div className="balloon-small balloon-small-3">🎈</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Click hint */}
              {showClickHint && !giftOpened && (
                <div className="click-hint">
                  <p>Click on the gift box! 🎁</p>
                </div>
              )}
            </div>
          )}

          {/* Confetti */}
          {showConfetti && (
            <div className="confetti-container">
              {[...Array(100)].map((_, i) => (
                <div key={i} className={`confetti confetti-${i % 6}`}></div>
              ))}
            </div>
          )}

          {/* Floating Balloons with Messages */}
          {showBalloons && (
            <div className="floating-balloons-container">
              <div className="floating-balloon balloon-message-1">
                <div className="balloon-body" style={{backgroundColor: '#ff9999'}}>😊</div>
                <div className="balloon-ribbon"></div>
                <div className="balloon-message">Areee Smile Toh De! 😄</div>
              </div>
              <div className="floating-balloon balloon-message-2">
                <div className="balloon-body" style={{backgroundColor: '#99ccff'}}>🐭</div>
                <div className="balloon-ribbon"></div>
                <div className="balloon-message">Chuiyaa spotted!</div>
              </div>
              <div className="floating-balloon balloon-message-3">
                <div className="balloon-body" style={{backgroundColor: '#baffc9'}}>🎂</div>
                <div className="balloon-ribbon"></div>
                <div className="balloon-message">Cake lover spotted!</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;