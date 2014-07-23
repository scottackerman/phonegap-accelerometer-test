// REFERENCE CURRENT 'watchAcceleration'
var accelerometerInstance = null;
var $width;
var $height;
var $ball;
var $autoBall;
var $debug;
var xAccel;
var yAccel;
var xPositive = false;
var yPositive = false;
var leftVal;
var topVal;
var currentLeft;
var currentTop;
var newTop;
var newLeft;
var regexPattern = /[0-9]+/;
var updateSpeed = 5;
var accelerationOffset = 30;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    $ball = $('#sobriety');
    $autoBall = $('#test');
    $debug = document.getElementById('debug');
    $width = $(window).width() - $ball.width();
    $height = $(window).height() - $ball.width();
    // CENTER BALL INITIALLY
    $ball.css({'left' : $width/2, 'top' : $height/2});
    startTrackingAccelerometer();
}

function startTrackingAccelerometer() {
    $autoBall.css({'left' : '100px', 'top' : '100px'});
    var options = { frequency: updateSpeed };
    accelerometerInstance = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}

function stopTrackingAccelerometer() {
    if (accelerometerInstance) {
        navigator.accelerometer.clearWatch(accelerometerInstance);
        accelerometerInstance = null;
    }
}

function onSuccess(acceleration) {
    moveBallWithAccelerometer(acceleration);
}

function onError() {
    alert('onError!');
}

function moveBallWithAccelerometer(acceleration) {
    // ACCELEROMETER RETURNS VALUES FROM -1 thru 1, BASED ON 90 DEGREE ROTATIONS
    // TURNING FACE OF PHONE LEFT/RIGHT = acceleration.x
    // TURNING FACE OF PHONE TOP/BOTTOM = acceleration.y
    // MOVING FACE OF PHONE TOWARD/AWAY = acceleration.z
    currentLeft = $ball.css('left');
    currentTop = $ball.css('top');
    leftVal = parseInt(currentLeft.match(regexPattern));
    topVal = parseInt(currentTop.match(regexPattern));
    xAccel = acceleration.x * accelerationOffset;
    yAccel = acceleration.y * accelerationOffset * -1;
    newLeft = leftVal + xAccel;
    newTop = topVal + yAccel;
    xPositive = checkPositivePositionBoolean(xAccel, xPositive);
    yPositive = checkPositivePositionBoolean(yAccel, yPositive);
    newLeft = stopBallAtEdge(xPositive, newLeft, $width);
    newTop = stopBallAtEdge(yPositive, newTop, $height);
    $ball.css({'left' : newLeft, 'top' : newTop});
    debug();
}

function checkPositivePositionBoolean(direction, bool) {
    if(direction >= 0){
        bool = true;
    }else {
        bool = false;
    }
    return bool;
}

function stopBallAtEdge(bool, newPosition, max){
    if(bool && newPosition >= max){
        newPosition = max;
        //stopTrackingAccelerometer();
    }else if(!bool && newPosition <= 0){
        newPosition = 0;
        //stopTrackingAccelerometer();
    }
    return newPosition;
}

function debug() {
    $debug.innerHTML = 'xAccel: ' + xAccel + '<br />'
    + 'yAccel: ' + yAccel + '<br />'
    + 'xPositive: ' + xPositive + '<br />'
    + 'yPositive: ' + yPositive;
}