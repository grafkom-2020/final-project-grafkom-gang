
function listenTo(dom){
    console.log("added keyboard listener");
    dom.addEventListener('keydown', keyDown);
    dom.addEventListener('keyup', keyUp);
    dom.addEventListener('mousemove', mouseMove);
    dom.addEventListener('mousedown', mouseDown);
    dom.addEventListener('mouseup', mouseUp);
}

var keyboardInput = {};
var keyboardInputPast = {};

var mouseInput = {};
var mouseInputPast = {};

var mouseDeltaX = 0;
var mouseDeltaY = 0;

function addKeyToListen(eventCode){
    keyboardInput[eventCode] = false;
    keyboardInputPast[eventCode] = false;
}

function addMouseButtonToListen(mouseButton){
    mouseInput[mouseButton] = false;
    mouseInputPast[mouseButton] = false;
}

function keyDown(event){
    if(event.code in keyboardInput){
        keyboardInput[event.code] = true;
    }
}

function keyUp(event){
    if(event.code in keyboardInput){
        keyboardInput[event.code] = false;
    }
}

function mouseMove(event){
    mouseDeltaX += event.movementX;
    mouseDeltaY += event.movementY;
}

function mouseDown(event){
    if(event.button in mouseInput){
        mouseInput[event.button] = true;
    }
}

function mouseUp(event){
    if(event.button in mouseInput){
        mouseInput[event.button] = false;
    }
}

function refreshInput(){
    for(x in keyboardInput){
        keyboardInputPast[x] = keyboardInput[x];
    }
    for(x in mouseInput){
        mouseInputPast[x] = mouseInput[x];
    }
    mouseDeltaX = 0;
    mouseDeltaY = 0;
}

function isButtonDown(mouseButton){
    if(mouseButton in mouseInput){
        return !mouseInputPast[eventCode] && mouseInput[eventCode];
    }
    return false;
}

function isButton(mouseButton){
    if(mouseButton in mouseInput){
        return mouseInput[eventCode];
    }
    return false;
}

function isButtonUp(mouseButton){
    if(mouseButton in mouseInput){
        return mouseInputPast[eventCode] && !mouseInput[eventCode];
    }
    return false;
}

function isKeyDown(eventCode){
    if(eventCode in keyboardInput){
        return !keyboardInputPast[eventCode] && keyboardInput[eventCode];
    }
    return false;
}

function isKey(eventCode){
    if(eventCode in keyboardInput){
        return keyboardInput[eventCode];
    }
    return false;
}

function isKeyUp(eventCode){
    if(eventCode in keyboardInput){
        return keyboardInputPast[eventCode] && !keyboardInput[eventCode];
    }
    return false;
}
