# WebChucK Convolve

This is an implementation of convolutional reverb for WebChucK. This program utilizes the Web Audio API Convolver node as the engine for convolving the impulse response with the output from WebChucK. The preloaded IRs are all taken from various rooms in the Center for Computer Research in Music and Acoustics (CCRMA) at Stanford University.

## Instructions

First, navigate to the [live app](https://ccrma.stanford.edu/~eljbuck/220a/fp/). From here, you can select various IRs from the dropdown and listen to their effect on the reference audio (select `Listening Room` for a dry reference). You can also edit the live ChucK code and see what it sounds like in the various locations in CCRMA. At the bottom, you can listen to the different raw IRs at each of the locations.