const video = document.getElementById('js-webcam');
const canvas = document.getElementById('js-canvas');

// Store the resulting model in the global scope of our app.
let model = undefined;

cocoSsd.load().then((loadedModel) => {
    model = loadedModel;
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
    });
});

// constraint of webcam stream (only video not audio)
const constraints = {
    video: true,
    audio: false
}

showDetection = (predictions) => {
    const ctx = canvas.getContext("2d")
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "24px helvetica";

    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];
        // Draw the bounding box.
        ctx.strokeStyle = "#2fff00";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = "#2fff00";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10);
        // draw top left rectangle
        ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
        // draw bottom left rectangle
        ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(prediction.class, x, y);
        ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
}

predictWebcam = () => {
    // Now let's start classifying a frame in the stream.
    model.detect(video).then((predictions) => {

        // show all detections on canvas
        showDetection(predictions);

        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(predictWebcam);
    })
}