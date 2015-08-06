//This is a "static" map setting a relationship to each item of the Enum AttrDisplay
//and the corrisponding widget
__WIDGET_MAPPING ={};
__WIDGET_MAPPING[AttrDisplay.FLOAT_SLIDER] = FloatSlider;                    
__WIDGET_MAPPING[AttrDisplay.FLOAT_FIELD3] = FloatFieldArray;

/*
 * THis class is the dynamic ui that will be in charge of creating
 * and deleting the divs used to input data
 */
function ChannelBox()
{
    var self = this;
    self.__container; 
    self.__current_obj;
    
    this.init = function()
    {
        //let's create the container using the parentUi style setup in the HTML
        self.__container = document.createElement("div");
        self.__container.className += "channelBoxUi";
        document.getElementsByTagName('body')[0].appendChild(self.__container);    
    }
    
    /*
     * This function sets the current active object in the ui
     * and builds the ui for it
     * @param: Object, the object with the attributes to display in the ui
     */
    this.setObjectActive = function (obj)
    {
        //setting the object as active and calling the refresh
        self.__current_obj = obj; 
        self.refresh();
    }
    
    /*
     * this function clears the whole content of the box
     */
    this.clear = function()
    {
        self.__container.innerHTML = "";
    }
    
    /* This is where the main work happens, this function scans the current
     * object and for each attributes it finds it will draw a widget for it
     */
    this.refresh = function()
    {
        //lets clear the div
        self.clear();
        
        //lets query the BUILD attributes
        attrs = get_attributes(self.__current_obj, AttrCategory.BUILD);  
        self.__process_attrs(attrs);
        
        //lets process the transforms;
        attrs = get_attributes(self.__current_obj, AttrCategory.TRANSFORM);  
        self.__process_attrs(attrs);
    }

    this.__process_attrs = function(attrs)
    {
        var obj;
        for( var a in attrs)
        {
            //getting the function pointer for the corresponding widget
            f =   __WIDGET_MAPPING[attrs[a].display_type];
            //create the instance
            obj =new f(self.__container,
                    self.__current_obj,
                    attrs[a]); 
            obj.init();
        }
    }
}

/*
 * This class is the view of the factory class, it catches input from the 
 * user and creates object in the scene accordingly 
 * @param factory: the factory object to hook up to
 */
function CreatorUi(factory)
{
    var self = this;
    self.__container; 
    self.__buttons = []; 
    self.__factory = factory;
    
    this.init = function()
    {
        //let's create the container using the parentUi style setup in the HTML
        self.__container = document.createElement("div");
        self.__container.className += "creatorUi";
        document.getElementsByTagName('body')[0].appendChild(self.__container);    
        
        var temp;
        for (var w in __SHAPES)
        {
            temp= document.createElement('input');
            temp.id = w;
            temp.className  += "creatorButton";
            temp.type= 'image';
            pathToFile = 'icons/' + w + '.png';
            temp.src = pathToFile;
            temp.factory = self.__factory;
            temp.onclick = self.__on_item_click;
            self.__container.appendChild(temp);
            self.__buttons.push(temp);
        } 
    }

    this.__on_item_click = function ()
    {
        this.factory.generate(this.id);
    }
}
