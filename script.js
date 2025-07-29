// ==== Constants and Translations ====

const translations = {
  "en-US": {
    "home.title": "LORA BOT",
    "home.status.default": "/// STANDING BY ///",
    "home.status.listening": "Listening...",
    "home.status.processing": 'Processing Command: "{transcript}"',
    "home.status.executing": "Executing: {command}",
    "home.status.completed": "Execution Complete: {command}",
    "home.status.unknown": "Command not recognized. Please repeat.",
    "home.status.error": "System error: {error}.",
    "home.status.browserNotSupported": "Speech recognition not supported by your browser.",
    "home.speakButton.speak": "Engage Mic",
    "home.speakButton.listening": "Listening...",
    "home.controls.forward": "Forward",
    "home.controls.left": "Left",
    "home.controls.right": "Right",
    "home.controls.backward": "Backward",
    "home.controls.stop": "Stop",
    "home.obstacles.title": "Obstacles",
    "home.obstacles.yes": "DETECTED",
    "home.obstacles.no": "CLEAR",
    "home.nav.home": "Control",
    "home.nav.settings": "Settings",
    "settings.title": "System Settings",
    "settings.appearance.title": "Theme",
    "settings.appearance.light": "Day Mode",
    "settings.appearance.dark": "Night Mode",
    "settings.language.title": "Language",
    "settings.language.label": "Select Language",
    "settings.audio.title": "Audio Feedback",
    "settings.audio.off": "Off",
    "settings.audio.sound": "Sound FX",
    "settings.audio.voice": "Voice",
    "settings.system.title": "System",
    "settings.system.resetButton": "Reset All",
    "settings.legal.title": "Legal",
    "settings.legal.terms": "Terms of Service",
    "settings.legal.privacy": "Privacy Policy",
    "languages.en-US": "English (US)",
    "languages.es-ES": "Spanish",
    "languages.fr-FR": "French",
    "languages.de-DE": "German",
    "languages.hi-IN": "Hindi",
    "languages.ta-IN": "Tamil",
    "languages.ja-JP": "Japanese",
    "gemini.systemInstruction": "You are a robot controller. Analyze the user command and map it exactly to one of: forward, backward, left, right, stop.",
    "legal.terms.title": "Terms of Service",
    "legal.terms.content": `
Welcome to LORA BOT. These Terms of Service ("Terms") govern your use of our application. By accessing or using the app, you agree to be bound by these Terms.

1. **Usage License**  
You are granted a limited, non-exclusive, non-transferable license to use LORA BOT for personal, non-commercial purposes only.

2. **User Obligations**  
You agree not to misuse the service in any way, including but not limited to:  
- Issuing unauthorized commands that may cause harm or damage.  
- Attempting to reverse engineer, hack, or compromise the app or services.  
- Using the app for any illegal or unauthorized purpose.

3. **Command Responsibility**  
You acknowledge that you are solely responsible for any commands issued through your device, including any consequences arising from them.

4. **Service Availability and Modifications**  
LORA BOT may be updated, suspended or discontinued at any time without prior notice. We reserve the right to modify the Terms at our discretion; continued use of the app constitutes acceptance of updated terms.

5. **Disclaimer of Warranty**  
The app is provided “AS IS” without warranties of any kind. We do not guarantee uninterrupted or error-free operation.

6. **Limitation of Liability**  
To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the app.

7. **Termination**  
We reserve the right to suspend or terminate your access immediately without notice for any violation of these Terms.

8. **Governing Law**  
These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate.

9. **Contact**  
For questions or concerns regarding these Terms, please contact support@lorabot.app.

By continuing to use LORA BOT, you signify your agreement to these Terms of Service.
Contact: support@lorabot.app
    `,
    "legal.privacy.title": "Privacy Policy",
    "legal.privacy.content": `
Your privacy is important to us. This Privacy Policy explains how LORA BOT collects, uses, and protects your information.

1. **Information We Collect**  
- **Voice Commands**: To interpret your instructions, voice commands are processed via third-party services such as Google Gemini. Voice data is transmitted only during these interactions and is not stored by us.  
- **Usage Data**: We may collect anonymized usage statistics for improving our service.

2. **Data Storage**  
Your personal settings such as language preferences, theme selection, and audio feedback mode are stored locally on your device using browser local storage.

3. **Third-Party Services**  
LORA BOT utilizes third-party API services for voice recognition and natural language processing. These providers may process your voice data under their own privacy policies.

4. **No Voice Command Storage**  
We do not retain or store your voice commands or any related audio files on our servers.

5. **Data Security**  
We employ best practices to protect user data stored locally on your device.

6. **Your Rights**  
Since we do not store your commands or identifiable data, there's limited personal data to manage in this context. You control your device's local storage and can clear app data at any time.

7. **Children’s Privacy**  
LORA BOT is not intended for use by children under 13. We do not knowingly collect data from minors.

8. **Policy Updates**  
We may update this Privacy Policy occasionally. Continued use of the app means acceptance of any changes.

For further information or privacy concerns, please contact privacy@lorabot.app.
Contact: privacy@lorabot.app
    `,
    "build": "Build ID: {buildId}",
  },
  // For brevity: fallback all other languages to English if not provided
};

