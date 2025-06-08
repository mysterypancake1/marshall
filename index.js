// Get canvas and file input elements
const canvas = document.getElementById('proofCanvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('screenshotInput');
const downloadBtn = document.getElementById('downloadBtn');

// Load all static images
const images = {
    whiteBg: new Image(),
    background: new Image(),
    headerFooter: new Image(),
    doneMark: new Image(),
    watermark: new Image()
};

images.whiteBg.src = 'white bg.jpeg';
images.background.src = 'BG.JPG';
images.headerFooter.src = 'LOGO.PNG';
images.doneMark.src = 'DONE.PNG';
images.watermark.src = 'watermark.png';

// Handle file upload
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const screenshot = new Image();
            screenshot.onload = function() {
                generateProof(screenshot);
            };
            screenshot.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Draw screenshot with rounded corners
function drawRoundedScreenshot(screenshot, x, y, width, height, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(screenshot, x, y, width, height);
    ctx.restore();
}

// Generate the proof image
function generateProof(screenshot) {
    // Set maximum dimensions
    const maxWidth = 800;
    const maxHeight = 800;

    // Calculate scale based on maximum dimensions
    let scale = 1;
    if (screenshot.width > maxWidth || screenshot.height > maxHeight) {
        scale = Math.min(
            maxWidth / screenshot.width,
            maxHeight / screenshot.height
        );
    }

    // Calculate final dimensions
    const scaledWidth = screenshot.width * scale;
    const scaledHeight = screenshot.height * scale;

    // Center the screenshot
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw white background first
    ctx.drawImage(images.whiteBg, 0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);

    // Draw screenshot with rounded corners
    drawRoundedScreenshot(screenshot, x, y, scaledWidth, scaledHeight, 40);

    // Draw watermark
    ctx.drawImage(images.watermark, 0, 0, canvas.width, canvas.height);

    // Draw done mark above all layers
    const doneMarkHeight = canvas.height * 0.90;
    const gap = -1200;
    const doneMarkAspectRatio = images.doneMark.width / images.doneMark.height;
    const doneMarkWidth = doneMarkHeight * doneMarkAspectRatio;
    const doneMarkX = (canvas.width - doneMarkWidth) / 2;
    ctx.drawImage(images.doneMark, doneMarkX, y - doneMarkHeight - gap, doneMarkWidth, doneMarkHeight);

    // Draw header and footer as the final layer
    ctx.drawImage(images.headerFooter, 0, 0, canvas.width, canvas.height);

    // Show download button
    downloadBtn.style.display = 'block';
}

// Handle download
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'proof.jpg';
    link.href = canvas.toDataURL('image/jpg');
    link.click();
});
