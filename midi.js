// MIDI setup

let midi;
let midiLearn = false;
let midiLearnElement = null;
let data;

// MIDI CC Assignments

inVolCC = 2;
amHarmonicity = 3;
fmHarmonicity = 5;
noiseCutoff = 6;
noiseDepthVal = 8;
crossCoupleDepth = 9;
rToLDepth = 12;
amFrequency = 14;
amFineTune = 15;
fmFrequency = 16;
fmDepth = 17;
amSquSaw = 24;
amFm = 25;
fmSquSaw = 26;
noiseSwitch = 27;
userSwitch = 33;


function changeCCs() {
  inVolCC = document.getElementById('inVolCC').value;
  amHarmonicity = document.getElementById('amHarmonicity').value;
  fmHarmonicity = document.getElementById('fmHarmonicity').value;
  noiseCutoff = document.getElementById('noiseCutoff').value;
  noiseDepthVal = document.getElementById('noiseDepthVal').value;
  crossCoupleDepth = document.getElementById('crossCoupleDepth').value;
  rToLDepth = document.getElementById('rToLDepth').value;
  amFrequency = document.getElementById('amFrequency').value;
  amFineTune = document.getElementById('amFineTune').value;
  fmFrequency = document.getElementById('fmFrequency').value;
  fmDepth = document.getElementById('fmDepth').value;
  amSquSaw = document.getElementById('amSquSaw').value;
  amFm = document.getElementById('amFm').value;
  fmSquSaw = document.getElementById('fmSquSaw').value;
  noiseSwitch = document.getElementById('noiseSwitch').value;
  userSwitch = document.getElementById('userSwitch').value;
}


// request MIDI access
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false // this defaults to 'false'
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}



function qs(e) {
  return document.querySelector(e);
}

function qsa(e) {
  return document.querySelectorAll(e);
}

// Not enabled
const listdevices = (midiAccess) => {
  let list = ''
  for (let entry of midiAccess.inputs) {
    let input = entry[1];
    list = "<li>Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'</li>";
  }
  // qs('.midioutputs').innerHTML = list;
}

// MIDI functions
function onMIDISuccess(midiAccess) {
  console.log('MIDI ready!')
  listdevices(midiAccess)
  listenMidi(midiAccess)
  midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status 
  // when we get a succesful response, run this code
  const inputs = midi.inputs.values();
  // loop over all available inputs and listen for any MIDI input
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    // each time there is a midi message call the onMIDIMessage function
    input.value.onmidimessage = onMIDIMessage;
  }
  // console.log('MIDI Access Object', midiAccess);
}

