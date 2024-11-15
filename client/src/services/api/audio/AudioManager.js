// src/services/audio/audioManager.js
class AudioManager {
    constructor() {
      this.bgMusic = null;
      this.initialized = false;
      this.audioContext = null;
    }
  
    async initializeAudio() {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const response = await fetch('http://localhost:5000/check-audio');
        const checkData = await response.json();
        
        if (!checkData.exists) {
          console.error('Audio file not found:', checkData.path);
          return;
        }
  
        this.bgMusic = new Audio('http://localhost:5000/audio/background.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;
  
        this.bgMusic.addEventListener('error', this.handleAudioError);
        this.bgMusic.addEventListener('loadeddata', () => {
          console.log('Audio loaded successfully');
          this.initialized = true;
        });
  
        await this.bgMusic.load();
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
  
    handleAudioError = (event) => {
      const error = event.target.error;
      if (error) {
        switch(error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            console.error('Audio loading aborted');
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            console.error('Network error while loading audio');
            break;
          case MediaError.MEDIA_ERR_DECODE:
            console.error('Audio decoding error');
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            console.error('Audio format not supported');
            break;
          default:
            console.error('Unknown audio error');
        }
      }
    };
  
    async playBackgroundMusic() {
        if (!this.initialized) {
          await this.initializeAudio();
        }
    
        try {
          if (this.bgMusic) {
            const playAttempt = this.bgMusic.play();
            if (playAttempt !== undefined) {
              await playAttempt;
              console.log('Background music started successfully');
            }
          }
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            console.log('Playback prevented - waiting for user interaction');
          } else {
            console.error('Failed to play background music:', error);
            this.bgMusic.load();
          }
        }
      }
    
      stopBackgroundMusic() {
        if (this.bgMusic) {
          this.bgMusic.pause();
          this.bgMusic.currentTime = 0;
        }
      }
    
      setVolume(volume) {
        if (this.bgMusic) {
          this.bgMusic.volume = Math.max(0, Math.min(1, volume));
        }
      }
    
      cleanup() {
        if (this.bgMusic) {
          this.bgMusic.pause();
          this.bgMusic.removeEventListener('error', this.handleAudioError);
        }
        if (this.audioContext) {
          this.audioContext.close();
        }
      }
    }

export default new AudioManager();
