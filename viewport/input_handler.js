

function Mouse(canvas, camera)
{
    var self= this;
    this.canvas = canvas;
    this.camera = camera;
    
    this.MOVE_BUTTON =4;
    this.ROTATE_BUTTON =1;
    this.ZOOM_BUTTON =2;
    //this.mouse_down;

    
    this.init = function ()
    {
        
        //setting up the webgl window, mostly mouse triggers
        self.canvas.oncontextmenu = function () {return false;};
        self.canvas.onmousedown= function(e) { 
                                            self.camera.old_x = e.pageX;
                                            self.camera.old_y = e.pageY;
                                        mouse_down=true;};
        self.canvas.onmouseup = function() {mouse_down=false;};
        self.canvas.onmousemove = self.move_event;
    }
    
    this.move_event = function (e)
    {
        //we are going to evaluate only if we have the mouse down and we are moving
        if(mouse_down)
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
        self.hammertime.on('pan', swipe_event );
        self.hammertime.on('panstart', function()
                {
                    mouse_down = true;
                    camera.old_x = 0;
                    camera.old_y = 0;
                } );
        self.hammertime.on('pinchstart',function()
                {
                    camera.old_x = 0;
                    camera.old_y = 0;
                } );
        self.hammertime.on('rotatestart',function()
                {
                    camera.old_x = 0;
                    camera.old_y = 0;
                } );
        self.hammertime.on('rotate', pinch_event);
        self.hammertime.on('pinchin', pan_event);
        self.hammertime.on('pinchout', pan_event);

        self.hammertime.get('rotate').set({ enable: true });
        self.hammertime.get('pinch').set({ enable: true, pointers: 3 });

    
    }
} 

function swipe_event(e)
{
    var le = length(vec2(e.deltaX-camera.old_x, e.deltaY - camera.old_y));
    if (le >30)
    {
        camera.old_x = e.deltaX;
        camera.old_y = e.deltaY;
        return;
    }
    camera.rotate(e.deltaX,e.deltaY, true);
    camera.old_x = e.deltaX;
    camera.old_y = e.deltaY;
}

function pan_event(e)
{

    
    camera.move(e.deltaX,e.deltaY,true);
    camera.old_x = e.deltaX;
    camera.old_y = e.deltaY;

}

function pinch_event(e)
{
    if (Math.abs(e.rotation - camera.old_x) >10 || Math.abs(e.rotation - camera.old_y) >10)
    {
       return; 
    }
    camera.zoom(e.rotation,e.rotation,true);
    camera.old_x = e.rotation;
    camera.old_y = e.rotation;
    
}
