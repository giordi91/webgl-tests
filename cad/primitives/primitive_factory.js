__SHAPES ={ "cube" : Cube,
            "cilinder": Cilinder,
            "sphere":Sphere};

/*
 * This class is the class in charge of generating primitives, it also takes care 
 * of generating unique random color and to keep a color->object table up to date
 * used for selection purpose
 * @param gl: webgl context object
 * @param program: the program used for regular rendering
 * @param selectionProgram: the program used or render the selection frame
 */
function PrimFactory(gl,program, selectionProgram,camera, ui,width,height)
{
    var self = this;
    self.gl = gl;
    self.ui=ui;
    self.program = program;
    self.selectionProgram= selectionProgram;
    self.color_to_data= {}; 
    self.name_to_data = {}; 
    self.colors={};
    self.width = width;
    self.height = height;
    self.camera = camera;
    
    self.bf = new RenderBuffer(self.gl,width,height); 
    self.bf.init();
    self.bf.is_complete();
    self.bf.unbind();
    
    self.__active_selection = [];

    this.__getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    this.__hexToRgb= function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
        } : null;
    }
    this.__componentToHex =function (c) 
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    this.__rgbToHex = function (r, g, b) 
    {
        return ("#" + self.__componentToHex(r) + 
                      self.__componentToHex(g) + 
                      self.__componentToHex(b)).toUpperCase();
    } 
    
    this.generate = function(type,name)
    {
        if (!( type in __SHAPES))
        {
            console.warn(type, " is not a supported type by the factory");
            return;
        }
        
        var p = new __SHAPES[type](self.gl, self.program);
        p.init();
        var color = self.__getRandomColor(); 
        
        while ( color in self.colors)
        {
            color = self.__getRandomColor(); 
        } 
        var rgb = self.__hexToRgb(color);
        
        self.colors[color] = true; 
        self.color_to_data[color] = p;
        self.name_to_data[name] = p;
        p.SELECTION_COLOR = [rgb.r/255.0,rgb.g/255.0,rgb.b/255.0,1.0]; 
        return p;
        
    }

    this.draw = function()
    {
        for (v in self.name_to_data)
        {
            self.name_to_data[v].draw(false);
        }
    }
    
    this.object_at_pixel = function (x,y)
    {
        self.bf.bind();
        
        self.gl.clear(self.gl.COLOR_BUFFER_BIT);
        self.selectionProgram.use();
        var projM = self.camera.projection_matrix(); 
        var ModelViewM= self.camera.model_view_matrix();
        self.selectionProgram.setMatrix4("MVP", mult(projM,ModelViewM));
        
        for (v in self.name_to_data)
        {
            self.name_to_data[v].draw(true,self.selectionProgram);
        }
        
        var color= new Uint8Array(4);
        self.gl.readPixels(x-10, self.height-y+10,1,1,self.gl.RGBA,self.gl.UNSIGNED_BYTE,color); 
        
        var hex = self.__rgbToHex(color[0],color[1],color[2]);
        for (var k in self.__active_selection)
        {
            self.__active_selection[k].is_selected = false;
            self.__active_selection = [];
        }
        
        if (hex in self.color_to_data)
        {
            var obj = self.color_to_data[hex];
            obj.is_selected = true;
            self.ui.setObjectActive(obj); 
            self.__active_selection.push(obj);
        }
        
        self.bf.unbind();
    }
}

