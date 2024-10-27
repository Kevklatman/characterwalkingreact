// audio.js
class AudioManager {
    constructor() {
        this.bgMusic = null;
        this.initialized = false;
        this.initializeAudio();
    }

    async initializeAudio() {
        try {
            // First check if the audio file exists
            const checkResponse = await fetch('http://localhost:5000/check-audio');
            const checkData = await checkResponse.json();
            console.log('Audio file check:', checkData);

            // Initialize audio with the correct path
            this.bgMusic = new Audio('http://localhost:5000/audio/background.mp3');
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.5;

            // Add comprehensive error handling
            this.bgMusic.addEventListener('error', (e) => {
                console.error('Audio loading error:', e);
                if (this.bgMusic.error) {
                    console.error('Error code:', this.bgMusic.error.code);
                    console.error('Error message:', this.bgMusic.error.message);
                    this.handleAudioError(this.bgMusic.error.code);
                }
            });

            this.bgMusic.addEventListener('loadeddata', () => {
                console.log('Audio loaded successfully');
                this.initialized = true;
            });

            this.bgMusic.addEventListener('playing', () => {
                console.log('Audio started playing');
            });

            // Preload the audio
            await this.bgMusic.load();

        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    handleAudioError(errorCode) {
        switch(errorCode) {
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

    async playBackgroundMusic() {
        if (!this.initialized) {
            console.log('Audio not yet initialized, waiting...');
            await this.initializeAudio();
        }

        try {
            if (this.bgMusic) {
                // Create a user interaction promise
                const playAttempt = this.bgMusic.play();
                if (playAttempt !== undefined) {
                    await playAttempt;
                    console.log('Background music started successfully');
                }
            }
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                console.log('Playback prevented by browser - waiting for user interaction');
            } else {
                console.error('Failed to play background music:', error);
                // Try to reload and play again
                this.bgMusic.load();
                console.log('Reloaded audio file');
            }
        }
    }

    stopBackgroundMusic() {
        if (this.bgMusic) {
            console.log('Stopping background music');
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    setVolume(volume) {
        if (this.bgMusic) {
            this.bgMusic.volume = Math.max(0, Math.min(1, volume));
            console.log('Volume set to:', this.bgMusic.volume);
        }
    }
}

export default new AudioManager();