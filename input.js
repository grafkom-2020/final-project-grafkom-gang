
function listenTo(dom){
    console.log("added keyboard listener");
    dom.addEventListener('keydown', keyDown);
    dom.addEventListener('keyup', keyUp);
}

var keyboardInput = {};
var keyboardInputPast = {};

function addKeyToListen(eventCode){
    keyboardInput[eventCode] = false;
    keyboardInputPast[eventCode] = false;
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

function refreshInput(){
    for(x in keyboardInput){
        keyboardInputPast[x] = keyboardInput[x];
    }
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
