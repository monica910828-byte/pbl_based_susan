import { useEffect, useRef, useState } from 'react';
import { useLearner } from '../../context/LearnerContext';

export function AudioPlayer() {
  const { state } = useLearner();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentBgm, setCurrentBgm] = useState<string | null>(null);

  useEffect(() => {
    // Determine which BGM to play based on step
    let targetBgm: string | null = null;
    
    if (state.step >= 2 && state.step <= 5) {
      targetBgm = '/audio/bgm_intro.mp3';
    } else if (state.step === 6) {
      targetBgm = '/audio/bgm_game.mp3';
    } else if (state.step >= 7) {
      targetBgm = '/audio/bgm_ending.mp3';
    }

    // Only switch if the BGM changed
    if (targetBgm !== currentBgm) {
      setCurrentBgm(targetBgm);
      
      if (audioRef.current) {
        // Pause current audio
        audioRef.current.pause();
        
        if (targetBgm) {
          audioRef.current.src = targetBgm;
          audioRef.current.loop = true;
          audioRef.current.volume = 0.2; // Background volume level
          
          // Play new audio (wrap in a promise catch to handle browser auto-play restrictions quietly)
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              console.warn("Auto-play prevented by browser. Audio will start after next user interaction.");
            });
          }
        }
      }
    }
  }, [state.step, currentBgm]);

  return (
    <audio ref={audioRef} className="hidden" />
  );
}