function onMIDIFailure(e) {
  // when we get a failed response, run this code
  infoDiv.innerHTML = `Web MIDI not supported in this browser ${e}`;
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

let velocity

const onMIDIMessage = event => {
  if (midiLearn) {
    if (midiLearnElement != null) {
      midiLearnElement.classList.add('link-' + event.data[1])
      midiLearn = false;
      midiLearnElement = null;            
    } else {
      if (qs('.link-' + event.data[1])) {
        qs('.link-' + event.data[1]).value = event.data[2];
      }
    }
  }

  const infoDiv = document.getElementById('info-div');
  

  data = event.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0, // channel agnostic message type
    note = data[1],
    velocity = data[2];

  infoDiv.innerHTML = `CC Number: ${note}`;
  switch (note) {
    case parseInt(amFrequency): // korg knob 1
      amFreq(velocity)
      break;
    case parseInt(amFineTune): // korg knob 2
      amTune(velocity)
      break;
    case parseInt(fmFrequency): // korg knob 3
      fmFreq(velocity)
      break;
    case parseInt(fmDepth):
      fmMod(velocity)
      break;
    // case 18:
    //   att(velocity)
    //   break;
    // case 19:
    //   dec(velocity)
    //   break;
    // case 20:
    //   sus(velocity)
    //   break;
    // case 21:
    //   rel(velocity)
    //   break;
    case parseInt(inVolCC): // korg slider 1      
      userIn(velocity)
      break;
    case parseInt(amHarmonicity): // korg slider 2
      amHarm(velocity)
      break;
    case parseInt(fmHarmonicity): // korg slider 3
      fmHarm(velocity)
      break;
    case parseInt(noiseCutoff):
      noiseFreq(velocity)
      break;
    case parseInt(noiseDepthVal):
      noiseDepth(velocity)
      break;
    case parseInt(crossCoupleDepth): // korg slider 7
      crossCouple(velocity)
      break;
    case parseInt(rToLDepth): // korg slider 8
      rightToLeft(velocity)
      break;
    case parseInt(userSwitch): // korg button 1B
      inputOn(velocity)
      break;
    case parseInt(amSquSaw): // korg button 4A
      amModType(velocity)
      break;
    case parseInt(amFm): // korg button 3A
      amFmSwitch(velocity)
      break;
    case parseInt(fmSquSaw): // korg button 4A
      fmModType(velocity)
      break;
    case parseInt(noiseSwitch): // korg button 5A
      noiseFilterSwitch(velocity)
      break;
  }

  switch (type) {
    case 144: // note on
      noteOn(note, velocity)
    case 160: // note on (louder)    
      noteOn(note, velocity)
      break;
    case 128:
      noteOff(note, velocity) // note off
      break;
  }
  // console.log('MIDI data', data) // Reads all MIDI data
  // console.log('MIDI data', note)
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}



function noteOn(midiNote, velocity) {
  // Try commented out block to prevent zippering effect
  osc1.frequency.value = frequencyFromNoteNumber(midiNote)
  // osc1.frequency.setTargetAtTime(frequencyFromNoteNumber(midiNote), actx.currentTime, 0.015)
  oscAmp1.volume.setTargetAtTime(-12, actx.currentTime, 0.015)

  osc2.frequency.value = frequencyFromNoteNumber(midiNote)
  // osc2.frequency.setTargetAtTime(frequencyFromNoteNumber(midiNote), actx.currentTime, 0.015)
  oscAmp2.volume.setTargetAtTime(-12, actx.currentTime, 0.015)

}

function noteOff(midiNote, velocity) {
  osc1.frequency.setTargetAtTime(0, actx.currentTime, 0.015)
  oscAmp1.volume.setTargetAtTime(-88, actx.currentTime, 0.015)
  osc2.frequency.setTargetAtTime(0, actx.currentTime, 0.015)
  oscAmp2.volume.setTargetAtTime(-88, actx.currentTime, 0.015)

}

const listenMidi = (midiAccess) => {
  midiAccess.inputs.forEach(function (entry) {
    entry.onmidimessage = onMIDIMessage
  })
}





// qs('.midilearn').addEventListener('click', (e) => {
//   if (midi) {
//     midiLearn = true;
//   }
// })

// qs('.midiclear').addEventListener('click', (e) => {
//   if (midi) {
//     midiLearn = false;
//     for (let p of qsa('.midiobject')) {
//       p.classList.remove('active')
//     }
//   }
// })

// for (let p of qsa('.midiobject')) {
//   p.addEventListener('click', (e) => {
//     if (midiLearn) {
//       e.target.classList.add('active');
//       // standard instanciation of SimpleMidiInput
//       var smi = new SimpleMidiInput();

//       // get the DOM elements
//       var input = e.target;      
//       var learnButton = document.getElementById('my-parameter-learn');
//       var clearButton = document.getElementById('my-parameter-clear');

//       // custom function to handle the changes of value
//       var change = function (value) {
//         console.log('parameter change:', value);
//       };


//       /** HERE STARTS THE ACTUAL CODE RELATED TO MIDI LEARN **/

//       // we can set up the midi learning before smi is actually attached to a MIDIInput
//       var midiLearning = smi.getMidiLearning({
//         id: input.id,
//         min: input.min,
//         max: input.max,
//         value: input.value,
//         events: {
//           bind: function () {
//             console.log('bind', arguments);
//           },
//           unbind: function () {
//             console.log('unbind', arguments);
//           },
//           listen: function () {
//             console.log('listen', arguments);
//           },
//           cancel: function () {
//             console.log('cancel', arguments);
//           },
//           change: function (id, value) {
//             console.log('change', arguments);
//             input.value = value;
//             change(value); // apply the change to our custom function
//           }
//         }
//       });

//       // start listening to midi events to bind the parameter to when clicking on 'learn'
//       learnButton.addEventListener('click', function () {
//         midiLearning.startListening();
//       });

//       // clear the midi bindings (and cancel the listener) when clicking on 'clear'
//       clearButton.addEventListener('click', function () {
//         midiLearning.unbind();
//       });

//       /** HERE ENDS THE ACTUAL CODE RELATED TO MIDI LEARN **/

//       // make so direct changes to the input also affects the parameters
//       input.addEventListener('change', function () {
//         change(input.value); // apply the change to our custom function
//       });

//       // attaching SMI to the MIDI inputs
//       var onMIDIStarted = function (midi) {
//         console.log('onMIDIStarted', midi);
//         smi.attach(midi);
//       };

//       var onMIDISystemError = function () {
//         console.log('onMIDISystemError', arguments);
//       };
      
//     } else {
//       e.target.classList.remove('active');      
//     }
//   })
// }



const oldRange = 127 - 0 // MIDI range

function amFreq(x) {
  // logarathmic knob
  const min = 0
  const max = 127
  const logMin = Math.log(1)
  const logMax = Math.log(5000)
  const scale = (logMax - logMin) / (max - min)
  let newValue = Math.exp(logMin + scale * (x - min)).toFixed(8)
  amFreqDial.value = newValue
  osc1.frequency.setTargetAtTime(newValue, actx.currentTime, 0.015) // de-zippering
  // console.log(osc1.frequency.value)
}

function amTune(x) {
  const newValue = (x * 7.874).toFixed(8)
  amTuneDial.value = newValue
  osc1.detune.value = newValue
  // console.log(osc1.detune.value)
}

function fmFreq(x) {
  // logarathmic knob
  const min = 0
  const max = 127
  const logMin = Math.log(1)
  const logMax = Math.log(5000)
  const scale = (logMax - logMin) / (max - min)
  let newValue = Math.exp(logMin + scale * (x - min)).toFixed(8)
  fmFreqDial.value = newValue
  osc2.frequency.setTargetAtTime(newValue, actx.currentTime, 0.015) // de-zippering
  // console.log(osc2.frequency.value)
}


function fmMod(x) {
  const newValue = (x * .7874).toFixed(8)
  fmModDial.value = newValue
  osc2.modulationIndex.value = newValue
  // console.log(osc2.modulationIndex.value)
}



// Input Gain - Slider 1
function userIn(x) {
  const newRange = 12 - (-24)
  const newValue = ((x - 127) * newRange) / oldRange + 12
  userVol.value = newValue.toFixed(8)
  userAmp.volume.value = newValue.toFixed(8)
  // console.log(userAmp.volume.value)
}

// AM Osc Harmonicity - Slider 2
function amHarm(x) {
  const newValue = (x * 0.007874).toFixed(16)
  amHarmSlider.value = newValue
  osc1.harmonicity.value = newValue
  // console.log(osc1.harmonicity.value)
}

// FM Osc Harmonicity - Slider 4
function fmHarm(x) {
  const newValue = (x * 0.007974).toFixed(16)
  fmHarmSlider.value = newValue
  osc2.harmonicity.value = newValue
  // console.log(osc2.harmonicity.value)
}


// Feedback Amps
function crossCouple(x) {
  const newRange = 12 - (-24)
  const newValue = ((x - 127) * newRange) / oldRange + 12
  crossCoupleSlider.value = newValue.toFixed(8)
  tapeDelayL2Amp.volume.value = newValue.toFixed(8)
  // console.log(tapeDelayL2Amp.volume.value)
}

function rightToLeft(x) {
  const newRange = 12 - (-24)
  const newValue = ((x - 127) * newRange) / oldRange + 12
  delayDepthSlider.value = newValue.toFixed(8)
  tapeDelayRAmp.volume.value = newValue.toFixed(8)
  // console.log(tapeDelayRAmp.volume.value)
}


function inputOn(x) {
  if (x === 127) {
    inputSwitch.state = true
  } else {
    inputSwitch.state = false
  }
}

function amFmSwitch(x) {
  if (x === 127) {
    modType.state = true
  } else {
    modType.state = false
  }
}

function amModType(x) {
  if (x === 127) {
    amModSwitch.state = true
  } else {
    amModSwitch.state = false
  }
}

function fmModType(x) {
  if (x === 127) {
    fmModSwitch.state = true
  } else {
    fmModSwitch.state = false
  }
}

function noiseFilterSwitch(x) {
  if (x === 127) {
    filterSwitch.state = true
  } else {
    filterSwitch.state = false
  }
}

function noiseFreq(x) {
  // logarathmic knob
  const min = 0
  const max = 127
  const logMin = Math.log(1)
  const logMax = Math.log(40)
  const scale = (logMax - logMin) / (max - min)
  let newValue = Math.exp(logMin + scale * (x - min)).toFixed(8)
  noiseFreqSlider.value = newValue
  noiseFilter.frequency.value = newValue
  // console.log(noiseFilter.frequency.value)
}

// FM Osc Harmonicity - Slider 4
function noiseDepth(x) {
  const newValue = (x * 0.00787401).toFixed(16)
  noiseDepthSlider.value = newValue
  noiseFilter.depth.value = newValue
  // console.log(noiseFilter.depth.value)
}

const inputs = document.getElementsByClassName('midiobject');

const resetSliders = document.getElementById('reset-sliders');
resetSliders.addEventListener('click', function () {
  for (let input of inputs) {
    input.value = input.min;
    resetSliders.value = 'Reset Sliders';
  }

})

function beginMidiLearn(input) {

}