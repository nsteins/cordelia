$("#play-button")
  .on("click", function() {
    if (playing){
        $(this).find("use").attr("xlink:href", "#play-button-shape");
        pause();
    }
    else{
        $(this).find("use").attr("xlink:href", "#pause-button-shape");
        play();
    }
  });


function play(){
    let pauseBtn = document.getElementById("pause-button");
    let playBtn = document.getElementById("play-button");
    pauseBtn.style.display = 'inline';
    playBtn.style.display = 'none';
    Tone.context.resume();
    Tone.Transport.start();
    playing = true;

    let welcome = document.getElementById("welcome");
    welcome.classList.add('fade-out');
    welcome.style.animationDuration = '8s';
}

function pause(){
    let pauseBtn = document.getElementById("pause-button");
    let playBtn = document.getElementById("play-button");
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline';
    Tone.Transport.pause();
    playing = false;

    let welcome = document.getElementById("welcome");
    welcome.classList.remove('fade-out');
    welcome.classList.add('fade-in');
    welcome.style.animationDuration = '8s';
}

const ANIM_LENGTH = 2;
class Player {
    constructor(instrument, note, root_freq, destination, duration, loopLengthSeconds, delaySeconds, element){
        this.note = note;
        this.root_freq = root_freq;
        this.duration = duration
        this.animDuration = duration/2 < ANIM_LENGTH ? duration/2: ANIM_LENGTH
        this.loopLengthSeconds = loopLengthSeconds;
        this.delaySeconds = delaySeconds;
        this.element = element;

        this.destination = destination;
        this.instrument = this.createInstrument(instrument, this.createLoop)


        let panner = new Tone.AutoPanner(1/this.duration).toDestination().start();
        this.instrument.connect(panner);
        this.instrument.connect(this.destination);
    }

    createLoop() {
        return new Tone.Loop( (time) => {
            this.instrument.triggerAttackRelease(this.note, this.duration);
            Tone.Draw.schedule( this.startAnim.bind(this), time);
            Tone.Draw.schedule( this.endAnim.bind(this), time + this.duration - this.animDuration );
        }, this.loopLengthSeconds).start(this.delaySeconds);
    }

    createInstrument(name, callback){
        let envelope = {
            attack: 0.1,
            release: 4,
            releaseCurve: 'linear'
        };
        let filterEnvelope = {
            baseFrequency: 200,
            octaves: 2,
            attack: 0,
            decay: 0,
            release: 1000
        };
        let allInstruments = {
            'Cello': new Tone.Sampler({
                urls: {
                    B1: "CelloEns_susvib_B1_v1_1.wav",
                    B3: "CelloEns_susvib_B3_v1_1.wav",
                    C1: "CelloEns_susvib_C1_v1_1.wav",
                    C3: "CelloEns_susvib_C3_v1_1.wav",
                    D2: "CelloEns_susvib_D2_v1_1.wav",
                    E1: "CelloEns_susvib_E1_v1_1.wav",
                    F2: "CelloEns_susvib_F2_v1_1.wav",
                    G1: "CelloEns_susvib_G1_v1_1.wav"
                },
                baseUrl: "Samples/256OrchestralSamples/",
                onload: callback.bind(this),
                release: 1
            }),
            'Flute': new Tone.Sampler({
                urls: {
                    A3: 'LDFlute_susvib_A3_v1_1.wav',
                    A4: 'LDFlute_susvib_A4_v1_1.wav',
                    A5: 'LDFlute_susvib_A5_v1_1.wav',
                    C3: 'LDFlute_susvib_C3_v1_1.wav',
                    C4: 'LDFlute_susvib_C4_v1_1.wav',
                    C5: 'LDFlute_susvib_C5_v1_1.wav',
                    E3: 'LDFlute_susvib_E3_v1_1.wav',
                    E4: 'LDFlute_susvib_E4_v1_2.wav',
                    E5: 'LDFlute_susvib_E5_v1_2.wav',
                    G3: 'LDFlute_susvib_G3_v1_1.wav',
                    G4: 'LDFlute_susvib_G4_v1_1.wav'
                },
                baseUrl: "Samples/256OrchestralSamples/",
                onload: callback.bind(this),
                release: 1,
                volume: -6
            }),
            'Soft Vibes': new Tone.Sampler({
                urls: {
                    A2: 'Vibes_soft_A2_v2_rr2_Main.wav',
                    A4: 'Vibes_soft_A4_v2_rr3_Main.wav',
                    B3: 'Vibes_soft_B3_v2_rr2_Main.wav',
                    C3: 'Vibes_soft_C3_v2_rr2_Main.wav',
                    C5: 'Vibes_soft_C5_v2_rr2_Main.wav',
                    D4: 'Vibes_soft_D4_v2_rr2_Main.wav',
                    E3: 'Vibes_soft_E3_v2_rr2_Main.wav',
                    E5: 'Vibes_soft_E5_v2_rr2_Main.wav',     
                },
                baseUrl: "Samples/256OrchestralSamples/",
                onload: callback.bind(this),
                release: 1,
                volume: -18
            }),
            'Violin': new Tone.Sampler({
                urls: {
                    A5: 'VlnEns_Harm_A5.wav',
                    B4: 'VlnEns_Harm_B4.wav',
                    C6: 'VlnEns_Harm_C6.wav',
                    D5: 'VlnEns_Harm_D5.wav',
                    G4: 'VlnEns_Harm_G4.wav',
                },
                baseUrl: "Samples/256OrchestralSamples/",
                onload: callback.bind(this),
                release: 1,
                volume: -9
            }),
            'Synth': new Tone.DuoSynth({
                harmonicity: 1,
                volume: -20,
                voice0: {
                  oscillator: {type: 'sawtooth'},
                  envelope,
                  filterEnvelope
                },
                voice1: {
                  oscillator: {type: 'sine'},
                  envelope,
                  filterEnvelope
                },
                vibratoRate: 0.5,
                vibratoAmount: 0.1
              })
        }
            
        return allInstruments[name];
    } 
    startAnim(){
        document.querySelector(this.element).classList.remove('fade-out');
        document.querySelector(this.element).classList.add('fade-in');
        document.querySelector(this.element).style.animationDuration = this.animDuration+'s';
    }

    endAnim(){
        document.querySelector(this.element).classList.remove('fade-in')
        document.querySelector(this.element).classList.add('fade-out');
    }
}

let playing = false;

let BASE_LENGTH = 20;
let delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
let reverb = new Tone.Reverb(10).connect(delay);

let chakra1 = new Player("Cello", 'C1', 426.7, reverb, 8, BASE_LENGTH*0.9, 0, '#chakra1');
let chakra2 = new Player('Cello', 'D2', 426.7, reverb, 8, BASE_LENGTH*0.45, 8.1, '#chakra2');
let chakra3 = new Player('Cello', 'E2', 426.7, reverb, 8, BASE_LENGTH*0.86, 4.0, '#chakra3');

let chakra7 = new Player('Violin', 'B5', 426.7, reverb, 10, BASE_LENGTH*1.14, 10, '#chakra7');//mercury
let chakra6 = new Player('Violin', 'A5', 426.7, reverb, 10, BASE_LENGTH*1.2, 2.1, '#chakra6');//venus

let chakra5 = new Player('Flute', 'G4', 426.7, reverb, 6, BASE_LENGTH*1, 1.0, '#chakra5');//earth
let chakra4 = new Player('Flute', 'F4', 426.7, reverb, 6, BASE_LENGTH*1.88, 8.1, '#chakra4');//mars

let players = [chakra1, chakra2, chakra3, chakra4, chakra5, chakra6, chakra7]