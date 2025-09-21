class MedicalVoiceService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isSupported = 'speechSynthesis' in window;
    this.voices = [];
    this.selectedVoice = null;
    this.isPlaying = false;
    this.isPaused = false;
    
    // Optimized voice preferences for faster, professional delivery
    this.voicePreferences = {
      rate: 1.3,           // Faster speaking rate
      pitch: 0.9,          // Professional tone
      volume: 0.9,         // Clear volume
      preferredLang: 'en-US',
      preferredGender: 'male',
      preferredNames: [
        'Microsoft David',
        'Google US English',
        'Alex',
        'Daniel',
        'Samantha',
        'Karen'
      ]
    };

    this.initialize();
  }

  async initialize() {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    if (this.synthesis.getVoices().length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    } else {
      this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    this.selectBestVoice();
    console.log('Available voices loaded:', this.voices.length);
  }

  selectBestVoice() {
    let bestVoice = null;
    
    // Try preferred names first
    for (const preferredName of this.voicePreferences.preferredNames) {
      bestVoice = this.voices.find(voice => 
        voice.name.includes(preferredName) && 
        voice.lang.startsWith(this.voicePreferences.preferredLang)
      );
      if (bestVoice) break;
    }

    // Fallback to any English voice
    if (!bestVoice) {
      bestVoice = this.voices.find(voice => 
        voice.lang === this.voicePreferences.preferredLang
      );
    }

    if (!bestVoice) {
      bestVoice = this.voices.find(voice => 
        voice.lang.startsWith('en')
      );
    }

    if (!bestVoice && this.voices.length > 0) {
      bestVoice = this.voices[0];
    }

    this.selectedVoice = bestVoice;
    console.log('Selected voice:', bestVoice?.name || 'None available');
  }

  generateConciseMedicalScript(analysisResults) {
    const { primaryDiagnosis, recommendations } = analysisResults;
    
    // Generate concise 30-45 second script
    let script = "This is your Retinal Doctor with your analysis results. ";
    
    // Main diagnosis - keep it brief
    script += `Primary diagnosis: ${primaryDiagnosis.condition}. `;
    
    // Confidence level - simplified
    if (primaryDiagnosis.confidence >= 90) {
      script += `High confidence at ${primaryDiagnosis.confidence.toFixed(0)} percent. `;
    } else if (primaryDiagnosis.confidence >= 80) {
      script += `Good confidence at ${primaryDiagnosis.confidence.toFixed(0)} percent. `;
    } else {
      script += `Moderate confidence at ${primaryDiagnosis.confidence.toFixed(0)} percent. `;
    }

    // Severity and risk - condensed
    script += `This is ${primaryDiagnosis.severity.toLowerCase()} severity with ${primaryDiagnosis.riskLevel.toLowerCase()} risk level. `;

    // Key recommendations - only top 2
    if (recommendations && recommendations.length > 0) {
      script += "Key recommendations: ";
      script += recommendations.slice(0, 2).join(", and ") + ". ";
    }

    // Urgency assessment - simplified
    if (primaryDiagnosis.riskLevel === 'High') {
      script += "Please schedule immediate follow-up care. ";
    } else if (primaryDiagnosis.riskLevel === 'Medium') {
      script += "Follow-up recommended within two weeks. ";
    } else {
      script += "Regular monitoring recommended. ";
    }

    // Brief closing
    script += "This AI analysis should be reviewed with your healthcare provider. Thank you.";

    return script;
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      this.stop();
      this.currentUtterance = new SpeechSynthesisUtterance(text);
      
      if (this.selectedVoice) {
        this.currentUtterance.voice = this.selectedVoice;
      }
      
      // Apply faster settings
      this.currentUtterance.rate = options.rate || this.voicePreferences.rate;
      this.currentUtterance.pitch = options.pitch || this.voicePreferences.pitch;
      this.currentUtterance.volume = options.volume || this.voicePreferences.volume;

      this.currentUtterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
        console.log('Retinal Doctor consultation started');
        if (options.onStart) options.onStart();
      };

      this.currentUtterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        console.log('Retinal Doctor consultation completed');
        if (options.onEnd) options.onEnd();
        resolve();
      };

      this.currentUtterance.onerror = (event) => {
        this.isPlaying = false;
        this.isPaused = false;
        console.error('Speech synthesis error:', event.error);
        if (options.onError) options.onError(event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synthesis.speak(this.currentUtterance);
    });
  }

  speakAnalysisResults(analysisResults, options = {}) {
    const script = this.generateConciseMedicalScript(analysisResults);
    return this.speak(script, options);
  }

  stop() {
    if (this.isSupported) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.isPaused = false;
    }
  }

  get isCurrentlyPlaying() {
    return this.isPlaying;
  }

  get isSpeechSupported() {
    return this.isSupported;
  }
}

export const medicalVoiceService = new MedicalVoiceService();