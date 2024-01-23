import { Chuck } from 'https://cdn.jsdelivr.net/npm/webchuck/+esm'
var audioCtx = new AudioContext();

let convolver;
let theChuck = undefined;

async function createReverb(impulsePath) {
  let convolver = audioCtx.createConvolver();

  // load impulse response from file
  let response = await fetch(impulsePath);
  let arraybuffer = await response.arrayBuffer();
  convolver.buffer = await audioCtx.decodeAudioData(arraybuffer);

  return convolver;
}

async function convolveAudio() {
    // Disconnect the previous convolver node if it exists
    if (convolver) {
    convolver.disconnect();
    convolver = null;
    }

  // Get the selected impulse response path from the dropdown menu
  let impulseSelect = document.getElementById("impulseSelect");
  let selectedImpulsePath = impulseSelect.options[impulseSelect.selectedIndex].value;
  console.log(selectedImpulsePath);

  // Create or update the convolver with the selected impulse response
  convolver = convolver || await createReverb(selectedImpulsePath);

  // Initialize WebChucK with your custom AudioContext and connect it to the convolver
  if (!window.theChuck) {
    window.theChuck = await Chuck.init([], audioCtx);
    theChuck.connect(convolver);
    theChuck.runCode(`
    SinOsc sin => dac;
    440 => sin.freq;
    1::second => now;
  `);
  }


  // // Create an audio buffer source
  // let source = audioCtx.createBufferSource();

  // // Load your audio file
  // let audioFileResponse = await fetch("https://ccrma.stanford.edu/~eljbuck/220a/final/reference.wav");
  // let audioFileArrayBuffer = await audioFileResponse.arrayBuffer();
  // let audioBuffer = await audioCtx.decodeAudioData(audioFileArrayBuffer);

  // // Set the buffer for the audio source
  // source.buffer = audioBuffer;

  // // Connect the nodes: source -> convolver -> destination
  // source.connect(convolver);
  // convolver.connect(audioCtx.destination);

  // // Start playing the audio source
  // source.start();
}


// Add an event listener to the play button
document.getElementById("playButton").addEventListener("click", convolveAudio);