const fallbackLanguages = ["es-ES", "fr-FR", "de-DE", "hi-IN", "ta-IN", "ja-JP"];
fallbackLanguages.forEach(lang => {
  if (!translations[lang]) {
    translations[lang] = translations["en-US"];
  }
});

const supportedLanguages = [
  { code: "en-US", nameKey: "languages.en-US" },
  { code: "es-ES", nameKey: "languages.es-ES" },
  { code: "fr-FR", nameKey: "languages.fr-FR" },
  { code: "de-DE", nameKey: "languages.de-DE" },
  { code: "hi-IN", nameKey: "languages.hi-IN" },
  { code: "ta-IN", nameKey: "languages.ta-IN" },
  { code: "ja-JP", nameKey: "languages.ja-JP" },
];

const COMMANDS = ["forward", "backward", "left", "right", "stop"];
const BUILD_ID = "v2.1.0";

function t(key, values = {}, language = "en-US") {
  let text = translations[language]?.[key] || translations["en-US"]?.[key] || key;
  Object.entries(values).forEach(([k, v]) => {
    text = text.replace(new RegExp(`{${k}}`, "g"), v);
  });
  return text;
}

function getLocal(key, def) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : def;
  } catch {
    return def;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

const defaultSettings = {
  theme: "dark",
  language: "en-US",
  audioFeedback: "sound",
};

let appState = {
  ...defaultSettings,
  theme: getLocal("robot-theme", defaultSettings.theme),
  language: getLocal("robot-language", defaultSettings.language),
  audioFeedback: getLocal("robot-audio", defaultSettings.audioFeedback),
  page: "home",
  isListening: false,
  isLoading: false,
  status: { key: "home.status.default" },
  lastCommand: null,
  obstaclesDetected: true,
};

// Audio service for feedback sounds and speech synthesis

const sounds = {
  click: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAAABAQAASUZTPAAAAABfQ0A=",
  toggle: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAAABAQAASUZTPAAA===",
};

const audioService = {
  mode: "sound",
  setMode(mode) {
    this.mode = mode;
    if (mode !== "voice" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },
  click() {
    if (this.mode === "sound") new Audio(sounds.click).play().catch(() => {});
  },
  toggle() {
    if (this.mode === "sound") new Audio(sounds.toggle).play().catch(() => {});
  },
  speak(text, lang) {
    if (this.mode !== "voice" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    utter.voice = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.split("-")[0]));
    window.speechSynthesis.speak(utter);
  }
};

function saveSettings() {
  setLocal("robot-theme", appState.theme);
  setLocal("robot-language", appState.language);
  setLocal("robot-audio", appState.audioFeedback);
}

// Main rendering function

function render() {
  document.body.className = appState.theme === "light" ? "theme-light" : "";
  document.getElementById("app").innerHTML = `
    <h1 style="text-align:center; letter-spacing: 2px;">${t("home.title", {}, appState.language)}</h1>
    <nav class="flex-row" style="justify-content: center;">
      <button class="${appState.page === "home" ? "primary rugged-button" : "rugged-button"}"
              onclick="switchPage('home')">${t("home.nav.home", {}, appState.language)}</button>
      <button class="${appState.page === "settings" ? "primary rugged-button" : "rugged-button"}"
              onclick="switchPage('settings')">${t("home.nav.settings", {}, appState.language)}</button>
    </nav>
    <hr/>
    <main>
      ${appState.page === "home" ? renderHome() : ""}
      ${appState.page === "settings" ? renderSettings() : ""}
      ${(appState.page === "terms" || appState.page === "privacy") ? renderLegal(appState.page) : ""}
    </main>
    <footer style="text-align:center; margin-top:1rem;">${t("build", {buildId: BUILD_ID}, appState.language)}</footer>
  `;
}

// Home screen with live stream and controls

function renderHome() {
  const statusText = typeof appState.status === "string" ? appState.status : t(appState.status.key, appState.status.values, appState.language);
  return `
    <div class="rugged-panel" style="display:flex; flex-direction: column; align-items: center; min-height: 65vh;">
      <div class="status-bar" style="width: 100%; margin-bottom: 1rem; font-weight: bold; text-transform: uppercase;">
        ${statusText}
      </div>
      
      <button class="primary rugged-button" onclick="toggleSpeech()" ${appState.isLoading ? "disabled" : ""} style="width: 220px; margin-bottom: 1rem;">
        ${appState.isListening ? t("home.speakButton.listening", {}, appState.language) : t("home.speakButton.speak", {}, appState.language)}
      </button>
      
      <img src="https://images.unsplash.com/photo-1506744038136-462a3d48abf4?auto=format&fit=crop&w=640&q=80" alt="Military Scene" 
           style="width:320px; height:180px; border:3px solid #ca6b10; border-radius:10px; box-shadow:0 0 12px #ff9633; object-fit: cover; margin-bottom:1.5rem;" />
      
      <div style="display:flex; justify-content: center; gap: 1rem; width: 100%; max-width: 460px; margin-bottom: 0.7rem;">
        <button class="primary rugged-button" style="flex:1" onclick="manualCommand('left')" ${appState.isLoading ? "disabled" : ""}>${t("home.controls.left", {}, appState.language)}</button>
        <button class="primary rugged-button" style="flex:1" onclick="manualCommand('forward')" ${appState.isLoading ? "disabled" : ""}>${t("home.controls.forward", {}, appState.language)}</button>
        <button class="primary rugged-button" style="flex:1" onclick="manualCommand('right')" ${appState.isLoading ? "disabled" : ""}>${t("home.controls.right", {}, appState.language)}</button>
      </div>
      
      <div style="display:flex; justify-content: center; gap: 1rem; width: 100%; max-width: 460px;">
        <button class="primary rugged-button" style="flex:1" onclick="manualCommand('backward')" ${appState.isLoading ? "disabled" : ""}>${t("home.controls.backward", {}, appState.language)}</button>
        <button class="primary rugged-button" style="flex:1" onclick="manualCommand('stop')" ${appState.isLoading ? "disabled" : ""}>${t("home.controls.stop", {}, appState.language)}</button>
      </div>
      
      <div style="margin-top: 1.2rem; font-weight: bold; text-align:center; width: 100%;">
        ${t("home.obstacles.title", {}, appState.language)} 
        <span>${appState.obstaclesDetected ? t("home.obstacles.yes", {}, appState.language) : t("home.obstacles.no", {}, appState.language)}</span>
      </div>
    </div>
  `;
}

// Settings screen

function renderSettings() {
  return `
    <div class="rugged-panel" style="max-width: 520px;">
      <button class="rugged-button" onclick="switchPage('home')" style="margin-bottom:1rem;">&#x25c0; ${t("settings.title", {}, appState.language)}</button>
      <hr/>
      <div style="margin-bottom: 1rem;">
        <div><b>${t("settings.appearance.title", {}, appState.language)}</b></div>
        <div class="flex-row">
          <button class="${appState.theme === 'light' ? 'primary rugged-button' : 'rugged-button'}" onclick="setTheme('light')">${t("settings.appearance.light", {}, appState.language)}</button>
          <button class="${appState.theme === 'dark' ? 'primary rugged-button' : 'rugged-button'}" onclick="setTheme('dark')">${t("settings.appearance.dark", {}, appState.language)}</button>
        </div>
      </div>
      <div style="margin-bottom: 1rem;">
        <div><b>${t("settings.language.title", {}, appState.language)}</b></div>
        <select class="primary rugged-button" onchange="setLanguage(this.value)">
          ${supportedLanguages.map(lang =>
            `<option value="${lang.code}" ${lang.code === appState.language ? 'selected' : ''}>
              ${t(lang.nameKey, {}, lang.code)}
            </option>`
          ).join('')}
        </select>
      </div>
      <div style="margin-bottom:1rem;">
        <div><b>${t("settings.audio.title", {}, appState.language)}</b></div>
        <div class="flex-row">
          <button class="${appState.audioFeedback === 'off' ? 'primary rugged-button' : 'rugged-button'}" onclick="setAudioFeedback('off')">${t("settings.audio.off", {}, appState.language)}</button>
          <button class="${appState.audioFeedback === 'sound' ? 'primary rugged-button' : 'rugged-button'}" onclick="setAudioFeedback('sound')">${t("settings.audio.sound", {}, appState.language)}</button>
          <button class="${appState.audioFeedback === 'voice' ? 'primary rugged-button' : 'rugged-button'}" onclick="setAudioFeedback('voice')">${t("settings.audio.voice", {}, appState.language)}</button>
        </div>
      </div>
      <div style="margin-bottom:1rem;">
        <div><b>${t("settings.legal.title", {}, appState.language)}</b></div>
        <button class="rugged-button" style="width: 90%;" onclick="switchPage('terms')">${t("settings.legal.terms", {}, appState.language)}</button>
        <button class="rugged-button" style="width: 90%;" onclick="switchPage('privacy')">${t("settings.legal.privacy", {}, appState.language)}</button>
      </div>
      <div style="margin-bottom:1rem;">
        <b>${t("settings.system.title", {}, appState.language)}</b>
        <button class="rugged-button" onclick="reset()" style="margin-top: 0.5rem;">${t("settings.system.resetButton", {}, appState.language)}</button>
      </div>
    </div>
  `;
}

// Legal (terms & privacy)

function renderLegal(page) {
  const titleKey = page === 'terms' ? 'legal.terms.title' : 'legal.privacy.title';
  const contentKey = page === 'terms' ? 'legal.terms.content' : 'legal.privacy.content';
  return `
    <div class="rugged-panel" style="max-width: 520px;">
      <button class="rugged-button" onclick="switchPage('settings')" style="margin-bottom:1rem;">&#x25c0; ${t("settings.title", {}, appState.language)}</button>
      <h2>${t(titleKey, {}, appState.language)}</h2>
      <pre style="white-space: pre-wrap; opacity: 0.95;">${t(contentKey, {}, appState.language)}</pre>
    </div>
  `;
}

// Control handlers

window.switchPage = function(page) {
  appState.page = page;
  render();
};

window.setTheme = function(theme) {
  appState.theme = theme;
  saveSettings();
  render();
};

window.setLanguage = function(lang) {
  appState.language = lang;
  saveSettings();
  render();
};

window.setAudioFeedback = function(mode) {
  appState.audioFeedback = mode;
  audioService.setMode(mode);
  saveSettings();
  render();
};

window.reset = function() {
  appState = { ...defaultSettings };
  saveSettings();
  render();
};

window.manualCommand = function(cmd) {
  if (!COMMANDS.includes(cmd)) return;
  handleCommand(cmd);
};

function handleCommand(cmd) {
  appState.isLoading = true;
  appState.lastCommand = cmd;

  const cmdText = t(`home.controls.${cmd}`, {}, appState.language);
  appState.status = { key: "home.status.executing", values: { command: cmdText }};
  audioService.speak(t("home.status.executing", { command: cmdText }, appState.language), appState.language);

  render();

  setTimeout(() => {
    appState.status = { key: "home.status.completed", values: { command: cmdText }};
    appState.isLoading = false;
    render();

    setTimeout(() => {
      appState.status = { key: "home.status.default" };
      appState.lastCommand = null;
      render();
    }, 1600);
  }, 1200);
}

function unknownCommand() {
  appState.isLoading = false;
  appState.lastCommand = null;
  appState.status = { key: "home.status.unknown" };
  audioService.speak(t("home.status.unknown", {}, appState.language), appState.language);
  render();
}

let recognition = null;

window.toggleSpeech = function() {
  if (appState.isLoading) return;

  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    appState.status = { key: "home.status.browserNotSupported" };
    render();
    return;
  }

  if (appState.isListening) {
    recognition?.stop();
    return;
  }

  startRecognition();
};

