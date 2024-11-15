// src/utils/assetLoader.js
import { ASSET_CONFIG } from '../config/assets';

class AssetManager {
  constructor() {
    this.loadedAssets = new Map();
    this.loadingPromises = new Map();
  }

  getAssetPath(type, name) {
    switch(type) {
      case 'map':
        return `${ASSET_CONFIG.BASE_PATHS.IMAGES}/maps/${ASSET_CONFIG.IMAGES.MAPS[name]}`;
      case 'character':
        return `${ASSET_CONFIG.BASE_PATHS.IMAGES}/characters/${ASSET_CONFIG.IMAGES.CHARACTERS[name]}`;
      case 'audio':
        return `${ASSET_CONFIG.BASE_PATHS.AUDIO}/${ASSET_CONFIG.AUDIO[name]}`;
      default:
        throw new Error(`Unknown asset type: ${type}`);
    }
  }

  async loadImage(type, name) {
    const path = this.getAssetPath(type, name);
    const key = `${type}-${name}`;

    // Return cached asset if already loaded
    if (this.loadedAssets.has(key)) {
      return this.loadedAssets.get(key);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets.set(key, img);
        this.loadingPromises.delete(key);
        resolve(img);
      };
      img.onerror = (error) => {
        this.loadingPromises.delete(key);
        reject(new Error(`Failed to load image: ${path}`));
      };
      img.src = path;
    });

    this.loadingPromises.set(key, loadPromise);
    return loadPromise;
  }

  async loadAudio(name) {
    const path = this.getAssetPath('audio', name);
    const key = `audio-${name}`;

    if (this.loadedAssets.has(key)) {
      return this.loadedAssets.get(key);
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const loadPromise = new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.loadedAssets.set(key, audio);
        this.loadingPromises.delete(key);
        resolve(audio);
      };
      audio.onerror = () => {
        this.loadingPromises.delete(key);
        reject(new Error(`Failed to load audio: ${path}`));
      };
      audio.src = path;
      audio.load();
    });

    this.loadingPromises.set(key, loadPromise);
    return loadPromise;
  }

  async preloadAllAssets() {
    const loadPromises = [];

    // Load map images
    for (const mapName of Object.keys(ASSET_CONFIG.IMAGES.MAPS)) {
      loadPromises.push(this.loadImage('map', mapName));
    }

    // Load character images
    for (const charName of Object.keys(ASSET_CONFIG.IMAGES.CHARACTERS)) {
      loadPromises.push(this.loadImage('character', charName));
    }

    // Load audio
    for (const audioName of Object.keys(ASSET_CONFIG.AUDIO)) {
      loadPromises.push(this.loadAudio(audioName));
    }

    try {
      await Promise.all(loadPromises);
      console.log('All assets loaded successfully');
    } catch (error) {
      console.error('Error loading assets:', error);
      throw error;
    }
  }

  getLoadedAsset(type, name) {
    const key = `${type}-${name}`;
    if (!this.loadedAssets.has(key)) {
      throw new Error(`Asset not loaded: ${key}`);
    }
    return this.loadedAssets.get(key);
  }

  clearCache() {
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }
}

export const assetManager = new AssetManager();