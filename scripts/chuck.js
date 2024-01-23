// chuck.js

// Wrap the code in an async function
async function initializeChuck() {
    // Initialize ChucK with a local audioContext, connect ChucK to the context destination
    var audioContext = new AudioContext();
    theChuck = await Chuck.init([], audioContext);
    theChuck.connect(audioContext.destination);
  
    async function createReverb(impulsePath) {
      let convolver = audioContext.createConvolver();
  
      // load impulse response from file
      let response = await fetch(impulsePath);
      let arraybuffer = await response.arrayBuffer();
      convolver.buffer = await audioContext.decodeAudioData(arraybuffer);
  
      return convolver;
    }
  
    // You might want to use 'let' instead of 'var' here, depending on your use case
    let convolver = convolver || await createReverb("https://ccrma.stanford.edu/~eljbuck/220a/final/IRs/ballroom.wav");
  
    theChuck.connect(convolver);
  
    async function run() {
      console.log('running');
      theChuck.runCode(`
        SinOsc sin => dac;
        440 => sin.freq;
        1::second => now;
      `);
    }
  
    var startButton = document.getElementById("action");
    startButton.addEventListener('click', async function () {
      console.log("x");
      await run();
    });
  }
  
  // Call the async function to initialize Chuck
  initializeChuck();
  