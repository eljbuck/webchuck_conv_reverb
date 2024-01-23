import { Chuck } from 'https://cdn.jsdelivr.net/npm/webchuck/+esm'

// initially undefined
var audioContext = new AudioContext();
var theChuck;
let convolver;


async function createReverb(impulsePath) {
    let convolver = audioContext.createConvolver();
 
    // load impulse response from file
    let response = await fetch(impulsePath);
    let arraybuffer = await response.arrayBuffer();
    convolver.buffer = await audioContext.decodeAudioData(arraybuffer);
 
    return convolver;
  }

  async function convolve() {
    if (convolver) {
        convolver.disconnect();
        convolver = null;
    }
    let impulseSelect = document.getElementById("impulseSelect");
    let selectedImpulsePath = impulseSelect.options[impulseSelect.selectedIndex].value;
    console.log(selectedImpulsePath);
    convolver = convolver || await createReverb(selectedImpulsePath);

    return convolver;
  }

async function run() {
    console.log('running');
    theChuck.runCode(`
    SinOsc sin => ADSR adsr => dac;
    adsr.set(10::ms, 0::ms, 1.0, 100::ms);
    sin.gain(0.1);
    440 => sin.freq;
    adsr.keyOn();
    1::second => now;
    adsr.keyOff();
    1::second => now;
  `);
}

var startButton = document.getElementById("action");
startButton.addEventListener('click', async function() {
    // Initializing Chuck the first time the button is clicked
    // The resume audio context
    if (theChuck === undefined) {
        theChuck = await Chuck.init([], audioContext);
        theChuck.connect(audioContext.destination);
        audioContext.resume();
    }
    convolver = await convolve();
    theChuck.connect(convolver);
    convolver.connect(audioContext.destination);

    console.log("x");
    await run();
  });