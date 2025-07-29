// ==== Constants ====

const translations = {
  "en-US": {
    "home.title": "LORA BOT",
    "home.status.default": "/// STANDING BY FOR COMMAND ///",
    "home.status.listening": "Listening...",
    "home.status.processing": 'Processing Command: "{transcript}"',
    "home.status.executing": "Executing: {command}",
    "home.status.completed": "Execution Complete: {command}",
    "home.status.unknown": "Command Unrecognized. Please Repeat.",
    "home.status.error": "System Error: {error}.",
    "home.status.browserNotSupported": "Speech Recognition Not Supported by Browser.",
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
    "settings.appearance.title": "Visual Theme",
    "settings.appearance.light": "Day Mode",
    "settings.appearance.dark": "Night Mode",
    "settings.language.title": "Language Protocol",
    "settings.language.label": "Select Language",
    "settings.audio.title": "Audio Feedback",
    "settings.audio.off": "Off",
    "settings.audio.soundFX": "Sound FX",
    "settings.audio.voice": "Voice",
    "settings.system.title": "System",
    "settings.system.resetButton": "Reset All Settings",
    "settings.legal.title": "Legal",
    "settings.legal.terms": "Terms of Service",
    "settings.legal.privacy": "Privacy Policy",
    "settings.build": "Build ID: {buildId}",
    "languages.en-US": "English (US)",
    // Add more languages if needed...
    "gemini.systemInstruction":
      "You are a robot controller. Analyze the following user command and map it to one of the available actions: forward, backward, left, right, stop.",
  },
};

const supportedLanguages = [
  { code: "en-US", nameKey: "languages.en-US" },
  // Add more if needed
];

const COMMANDS = ["forward", "backward", "left", "right", "stop"];
const BUILD_ID = "v2.1.0-voice";

// ==== Settings & Utils ====

function t(key, values = {}, language = "en-US") {
  let text =
    (translations[language] && translations[language][key]) ||
    translations["en-US"][key] ||
    key;
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      text = text.replaceAll(`{${k}}`, v);
    });
  }
  return text;
}

function getLocal(key, def) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : def;
  } catch (e) {
    return def;
  }
}

function setLocal(key, val) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

const defaultSettings = {
  theme: "dark",
  language: supportedLanguages[0].code,
  audioFeedbackMode: "sound",
};

function getSettings() {
  return {
    theme: getLocal("robot-theme", defaultSettings.theme),
    language: getLocal("robot-language", defaultSettings.language),
    audioFeedbackMode: getLocal("robot-audio-mode", defaultSettings.audioFeedbackMode),
  };
}

function saveSettings(settings) {
  setLocal("robot-theme", settings.theme);
  setLocal("robot-language", settings.language);
  setLocal("robot-audio-mode", settings.audioFeedbackMode);
}

// ==== Audio ====

const sounds = {
  click: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
  toggle: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQwgAAA=",
};

