
function camera_move( x,y)
{
    var aim = subtract(lookAtPos, camPos);
    var dx = camera.old_x - x;
    var dy = camera.old_y - y;
    var factor = length(aim);

    var dir = normalize(cross(aim,vec3(0,1,0)));
    var newup = normalize(cross(dir,aim));

    var offset = scale(factor,(add(scale(dx, dir ), scale(-dy, newup))));
    offset = scale(camera.MOVEMENT_SPEED, offset);
    if (length(offset) > 100)
    {
        return;
    }
    camPos = add(camPos,offset);
    lookAtPos = add(lookAtPos,offset);
    
}
       
function camera_rotate(x,y)
{
    var dx = camera.old_x - x;
    var dy = camera.old_y - y;
    //removing pivot offset from camera and rotate from origin
    var tempPos = subtract(camPos, lookAtPos);
    
    //y rot
    var rotMat = rotate( -dx*camera.ROTATION_SPEED, vec3(0,1,0));
    var tempPosM = mat4();
    tempPosM[3][0] = tempPos[0];
    tempPosM[3][1] = tempPos[1];
    tempPosM[3][2] = tempPos[2];
    var res = mult(tempPosM,rotMat);
    //rotation on x axis
    tempPos = vec3(res[3][0],res[3][1],res[3][2])
    var xVec = normalize(cross(vec3(0,1,0),tempPos));
    rotMat = rotate(-dy*camera.ROTATION_SPEED, vec3(xVec[0],xVec[1],xVec[2]));
    res = mult(res,rotMat);
    
    camPos = add(vec3(res[3][0],res[3][1],res[3][2]) ,lookAtPos);
}

function camera_zoom(x,y)
{
    var dx = camera.old_x - x;
    var dy = camera.old_y - y;

    var zoom_dir = subtract(camPos, lookAtPos);
    var value = scale(camera.MOVEMENT_SPEED, zoom_dir);
    //in order to not limit the scale on one axis we get the axis with max displacement
    //in absolute value;Need to chec if there is a condiction similar to c++ like conidiont ? val : val 
    if (Math.abs(dx) > Math.abs(dy))
    {
        var delta = dx;
    }
    else
    {
        var delta = dy;
    }
    //scaling the zoom by the amount from the mouse
    value = scale(delta,value);
    //updating mouse positon
    camPos = add(value,camPos);  
}

function Camera()
{
    var camera = {};
    camera.camera_zoom = camera_zoom;
    camera.camera_rotate = camera_rotate;
    camera.camera_move = camera_move;
    camera.old_x = 0;
    camera.old_y = 0;
    
    //those two should be constant, probalby I shoudl have a getter 
    //and no setter for this, but for now I leave it like this
    camera.MOVEMENT_SPEED = 0.0005;
    camera.ROTATION_SPEED = 0.1;
    return camera;


}
