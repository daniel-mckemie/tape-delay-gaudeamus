// Interface setup


// User Input/Microphone ON/OFF
// const inputSwitch = new Nexus.Toggle('#input-switch', {
//   'state': false
// })

const inputSwitch = document.getElementById('input-switch');

inputSwitch.addEventListener('change', function() {  
  if (inputSwitch.checked === true) {
    userInput.open()
  } else { userInput.close() }
})

// Input Gain
// const userVol = new Nexus.Slider('#user-vol-slider', {
//   'mode': 'relative', // 'relative' or 'absolute'
//   'min': -24,
//   'max': 12,
//   'step': 0,
//   'value': -24
// });

const userVol = document.getElementById('user-vol-slider');

userVol.addEventListener('input', function() {  
  userAmp.volume.value = userVol.value;
})

// AM Oscillator controls
// const amFreqDial = new Nexus.Dial('#am-freq-dial', {
//   'interaction': 'radial', // "radial", "vertical", or "horizontal"
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0,
//   'max': 5000,
//   'step': 0,
//   'value': 0
// })

const amFreqDial = document.getElementById('am-freq-dial');

amFreqDial.addEventListener('input', function() {
  osc1.frequency.value = amFreqDial.value;
})


// const amTuneDial = new Nexus.Dial('#am-tune-dial', {
//   'interaction': 'radial', // "radial", "vertical", or "horizontal"
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0,
//   'max': 1000,
//   'step': 0,
//   'value': 0
// })

const amTuneDial = document.getElementById('am-tune-dial');

amTuneDial.addEventListener('input', function() {
  osc1.detune.value = amTuneDial.value;
})

// const amHarmSlider = new Nexus.Slider('#am-harm-slider', {
//   'mode': 'relative', // 'relative' or 'absolute'
//   'min': 0,
//   'max': 1,
//   'step': 0,
//   'value': 0
// })

const amHarmSlider = document.getElementById('am-harm-slider');

amHarmSlider.addEventListener('input', function() {
  osc1.harmonicity.value = amHarmSlider.value;
})

// Switch AM Mod wave
// const amModSwitch = new Nexus.Toggle('#am-mod-switch', {
//   'state': false
// })

const amModSwitch = document.getElementById('am-mod-switch');

amModSwitch.addEventListener('change', function() {
  if (amModSwitch.checked === true) {
    osc1.stop();
    osc1.modulationType = 'sawtooth';
    osc1.start();
  } else {
    osc1.stop();
    osc1.modulationType = 'square';
    osc1.start();
  }
})


// Switch from AM or FM Synthesis
// const modType = new Nexus.Toggle('#mod-type', {
//   'state': false
// })

const modType = document.getElementById('mod-type');

// Starts the system, once on cannot be shut off
modType.addEventListener('change', function() {
  if (modType.checked === true) {
    osc1.stop();
    osc2.start();
    
  } else {
    osc1.start();
    osc2.stop();
    
  }
})


// // FM Oscillator controls
// const fmFreqDial = new Nexus.Dial('#fm-freq-dial', {
//   'interaction': 'radial', // "radial", "vertical", or "horizontal"
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0,
//   'max': 5000,
//   'step': 0,
//   'value': 0
// })

const fmFreqDial = document.getElementById('fm-freq-dial');

fmFreqDial.addEventListener('input', function() {
  osc2.frequency.value = fmFreqDial.value;
})

// const fmModDial = new Nexus.Dial('#fm-mod-index', {
//   'interaction': 'radial', // "radial", "vertical", or "horizontal"
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0,
//   'max': 100,
//   'step': 0,
//   'value': 0
// })

const fmModDial = document.getElementById('fm-mod-index');

fmModDial.addEventListener('input', function() {
  osc2.modulationIndex.value = fmModDial.value;
})

// const fmHarmSlider = new Nexus.Slider('#fm-harm-slider', {
//   'mode': 'relative', // 'relative' or 'absolute'
//   'min': 0,
//   'max': 1,
//   'step': 0,
//   'value': 0
// })