function startRecognition() {
  appState.isListening = true;
  appState.status = { key: "home.status.listening" };
  audioService.speak(t("home.status.listening", {}, appState.language), appState.language);
  render();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = appState.language;
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    processTranscript(transcript);
  };

  recognition.onerror = event => {
    appState.isListening = false;
    appState.isLoading = false;
    appState.status = { key: "home.status.error", values: { error: event.error }};
    audioService.speak(t("home.status.error", { error: event.error }, appState.language), appState.language);
    render();
  };

  recognition.onend = () => {
    appState.isListening = false;
    render();
  };

  recognition.start();
}

async function processTranscript(transcript) {
  appState.isListening = false;
  appState.isLoading = true;
  appState.status = { key: "home.status.processing", values: { transcript } };
  audioService.speak(t("home.status.processing", { transcript }, appState.language), appState.language);
  render();

  const API_KEY = "AIzaSyBl76r1_OTVXCr-kJIwi4h1VJTrh3ty0xk "; // <=== Replace with your real API key
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  const systemInstruction = t("gemini.systemInstruction", {}, appState.language);

  // Using updated Gemini API request format:
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: systemInstruction + "\n" + transcript }],
      },
    ],
  };

  try {
    const response = await fetch(`${endpoint}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`API responded with status ${response.status}`);

    const data = await response.json();
    let output = "";

    if (data.candidates && data.candidates.length && data.candidates[0].message) {
      output = data.candidates[0].message.content || "";
    } else if (data.candidates && data.candidates.length && data.candidates[0].content) {
      output = (data.candidates[0].content.text && data.candidates[0].content.text[0]) || "";
    }

    const cmd = COMMANDS.find(c => output.toLowerCase().includes(c)) || "unknown";

    if (cmd === "unknown") {
      unknownCommand();
    } else {
      handleCommand(cmd);
    }
  } catch (error) {
    appState.isLoading = false;
    appState.status = { key: "home.status.error", values: { error: error.message } };
    audioService.speak(t("home.status.error", { error: error.message }, appState.language), appState.language);
    render();
  }
}

// Initialize app

(function () {
  audioService.setMode(appState.audioFeedback);
  render();
})();
