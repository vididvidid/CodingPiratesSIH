const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 60;

let mode = 'pen';
let drawing = false;
let elements = []; // To store all drawn elements
let startX, startY;
let dragIndex = null; // To track which element is being dragged

function setMode(newMode) {
    mode = newMode;
}

function startDrawing(e) {
    [startX, startY] = [e.offsetX, e.offsetY];

    // Check if we are clicking on an existing element
    dragIndex = getElementAtPosition(startX, startY);
    if (dragIndex !== null) {
        // If an element is clicked, we don't start drawing
        drawing = false;
    } else if (mode !== 'text') {
        drawing = true;
    }

    if (mode === 'text') {
        addTextInput(e.offsetX, e.offsetY);
    }
}

function draw(e) {
    if (!drawing) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawElements(); // Redraw previous elements

    if (mode === 'pen') {
        drawPen(e);
    } else if (mode === 'eraser') {
        drawEraser(e);
    } else if (mode === 'rectangle') {
        drawRectangle(e);
    } else if (mode === 'circle') {
        drawCircle(e);
    } else if (mode === 'arrow') {
        drawArrow(e);
    }
}

function endDrawing(e) {
    if (drawing && mode !== 'text') {
        if (mode === 'rectangle') {
            addRectangle(e);
        } else if (mode === 'circle') {
            addCircle(e);
        } else if (mode === 'arrow') {
            addArrow(e);
        }
    }
    ctx.beginPath();
    drawing = false;
}

function drawPen(e) {
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.moveTo(e.offsetX, e.offsetY); // Update the path with the current position
}

function drawEraser(e) {
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#fff';
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function drawRectangle(e) {
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function addRectangle(e) {
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    const rect = {
        type: 'rectangle',
        x: startX,
        y: startY,
        width: width,
        height: height,
        color: document.getElementById('colorPicker').value,
    };
    elements.push(rect);
}

function drawCircle(e) {
    const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function addCircle(e) {
    const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
    const circle = {
        type: 'circle',
        x: startX,
        y: startY,
        radius: radius,
        color: document.getElementById('colorPicker').value,
    };
    elements.push(circle);
}

function drawArrow(e) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    const angle = Math.atan2(e.offsetY - startY, e.offsetX - startX);
    const headLength = 15;
    ctx.lineTo(e.offsetX - headLength * Math.cos(angle - Math.PI / 6), e.offsetY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.lineTo(e.offsetX - headLength * Math.cos(angle + Math.PI / 6), e.offsetY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    ctx.lineWidth = 2;
    ctx.stroke();
}




 



function addArrow(e) {
    const arrow = {
        type: 'arrow',
        startX: startX,
        startY: startY,
        endX: e.offsetX,
        endY: e.offsetY,
        color: document.getElementById('colorPicker').value,
    };
    elements.push(arrow);
}

function addTextInput(x, y) {
    let textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.style.position = 'absolute';
    textInput.style.left = `${x + canvas.offsetLeft}px`;
    textInput.style.top = `${y + canvas.offsetTop}px`;
    textInput.style.fontSize = '20px';
    textInput.style.border = '1px solid #000';
    textInput.style.outline = 'none';

    textInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            drawText(textInput.value, x, y);
            document.body.removeChild(textInput);
        }
    });

    document.body.appendChild(textInput);
    textInput.focus();
}

function drawText(text, x, y) {
    ctx.font = '20px Arial';
    ctx.fillStyle = document.getElementById('colorPicker').value;
    ctx.fillText(text, x, y);
    elements.push({ type: 'text', text, x, y, color: ctx.fillStyle });
}

function redrawElements() {
    elements.forEach(element => {
        if (element.type === 'rectangle') {
            ctx.beginPath();
            ctx.rect(element.x, element.y, element.width, element.height);
            ctx.strokeStyle = element.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (element.type === 'circle') {
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
            ctx.strokeStyle = element.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (element.type === 'arrow') {
            ctx.beginPath();
            ctx.moveTo(element.startX, element.startY);
            ctx.lineTo(element.endX, element.endY);
            const angle = Math.atan2(element.endY - element.startY, element.endX - element.startX);
            const headLength = 15;
            ctx.lineTo(element.endX - headLength * Math.cos(angle - Math.PI / 6), element.endY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(element.endX, element.endY);
            ctx.lineTo(element.endX - headLength * Math.cos(angle + Math.PI / 6), element.endY - headLength * Math.sin(angle + Math.PI / 6));
            ctx.strokeStyle = element.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }else if (element.type === 'text') {
                    ctx.font = '20px Arial';
                    ctx.fillStyle = element.color;
                    ctx.fillText(element.text, element.x, element.y);
                }
            });
        }

        function getElementAtPosition(x, y) {
            for (let i = elements.length - 1; i >= 0; i--) {
                const element = elements[i];
                if (element.type === 'rectangle') {
                    if (x >= element.x && x <= element.x + element.width &&
                        y >= element.y && y <= element.y + element.height) {
                        return i;
                    }
                } else if (element.type === 'circle') {
                    const distance = Math.sqrt(Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2));
                    if (distance <= element.radius) {
                        return i;
                    }
                } else if (element.type === 'arrow') {
                    // You can implement more precise detection for arrows
                    if (x >= Math.min(element.startX, element.endX) &&
                        x <= Math.max(element.startX, element.endX) &&
                        y >= Math.min(element.startY, element.endY) &&
                        y <= Math.max(element.startY, element.endY)) {
                        return i;
                    }
                } else if (element.type === 'text') {
                    // Assuming text is a small box around its coordinates
                    const textWidth = ctx.measureText(element.text).width;
                    const textHeight = 20; // Assume 20px height for text
                    if (x >= element.x && x <= element.x + textWidth &&
                        y >= element.y - textHeight && y <= element.y) {
                        return i;
                    }
                }
            }
            return null;
        }

        function startDrag(e) {
            if (dragIndex !== null) {
                const element = elements[dragIndex];
                const offsetX = e.offsetX - startX;
                const offsetY = e.offsetY - startY;

                if (element.type === 'rectangle') {
                    element.x += offsetX;
                    element.y += offsetY;
                } else if (element.type === 'circle') {
                    element.x += offsetX;
                    element.y += offsetY;
                } else if (element.type === 'arrow') {
                    element.startX += offsetX;
                    element.startY += offsetY;
                    element.endX += offsetX;
                    element.endY += offsetY;
                } else if (element.type === 'text') {
                    element.x += offsetX;
                    element.y += offsetY;
                }

                startX = e.offsetX;
                startY = e.offsetY;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                redrawElements();
            }
        }

        function endDrag() {
            dragIndex = null;
        }
     
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDrawing);

        canvas.addEventListener('mousemove', startDrag);
        canvas.addEventListener('mouseup', endDrag);

        document.getElementById('pen').addEventListener('click', () => setMode('pen'));
        document.getElementById('eraser').addEventListener('click', () => setMode('eraser'));
        document.getElementById('rectangle').addEventListener('click', () => setMode('rectangle'));
        document.getElementById('circle').addEventListener('click', () => setMode('circle'));
        document.getElementById('arrow').addEventListener('click', () => setMode('arrow'));
        document.getElementById('text').addEventListener('click', () => setMode('text'));