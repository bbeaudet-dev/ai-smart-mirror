/* global Module, Log */

interface VisionConfig {
  updateInterval: number;
  apiEndpoint: string;
  cameraEnabled: boolean;
  autoCapture: boolean;
  captureInterval: number;
  maxImageSize: number;
}

interface VisionData {
  analysis: string;
  timestamp: string;
  imageUrl?: string;
}

Module.register("ai-vision", {
  defaults: {
    updateInterval: 30000, // 30 seconds
    apiEndpoint: "http://localhost:5000/api/ai/analyze-image",
    cameraEnabled: false,
    autoCapture: false,
    captureInterval: 60000, // 1 minute
    maxImageSize: 1024 * 1024 // 1MB
  } as VisionConfig,

  visionData: null as VisionData | null,
  videoElement: null as HTMLVideoElement | null,
  canvasElement: null as HTMLCanvasElement | null,
  stream: null as MediaStream | null,
  captureInterval: null as number | null,

  start() {
    Log.info("Starting AI Vision module");
    
    if (this.config.cameraEnabled) {
      this.initializeCamera();
    }
    
    if (this.config.autoCapture) {
      this.startAutoCapture();
    }
  },

  async initializeCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.stream;
      this.videoElement.autoplay = true;
      this.videoElement.muted = true;
      this.videoElement.style.display = 'none';
      document.body.appendChild(this.videoElement);
      
      this.canvasElement = document.createElement('canvas');
      this.canvasElement.width = 640;
      this.canvasElement.height = 480;
      this.canvasElement.style.display = 'none';
      document.body.appendChild(this.canvasElement);
      
      Log.info("Camera initialized successfully");
    } catch (error) {
      Log.error("Failed to initialize camera:", error);
      this.config.cameraEnabled = false;
    }
  },

  startAutoCapture() {
    if (!this.config.cameraEnabled) return;
    
    this.captureInterval = setInterval(() => {
      this.captureAndAnalyze();
    }, this.config.captureInterval);
  },

  stopAutoCapture() {
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }
  },

  async captureAndAnalyze() {
    if (!this.videoElement || !this.canvasElement) {
      Log.error("Camera not initialized");
      return;
    }

    try {
      // Capture frame from video
      const context = this.canvasElement.getContext('2d');
      if (!context) {
        throw new Error("Could not get canvas context");
      }
      
      context.drawImage(this.videoElement, 0, 0, 640, 480);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        this.canvasElement!.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.8);
      });

      // Send to backend for analysis
      await this.analyzeImage(blob);
    } catch (error) {
      Log.error("Failed to capture and analyze image:", error);
    }
  },

  async analyzeImage(imageBlob: Blob) {
    try {
      const formData = new FormData();
      formData.append('image', imageBlob, 'outfit.jpg');
      formData.append('prompt', 'Analyze this outfit and provide friendly, constructive feedback. Consider style, appropriateness for the weather, and overall presentation. Keep it encouraging and under 100 words.');
      formData.append('context', 'outfit-analysis');

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.visionData = data;
      this.updateDom();
    } catch (error) {
      Log.error("Image analysis failed:", error);
    }
  },

  // Manual capture trigger
  notificationReceived(notification: string, payload: any, sender: any) {
    if (notification === 'CAPTURE_IMAGE' && this.config.cameraEnabled) {
      this.captureAndAnalyze();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "ai-vision";

    if (!this.config.cameraEnabled) {
      wrapper.innerHTML = `
        <div class="vision-title">📷 AI Vision Analysis</div>
        <div class="vision-content">Camera disabled</div>
        <div class="vision-note">Enable camera in config to use AI vision features</div>
      `;
      return wrapper;
    }

    if (!this.visionData) {
      wrapper.innerHTML = `
        <div class="vision-title">📷 AI Vision Analysis</div>
        <div class="vision-content">Ready to analyze</div>
        <div class="vision-note">${this.config.autoCapture ? 'Auto-capture enabled' : 'Click to capture'}</div>
      `;
      return wrapper;
    }

    wrapper.innerHTML = `
      <div class="vision-title">📷 AI Vision Analysis</div>
      <div class="vision-content">${this.visionData.analysis}</div>
      <div class="vision-timestamp">Updated: ${new Date(this.visionData.timestamp).toLocaleTimeString()}</div>
    `;

    return wrapper;
  },

  getStyles() {
    return ["ai-vision.css"];
  },

  stop() {
    this.stopAutoCapture();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.videoElement) {
      document.body.removeChild(this.videoElement);
    }
    
    if (this.canvasElement) {
      document.body.removeChild(this.canvasElement);
    }
  }
});
