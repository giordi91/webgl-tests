

function Mouse(canvas, camera)
{
    var self= this;
    this.canvas = canvas;
    this.camera = camera;
    
    this.MOVE_BUTTON =4;
    this.ROTATE_BUTTON =1;
    this.ZOOM_BUTTON =2;
    this.mouse_down;

    
    this.init = function ()
    {
        
        //setting up the webgl window, mostly mouse triggers
        self.canvas.oncontextmenu = function () {return false;};
        self.canvas.onmousedown= function(e) { 
                                            self.camera.old_x = e.pageX;
                                            self.camera.old_y = e.pageY;
                                            self.mouse_down=true;};

        self.canvas.onmouseup = function() {self.mouse_down=false;};
        self.canvas.onmousemove = self.move_event;
    }
    
    this.move_event = function (e)
    {
        //we are going to evaluate only if we have the mouse down and we are moving
        if(self.mouse_down)
        {
            //just chekcing the mnove delta
            if (e.buttons== self.MOVE_BUTTON)
            {
                self.camera.move(e.pageX, e.pageY,true);
            }
            
            if (e.buttons == self.ROTATE_BUTTON)
            {
                self.camera.rotate(e.pageX, e.pageY,true);
            }

            if (e.buttons == self.ZOOM_BUTTON)
            {
                self.camera.zoom(e.pageX, e.pageY,true);
            }
            
            //updating stored coordinate for computing delta
            self.camera.old_x = e.pageX;
            self.camera.old_y = e.pageY;
        }
    }
}

function Touch(canvas, camera)
{
    var self= this;
    this.canvas = canvas;
    this.camera = camera;
    this.hammertime;
    this.init= function()
    {
        self.hammertime = new Hammer(canvas);
        self.hammertime.on('pan', self.swipe_event );
        self.hammertime.on('panstart', function()
                {
                    self.camera.old_x = 0;
                    self.camera.old_y = 0;
                } );
        self.hammertime.on('pinchstart',function()
                {
                    self.camera.old_x = 0;
                    self.camera.old_y = 0;
                } );
        self.hammertime.on('rotatestart',function()
                {
                    self.camera.old_x = 0;
                    self.camera.old_y = 0;
                } );
        self.hammertime.on('rotate', self.pinch_event);
        self.hammertime.on('pinchin', self.pan_event);
        self.hammertime.on('pinchout', self.pan_event);

        self.hammertime.get('rotate').set({ enable: true });
        self.hammertime.get('pinch').set({ enable: true, pointers: 3 });
    }
    
    this.swipe_event = function (e)
    {
        var le = length(vec2(e.deltaX-camera.old_x, e.deltaY - camera.old_y));
        if (le >30)
        {
            self.camera.old_x = e.deltaX;
            self.camera.old_y = e.deltaY;
            return;
        }
        self.camera.rotate(e.deltaX,e.deltaY, true);
        self.camera.old_x = e.deltaX;
        self.camera.old_y = e.deltaY;
    }
    
    this.pan_event =function (e)
    {
        self.camera.move(e.deltaX,e.deltaY,true);
        self.camera.old_x = e.deltaX;
        self.camera.old_y = e.deltaY;

    }
    
    this.pinch_event=  function (e)
    {
        if (Math.abs(e.rotation - self.camera.old_x) >10 || Math.abs(e.rotation - self.camera.old_y) >10)
        {
           return; 
        }
        self.camera.zoom(e.rotation,e.rotation,true);
        self.camera.old_x = e.rotation;
        self.camera.old_y = e.rotation;
        
    }
} 



function gamepad_input()
{
    //checking if the gamepad is avaliable
    gp = navigator.getGamepads();
    if (!gp || !gp[0])
    {return;}  
    
    //if it is let s use by default the first one 
    gp = gp[0];

    //pull the data needed
    var x,y,z1,z2,l,r,z;
    x = gp.axes[0];
    y = gp.axes[1];
    z1 = gp.axes[2];
    z2 = gp.axes[3];
    l = gp.buttons[6].pressed;
    r = gp.buttons[7].pressed;

    x = Math.abs(x) <0.2 ? x=0 : x;
    y = Math.abs(y) <0.2 ? y=0 : y;
    z1 = Math.abs(z1) <0.2 ? z1=0 : z1;
    z2 = Math.abs(z2) <0.2 ? z2=0 : z2;
    
     
    z=0; 
    if (l)
    {
        z=1;
    }
    else if(r)
    {
        z= -1;
    }
    
    if (z1 || z2)
    {
        camera.rotate(-z1*7, -z2*7,false);
    }
    
    if(x || y)
    { 
    camera.move(-x*10, -y*10,false);
    }
    if (z)
    {
        camera.zoom(z*3,z*3,false);
    }
}

