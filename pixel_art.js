
// PIXEL ART v0.6 - Ok, I'm done with it (i.e. it ain't done, i'm done)

// Needed improvements
    // 1. drawing needs to stop (drawing = false) when mouse goes outside of the canvas    prevents inadvertant drawing/erasing
    // 2. erase on click. need to choose white to 'erase'. this should be handled with clearRect, but it ain't.
    // 3. touch handlers -- too hard to wrap my head around. should have been a thought from the start.

// Good things:
    // 1. All pixels are stored in an array (except white... see why above). Pixels are removed from array when deleted. There are no duplicates in array.
        // could be used to save images
        // redraw after other functions have completed
    // 2. I learned some things about canvas. yay.
    

window.addEventListener('load', () => {

    // class of pixel defines the top left of the pixel
     class Pixel {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
        }
    }

    let pixels = [];

    /******     CANVAS      ******/
    
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    // used to offset from clientX and clientY
    let canvasBlock = canvas.getBoundingClientRect();
    let offsetX = canvasBlock.left;
    let offsetY = canvasBlock.top;

    // calls functions from drawing below
    canvas.addEventListener('click', getPixelInfo);

    /***     DRAWING THE GRID       ***/

    let gridSize = 450;
    canvas.width = gridSize;
    canvas.height = gridSize;
    let squareSize = 25;
    
    // changed to true in drawGrid() on load
    let gridOn = false;   
    
    // grid toggle
    const gridToggle = document.querySelector('.gridToggle');
    gridToggle.addEventListener('click', function() {
        drawGrid();
    });

    // draw the grid
    function drawGrid() {
        gridOn ? gridOn = false : gridOn = true;
        pageLoaded = true;
        drawGridLines(squareSize, squareSize);
    };

    // grid: draw vertical grid lines
    function drawGridLines (x, y) {
        if (gridOn) {
            gridLineColor = 'darkgray';
        } else {
            gridLineColor = "white";
        }
        while (x < gridSize) {
            ctx.beginPath()
            // offset - https://stackoverflow.com/questions/48970578/html-canvas-rectangle-stroke-appears-transparent
            ctx.moveTo(`${x}.5`, 0);
            ctx.lineTo(`${x}.5`, gridSize);
            ctx.strokeStyle = gridLineColor;
            ctx.lineCap = 'round';
            ctx.stroke()
            x += squareSize;
        }
        while (y < gridSize) {
            ctx.beginPath()
            ctx.moveTo(0, `${y}.5`);
            ctx.lineTo(gridSize, `${y}.5`);
            ctx.strokeStyle = gridLineColor;
            ctx.lineCap = 'round';
            ctx.stroke()
            y += squareSize;
        }
    }

    /***        DRAWING     ***/

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    let drawing = false;
    function startDrawing(e) {
        drawing = true;
    }
    function draw(e) {
        if(drawing) getPixelInfo(e);
    }
    function stopDrawing(e) {
        drawing = false;
    }

    function getPixelInfo(e) {

        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;
        let x = left - (left % squareSize);
        let y = top - (top % squareSize);
        let color = pixelColor;
        
        // check if exist - set fill style based on this - skips if the pixel exists
        let duplicates = pixels.filter(pixel => pixel.x == x && pixel.y == y && pixel.color == color);
        if (duplicates.length > 0) return;
        // if pixel exists but a different color and not white
        let pixelHasBeenDrawn = pixels.filter(pixel=> pixel.x == x && pixel.y == y && pixel.color != color);
        if (pixelHasBeenDrawn.length > 0) {
        
            // 'logic' for erasing with color = white
            if (color === 'white') {
                let i = pixels.indexOf(pixelHasBeenDrawn[0]);
                pixels.splice(i, 1);
                drawPixel(x, y, color);
                return;
            } else {
                let i = pixels.indexOf(pixelHasBeenDrawn[0]);
                pixels.splice(i, 1);
            }
            
            const pixel = new Pixel(x, y, color);
            pixels.push(pixel);
            drawPixel(x, y, color);
            
        } else if (color !== 'white') {
            const pixel = new Pixel(x, y, color);
            pixels.push(pixel);
            drawPixel(x, y, color);
        }
    }
    
    function drawPixel(x, y, color) {
        ctx.fillStyle = color;
        if (makeShapeButton.textContent == 'break') {
            ctx.fillRect(x + 1, y + 1, squareSize, squareSize);
        } else {
            ctx.fillRect(x + 1, y + 1, squareSize - 1 , squareSize - 1);
        }
    }


    /*****      COLORS      ******/

    // default pixel color
    let pixelColor = 'black';
    
    //get all color swatches
    const color_buttons = document.querySelectorAll('.color_button');

    // get individual color swatches
    const pink = document.querySelector('.pink');
    const red = document.querySelector('.red');
    const yellow = document.querySelector('.yellow');
    const green = document.querySelector('.green');
    const blue = document.querySelector('.blue');
    const purple = document.querySelector('.purple');
    const darkgreen = document.querySelector('.darkgreen');
    const gray = document.querySelector('.gray');
    const brown = document.querySelector('.brown');
    const black = document.querySelector('.black');
    const orange = document.querySelector('.orange');
    const white = document.querySelector('.white');

    // color handlers
    pink.addEventListener('click', chooseColor);
    red.addEventListener('click', chooseColor);
    yellow.addEventListener('click', chooseColor);
    green.addEventListener('click', chooseColor);
    blue.addEventListener('click', chooseColor);
    purple.addEventListener('click', chooseColor);
    darkgreen.addEventListener('click', chooseColor);
    gray.addEventListener('click', chooseColor);
    brown.addEventListener('click', chooseColor);
    black.addEventListener('click', chooseColor);
    orange.addEventListener('click', chooseColor);
    white.addEventListener('click', chooseColor);

    // Custom Color Swatches - handled differently. 

    const customColor1 = document.querySelector(`[name='customColor1']`);
    const customButton1 = document.querySelector(`[name='customButton1']`);
    const customColor2 = document.querySelector(`[name='customColor2']`);
    const customButton2 = document.querySelector(`[name='customButton2']`);
    const customColor3 = document.querySelector(`[name='customColor3']`);
    const customButton3 = document.querySelector(`[name='customButton3']`);
    
    customColor1.addEventListener('input', updateCustomColor);
    customColor1.addEventListener('change', chooseColor);
    customColor1.addEventListener('click', chooseColor);
    customColor2.addEventListener('input', updateCustomColor);
    customColor2.addEventListener('change', chooseColor);
    customColor2.addEventListener('click', chooseColor);
    customColor3.addEventListener('input', updateCustomColor);
    customColor3.addEventListener('change', chooseColor);
    customColor3.addEventListener('click', chooseColor);

    function updateCustomColor() {
            customButton1.setAttribute('button-color', customColor1.value);
            customButton2.setAttribute('button-color', customColor2.value);
            customButton3.setAttribute('button-color', customColor3.value);
    }
    
    // determine color of next pixel to be drawn
    // customColor logic may be hard to follow. The customColor swatches are input elements wrapped in a button tag. Maybe not the idea, but it is what it is.
    function chooseColor(e) {
        if (e.target === customColor1 || e.target === customColor2 || e.target === customColor3) {
            updateCustomColor();
            pixelColor = this.parentElement.getAttribute('button-color');
        } else {
            pixelColor = this.getAttribute('button-color');
        }
        color_buttons.forEach(function(color_button) {
            if(color_button.hasAttribute('class', 'button_selected')) {
                color_button.classList.remove('button_selected');
            }
        });
        if (e.target === customColor1 || e.target === customColor2 || e.target === customColor3) {
            this.parentElement.classList.add('button_selected');
        } else {
            this.classList.add('button_selected');
        }
    }

    /*****      FILL      ******/

    const fillButton = document.querySelector('.fillButton');
    fillButton.addEventListener('click', fillGridWithSelectedColor);

    function fillGridWithSelectedColor() {
        if(!clearCanvas()) return;
        let x = 0; 
        let y = 0;
        while ( y < canvas.height) {
            ctx.fillStyle = pixelColor;
            // ctx.fillRect(x, y, squareSize - 1, squareSize - 1);
            // const pixel = new Pixel(x, y, pixelColor);
            // pixels.push(pixel);
            while (x < canvas.width) {
                ctx.fillRect(x + 1, y + 1, squareSize - 1, squareSize - 1);
                const pixel = new Pixel(x, y, pixelColor);
                pixels.push(pixel);
                x += squareSize;
            }
            y += squareSize;
            x = 0;
        }
        if (pixelColor === "white") {
            pixels = [];
        }
    }

    /*****      CLEARING    ******/
    
    const clearButton = document.querySelector('.clearCanvas');
    clearButton.addEventListener('click', clearCanvas);

    // CLEARS CANVAS and DELETES PIXEL ARRAY
    function clearCanvas(e) {

        let clearConfirm;
        e ? clearConfirm = confirm('Are you sure you want to clear the canvas? Your drawing will be lost (sorry).') : clearConfirm = confirm('This fill action will erase the canvas and fill with selected color. Do you wish to continue?');

        if (clearConfirm) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pixels = [];
            gridOn = false;
            drawGrid();
        }
        return clearConfirm;
    }

    // CLEAR WHITE SQUARES - I DON'T KNOW WHAT TO DO WITH EM!
    function clearWhiteSquaresFromCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gridOn = false;
    }

    /*****      MAKING/JOINING    ******/

    const makeShapeButton = document.querySelector('.makeShapeButton');
    makeShapeButton.addEventListener('click', makeShape);
    
    function makeShape() {
        let makeButtonValue = makeShapeButton.textContent;
        drawGrid();
        if (makeButtonValue === "join") {
            pixels.forEach(function(pixel) {
                ctx.fillStyle = pixel.color;
                ctx.fillRect(pixel.x + 1, pixel.y + 1, squareSize, squareSize);
                makeButtonValue = "break";
                makeShapeButton.textContent = makeButtonValue;
            })
        } else {
            unMakeShape();
        }
    }
    function unMakeShape() {
        clearWhiteSquaresFromCanvas();
        pixels.forEach(function(pixel) {
            ctx.fillStyle = "white";
            // fill rect - offset to account for bordersize (hardcoded here)
            ctx.fillRect(pixel.x, pixel.y, squareSize, squareSize);
        })
        gridOn = false;
        pixels.forEach(function(pixel) {
            ctx.fillStyle = pixel.color;
            // fill rect - offset to account for bordersize (hardcoded here)
            ctx.fillRect(pixel.x +1 , pixel.y +1 , squareSize -1 , squareSize - 1);
        })
        drawGrid();
        makeButtonValue = "join";
        makeShapeButton.textContent = makeButtonValue;
    }
    
    /***        UNDO (i.e. removes last non-white painted pixel)      ***/
    
    const undoButton = document.querySelector('.undoButton');
    undoButton.addEventListener('click', removeLastPixelDrawn); 
    // undoButton.addEventListener('mousedown', removeLastPixelDrawn); 
    
    function removeLastPixelDrawn(e) {
        if (!gridOn) drawGrid();
        const last = pixels.pop();
        if (last) {
            let lastX = last.x;
            let lastY = last.y;
            let color = 'white';
            drawPixel(lastX, lastY, color);
        } else {
            alert("Nothing left to undo.");
        }
    }


    /***        SAVE / DOWNLOAD      ***/
    // Download as png --- update later to give user ability to specify name before download
    // ADD SVG OPTION

    const saveButton = document.querySelector('.saveButton');
    const downloadPH = document.querySelector('.downloadPH');

    saveButton.addEventListener('click', function(e) {
        // currently opens in new tab -- workaround for now
        downloadPH.setAttribute('href', canvas.toDataURL());
        downloadPH.setAttribute('download', "mypainting.png");
    });

    /***        UPDATE WINDOW COORDINATES        ***/

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', resize);

    function resize() {
        // used to offset from clientX and clientY
        canvasBlock = canvas.getBoundingClientRect();
        offsetX = canvasBlock.left;
        offsetY = canvasBlock.top;
    }

    // grid drawn on load
    drawGrid();
    // resize needs to be called on window load so that the proper offsets are set on load
    resize();
});