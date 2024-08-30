const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 60;

let drawing = false;
let mode = 'pen';
let startX, startY;

function setMode(newMode) {
    mode = newMode;
}

function startDrawing(e) {
    drawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!drawing) return;

    if (mode === 'pen') {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (mode === 'eraser') {
        ctx.lineWidth = 20;
        ctx.strokeStyle = '#fff';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (mode === 'rectangle' || mode === 'circle') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        if (mode === 'rectangle') {
            ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
        } else if (mode === 'circle') {
            const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        }
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function endDrawing() {
    if (mode === 'pen' || mode === 'eraser') {
        ctx.beginPath();
    }
    drawing = false;
}

document.getElementById('pen').addEventListener('click', () => setMode('pen'));
document.getElementById('eraser').addEventListener('click', () => setMode('eraser'));
document.getElementById('rectangle').addEventListener('click', () => setMode('rectangle'));
document.getElementById('circle').addEventListener('click', () => setMode('circle'));

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);
