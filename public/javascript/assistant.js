const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const audio = document.getElementById('audio');
const uploadBtn = document.getElementById('uploadBtn');

let recorder;
let audioStream;
let audioContext;
let analyser;
let dataArray;

const canvas = document.getElementById("visualizer");
const canvasCtx = canvas.getContext("2d");

//Implementing the Start/Stop for lottie avatar
let player = document.querySelector("#lottie");
let startButton = document.querySelector("#startBtn");
let stopButton = document.querySelector("#stopBtn");

//Implementing the Start/Stop for lottie avatar
startButton.onclick = function() {
    player.play();
};

stopButton.onclick = function() {
    player.stop();
};

//Implementing Hide/Show for Start/Stop Button
document.getElementById('startBtn').addEventListener('click', function() {
    this.style.display = 'none';
    document.getElementById('stopBtn').style.display = 'flex';
    document.getElementById('loading').style.display = 'none';
});

document.getElementById('stopBtn').addEventListener('click', function() {
    this.style.display = 'none';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('loading').style.display = 'flex';
});

//Expriring the license key after one usage
// document.getElementById("expireButton").addEventListener("click", function() {
//     var licenseKey = document.getElementById("licenseInput").value;
//     fetch("https://yourserver.com/expireLicense", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ licenseKey: licenseKey })
//     });
//   });


function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream;

            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 2048;
            visualizeAudio(analyser)

            recorder = new MediaRecorder(stream);
            const audioChunks = [];

            recorder.addEventListener('dataavailable', (event) => {
                audioChunks.push(event.data);
            });

            recorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                if (audioBlob.size > 0) { sendAudioData(audioBlob);}
                else {console.log("empty file, did not send")}
            });

            recorder.start();
            startBtn.disabled = true;
            stopBtn.disabled = false;
        })
        .catch(err => console.error(err));
}

function stopRecording() {
    recorder.stop();
    audioStream.getAudioTracks().forEach(track => track.stop());
    startBtn.disabled = false;
    stopBtn.disabled = true;
    if (audioContext) {
      // audioContext.close();
   }
}

function playAudio(url) {
    audio.src = url;
    audio.load();
    //audio.play();
    audio.controls = true;
    audio.classList.remove('hidden');

    // Créer une source audio à partir de l'élément audio
    const audioSrc = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    // Connecter la source audio à l'analyseur, puis à la destination (haut-parleurs)
    audioSrc.connect(analyser);
    analyser.connect(audioContext.destination);

    // Réutiliser le visualiseur avec un nouvel analyseur
    visualizeAudio(analyser);
}

async function uploadPitchDeck() {
    const formData = new FormData();
    const serverUrl = '/uploadPitchDeck'; // URL de votre serveur Express
    const pitchDeckInput = document.getElementById('pitchDeck');
    if (pitchDeckInput.files.length > 0) {
        formData.append('pitchDeck', pitchDeckInput.files[0]);
    try {
           const response = await fetch(serverUrl, { method: 'POST', body: formData });
           const result = await response.json();
           console.log("retour serveur ok")
           if (result.filePath) {
             console.log("Lance Audio Pitch Deck")
             playAudio(result.filePath);
          }
           } catch (error) {
           console.error('Erreur lors de l’envoi du fichier audio:', error);
       }
    } else {
        alert("Veuillez sélectionner un fichier PDF.");
    }
}


async function sendAudioData(audioBlob) { // Stockage du fichier audio et retour url
    const serverUrl = '/uploadAudio'; // URL de votre serveur Express
    const formData = new FormData();
    formData.append(name = 'audioFile', audioBlob, generateFileName());

    try {
           const response = await fetch(serverUrl, { method: 'POST', body: formData });
           const result = await response.json();
           if (result.filePath) {
              playAudio(result.filePath);
          }
           } catch (error) {
           console.error('Erreur lors de l’envoi du fichier audio:', error);
       }
}

function generateFileName() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const timestamp = date.getTime().toString();
    return `audio-${year}-${month}-${day}-${timestamp}.mp3`;
}

function visualizeAudio(analyser) {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        // Effacer le canvas
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        let sliceWidth = canvas.width * 1.0 / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            let v = dataArray[i] / 128.0;
            let y = v * canvas.height / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    draw();
}


startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
uploadBtn.addEventListener('click', uploadPitchDeck);