const fmHarmSlider = document.getElementById('fm-harm-slider');

fmHarmSlider.addEventListener('input', function() {
  osc2.harmonicity.value = fmHarmSlider.value;
})

// Switch FM Mod wave
// const fmModSwitch = new Nexus.Toggle('#fm-mod-switch', {
//   'state': false
// })

const fmModSwitch = document.getElementById('fm-mod-switch');

fmModSwitch.addEventListener('change', function() {
  if (fmModSwitch.checked === true) {
    osc2.stop();
    osc2.modulationType = 'sawtooth';
    osc2.start();
  } else {
    osc2.stop();
    osc2.modulationType = 'square';
    osc2.start();
  }
})


// Power noise/filter on
// const filterSwitch = new Nexus.Toggle('#filter-switch', {
//   'state': false
// })

const filterSwitch = document.getElementById('filter-switch');

filterSwitch.addEventListener('change', function(x) {
  if (filterSwitch.checked === true) {
    noise.start();
    noiseFilter.start();
  } else {
    noise.stop();
    noiseFilter.stop();
    
  }
})

// Noise controls
// const noiseFreqSlider = new Nexus.Slider('#noise-freq-slider', {
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0,
//   'max': 40,
//   'step': 0,
//   'value': 0
// })

const noiseFreqSlider = document.getElementById('noise-freq-slider');

noiseFreqSlider.addEventListener('input', function() {
  noiseFilter.frequency.value = noiseFreqSlider.value;
})

// const noiseDepthSlider = new Nexus.Slider('#noise-depth-slider', {
//   'mode': 'relative', // 'relative' or 'absolute'
//   'min': 0,
//   'max': 1,
//   'step': 0,
//   'value': 0
// })

const noiseDepthSlider = document.getElementById('noise-depth-slider');

noiseDepthSlider.addEventListener('input', function() {
  noiseFilter.depth.value = noiseDepthSlider.value;
})


// // ADSR controls
// const attackSlider = new Nexus.Slider('#attack-slider', {
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0.01,
//   'max': 2,
//   'step': 0,
//   'value': 0
// })

// attackSlider.on('change', function(x) {
//   env.attack = x
// })

// const decaySlider = new Nexus.Slider('#decay-slider', {
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0.01,
//   'max': 2,
//   'step': 0,
//   'value': 0
// })

// decaySlider.on('change', function(x) {
//   env.decay = x
// })

// const sustainSlider = new Nexus.Slider('#sustain-slider', {
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0.01,
//   'max': 2,
//   'step': 0,
//   'value': 0
// })

// sustainSlider.on('change', function(x) {
//   env.sustain = x
// })

// const releaseSlider = new Nexus.Slider('#release-slider', {
//   'mode': 'relative', // "absolute" or "relative"
//   'min': 0.01,
//   'max': 2,
//   'step': 0,
//   'value': 0
// })

// releaseSlider.on('change', function(x) {
//   env.release = x
// })

// Feedback depth controls

// //L channel input coupled back
// const crossCoupleSlider = new Nexus.Slider('#cross-couple-slider', {
//   'mode': 'relative', // 'relative' or 'absolute'
//   'min': -24,
//   'max': 12,
//   'step': 0,
//   'value': -24
// });

const crossCoupleSlider = document.getElementById('cross-couple-slider');

crossCoupleSlider.addEventListener('input', function(x) {
  tapeDelayL2Amp.volume.value = crossCoupleSlider.value;
})


// //Input into L from delayed R
// const delayDepthSlider = new Nexus.Slider('#delay-depth-slider', {
//   'mode': 'relative', // 'relative' or 'absolute'
//   'min': -24,
//   'max': 12,
//   'step': 0,
//   'value': -24
// });

const delayDepthSlider = document.getElementById('delay-depth-slider');

delayDepthSlider.addEventListener('change', function() {
  tapeDelayRAmp.volume.value = delayDepthSlider.value;
})



