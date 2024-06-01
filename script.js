
const video = document.getElementById("video");
const canvas = document.body.appendChild(document.createElement("canvas"));
const ctx = canvas.getContext("2d");
let displaySize;

let width = 640;
let height = 480;

const startStream = () => {
    console.log('-----start stream-----')
    navigator.mediaDevices.getUserMedia({
        video:{width,height},
        audio:false
}).then((stream) => {video.srcObject = stream});

}
// Expression Untuk mengaktifkan kamera

console.log(faceapi.nets);
// Memastikan apakah data face apinya ada atau tidak

console.log('-----start load-----')
Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startStream);

// Load dulu semua data dari models baru di jalankan function kameranya

async function detect() {
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks()
                                                          .withFaceExpressions()
                                                          .withAgeAndGender();
    console.log(detections);

    ctx.clearRect(0,0, width, height);
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // draw detections into the canvas
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);


    console.log(resizedDetections);
    resizedDetections.forEach(result =>{
        const {age, gender, genderProbability} = result;
        new faceapi.draw.DrawTextField([
            `${Math.round(age,0)} Tahun`,
            `${gender} ${Math.round(genderProbability)}`
        ], 
        result.detection.box.bottomRight).draw(canvas);
    });
}

video.addEventListener('play', () => {
    displaySize = {width, height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(detect, 100);
})




// startStream();