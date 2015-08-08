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
function PrimFactory(gl,program, selectionProgram,camera, ui,width,height,prim_ren, sel_ren)
{
    var self = this;
    self.gl = gl;
    self.ui=ui;
    self.program = program;
    
    self.color_to_data= {}; 
    self.name_to_data = {}; 
    self.colors={};
    self.prim_ren = prim_ren;
    self.sel_ren = sel_ren;
    
    
    self.__active_selection = [];

    this.generate = function(type,name)
    {
        if (!( type in __SHAPES))
        {
            console.warn(type, " is not a supported type by the factory");
            return;
        }
        if (name == undefined)
        {
            //generate unique random name
            var counter = 1;
            name = type + String(counter);
            while (name in self.name_to_data)
            {
                counter +=1;
                name = type + String(counter);
            }

        } 
        var p = new __SHAPES[type](self.gl );
        p.init();
        var color = getRandomColor(); 
        
        while ( color in self.colors)
        {
            color = getRandomColor(); 
        } 
        var rgb = hexToRgb(color);
        
        self.colors[color] = true; 
        self.color_to_data[color] = p;
        self.name_to_data[name] = p;
        p.SELECTION_COLOR = [rgb.r/255.0,rgb.g/255.0,rgb.b/255.0,1.0]; 
        
        self.sel_ren.register_resource(p);
        self.prim_ren.register_resource(p);
        return p;


        
    }
    
    this.object_at_pixel = function (x,y)
    {
        var color = self.sel_ren.hex_color_at_pixel(x,y);
        var hex = rgbToHex(color[0],color[1],color[2]);
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
        
    }
}