const audioService = {
  mode: "sound",
  setMode(newMode) { this.mode = newMode; },
  click() {
    if (this.mode === "sound") new Audio(sounds.click).play().catch(() => {});
  },
  toggle() {
    if (this.mode === "sound") new Audio(sounds.toggle).play().catch(() => {});
  },
  speak(text, lang) {
    if (this.mode !== "voice" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    utter.voice =
      voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    window.speechSynthesis.speak(utter);
  },
};

// ==== App State & Rendering ====

let appState = {
  ...getSettings(),
  page: "home",
  isListening: false,
  isLoading: false,
  status: { key: "home.status.default" },
  lastCommand: null,
  obstaclesDetected: true,
};

function render() {
  document.body.className = appState.theme === "light" ? "theme-light" : "";
  document.getElementById("app").innerHTML = `
    <h1>${t("home.title", {}, appState.language)}</h1>
    <nav class="flex-row">
      <button class="${appState.page === "home" ? "primary" : ""}" onclick="switchPage('home')">${t(
    "home.nav.home",
    {},
    appState.language
  )}</button>
      <button class="${appState.page === "settings" ? "primary" : ""}" onclick="switchPage('settings')">${t(
    "home.nav.settings",
    {},
    appState.language
  )}</button>
    </nav>
    <hr/>
    <main>
      ${appState.page === "home" ? renderHome() : ""}
      ${appState.page === "settings" ? renderSettings() : ""}
      ${appState.page === "terms" || appState.page === "privacy" ? renderLegal(appState.page) : ""}
    </main>
    <footer>${t("settings.build", { buildId: BUILD_ID }, appState.language)}</footer>
  `;
}

// ... (renderHome, renderSettings, renderLegal unchanged, same as your original code) ...

// Navigation & Events

window.switchPage = function (page) {
  audioService.click();
  if (page === "home" && appState.page !== "home") returnToDefaultStatus();
  appState.page = page;
  render();
};

function returnToDefaultStatus() {
  setTimeout(() => {
    appState.status = { key: "home.status.default" };
    render();
  }, 600);
}

// Command Handling

window.manualCommand = function (cmd) {
  if (!COMMANDS.includes(cmd)) return;
  audioService.click();
  handleCommand(cmd);
};

function handleCommand(cmd) {
  appState.isLoading = true;
  appState.lastCommand = cmd;
  const cmdText = t("home.controls." + cmd, {}, appState.language);
  appState.status = {
    key: "home.status.executing",
    values: { command: cmdText },
  };
  audioService.speak(t("home.status.executing", { command: cmdText }, appState.language), appState.language);
  render();

  setTimeout(() => {
    appState.status = {
      key: "home.status.completed",
      values: { command: cmdText },
    };
    appState.isLoading = false;
    render();
    setTimeout(() => {
      appState.status = { key: "home.status.default" };
      appState.lastCommand = null;
      render();
    }, 1600);
  }, 1200);
}

function unknownCommandError() {
  appState.isLoading = false;
  appState.lastCommand = null;
  appState.status = { key: "home.status.unknown" };
  audioService.speak(t("home.status.unknown", {}, appState.language), appState.language);
  render();
}

// Speech Recognition Setup

let recognition;

window.toggleSpeech = function () {
  audioService.click();
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    appState.status = { key: "home.status.browserNotSupported" };
    render();
    return;
  }
  if (appState.isListening) {
    try {
      recognition && recognition.stop();
    } catch {}
    appState.isListening = false;
    render();
    return;
  }
  startSpeechRecognition();
};

function startSpeechRecognition() {
  appState.isListening = true;
  appState.status = { key: "home.status.listening" };
  audioService.speak(t("home.status.listening", {}, appState.language), appState.language);
  render();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = appState.language;
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    processTranscript(transcript);
  };
  recognition.onerror = function (event) {
    appState.isListening = false;
    appState.isLoading = false;
    appState.status = { key: "home.status.error", values: { error: event.error } };
    audioService.speak(t("home.status.error", { error: event.error }, appState.language), appState.language);
    render();
  };
  recognition.onend = function () {
    appState.isListening = false;
    render();
  };

  recognition.start();
}

// ==== UPDATED Gemini API Integration ====

async function processTranscript(transcript) {
  appState.isLoading = true;
  appState.isListening = false;

  const processingStatus = {
    key: "home.status.processing",
    values: { transcript },
  };
  appState.status = processingStatus;
  audioService.speak(t(processingStatus.key, processingStatus.values, appState.language), appState.language);
  render();

  // Gemini API Integration
  const API_KEY = "AIzaSyBl76r1_OTVXCr-kJIwi4h1VJTrh3ty0xk";
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  // System instruction from translations
  const systemInstruction = t("gemini.systemInstruction", {}, appState.language);

  // Payload per Gemini API
  const payload = {
    prompt: {
      // Newer Gemini API uses messages array for chat-style
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: transcript },
      ],
    },
    // You may add safetySettings or generationConfig if required
  };

  try {
    const response = await fetch(`${endpoint}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    // The Gemini response's command should be in: data.candidates[0].message.content
    let cmd = "unknown";

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].message &&
      data.candidates[0].message.content
    ) {
      const output = data.candidates[0].message.content.trim().toLowerCase();

      // Find a known command in the output string
      cmd = COMMANDS.find((c) => output.includes(c)) || "unknown";
    }

    if (cmd === "unknown") {
      unknownCommandError();
    } else {
      handleCommand(cmd);
    }
  } catch (error) {
    const e = error instanceof Error ? error : new Error(String(error));
    appState.isLoading = false;
    appState.status = { key: "home.status.error", values: { error: e.message } };
    audioService.speak(t("home.status.error", { error: e.message }, appState.language), appState.language);
