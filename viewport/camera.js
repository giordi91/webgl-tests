


function Camera(width, height)
{
    var self= this;
    
    //those two should be constant, probalby I shoudl have a getter 
    //and no setter for this, but for now I leave it like this
    this.PAN_SPEED = 0.0005;
    this.ZOOM_SPEED = 0.01;
    this.ROTATION_SPEED = 0.4;
    
    //Camera placement variables 
    this.eye = vec3(350,150,350);
    this.pivot= vec3(0,100,0);
    //old camera position
    this.old_x = 0;
    this.old_y = 0;
    
    //camera lens and viewport settings
    this.viewport_width = width;
    this.viewport_height= height;
    this.near_plane = 0.1;
    this.far_plane = 10000;
    this.fov = 30;
    
    ///////////////////////////////////////////////////////////
    //// FUNCTIONS
    ////////////////////////////////////////////////////////// 
    this.zoom = function (x,y)
    {
        var dx = self.old_x - x;
        var dy = self.old_y - y;

        var zoom_dir = subtract(self.eye, self.pivot);
        var value = scale(self.ZOOM_SPEED, zoom_dir);
        //in order to not limit the scale on one axis we get the axis with max displacement
        //in absolute value;
        delta =  (Math.abs(dx) > Math.abs(dy)) ? dx : dy;
        //scaling the zoom by the amount from the mouse
        value = scale(delta,value);
        //updating mouse positon
        self.eye = add(value,self.eye);  
    }
    
    this.rotate = function (x,y)
    {
        var dx = self.old_x - x;
        var dy = self.old_y - y;
        //removing pivot offset from camera and rotate from origin
        var tempPos = subtract(self.eye, self.pivot);
        
        //y rot
        var rotMat = rotate( -dx*self.ROTATION_SPEED, vec3(0,1,0));
        var tempPosM = mat4();
        tempPosM[3][0] = tempPos[0];
        tempPosM[3][1] = tempPos[1];
        tempPosM[3][2] = tempPos[2];
        var res = mult(tempPosM,rotMat);
        //rotation on x axis
        tempPos = vec3(res[3][0],res[3][1],res[3][2])
        var xVec = normalize(cross(vec3(0,1,0),tempPos));
        rotMat = rotate(-dy*self.ROTATION_SPEED, vec3(xVec[0],xVec[1],xVec[2]));
        res = mult(res,rotMat);
        
        self.eye = add(vec3(res[3][0],res[3][1],res[3][2]) ,self.pivot);
    }
    
    this.move = function ( x,y)
    {
        var aim = subtract(self.pivot, self.eye);
        var dx = self.old_x - x;
        var dy = self.old_y - y;
        var factor = length(aim);

        var dir = normalize(cross(aim,vec3(0,1,0)));
        var newup = normalize(cross(dir,aim));

        var offset = scale(factor,(add(scale(dx, dir ), scale(-dy, newup))));
        offset = scale(self.PAN_SPEED, offset);
        if (length(offset) > 100)
        {
            return;
        }
        self.eye = add(self.eye,offset);
        self.pivot = add(self.pivot,offset);
    }

    this.projection_matrix = function()
    {
        return perspective(this.fov, 
                            this.viewport_width/this.viewport_height, 
                            this.near_plane, 
                            this.far_plane);
    }

    this.model_view_matrix = function()
    {
        return lookAt(this.eye, this.pivot, vec3(0,1,0));
    }

    this.normal_matrix = function()
    {
        var mv = this.model_view_matrix();
        var nm = mat3();
        for(r=0; r<3;r++)
        {
            for (c=0; c<3;c++)
            {
                nm[r][c] = mv[r][c];
            }
        }
        return nm;
    }

}
