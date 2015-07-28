/*
 * THis class is used to show a property as a slider, each movement of the slider
 * will trigger a the onchange function
 * @param parentDiv: the div we want to parent to, most likely this will be the
 *                   main container
 * @param obj: the object we want to display the property of
 * @param property: AttributeCompound, an instance of the property to display
 */
function FloatSlider(parentDiv ,obj, property)
{
    var self = this;
    //storing inpunt
    self.property= property;
    self.obj = obj;
    self.parentDiv = parentDiv;
    self.__callback = self.property.callback;
    
    //internal data
    self.__div;
    self.__pt;
    self.__slider;
    
    this.init = function()
    {
         
        //lets create a div containing our stuff
        //then we use a p element to write the name
        //of the property and finally we create and setup
        //the slider
        self.__div = document.createElement('div');
        self.__div.className += "FLOAT_SLIDER";
        
        //p creatrion
        self.__pt = document.createElement('p');
        self.__pt.innerHTML= self.property.name +": ";
        
        //slider creation and setup
        self.__slider= document.createElement('input');
        self.__slider.id = self.property.name;
        self.__slider.type= 'range';
        self.__slider.max= 100;
        self.__slider.min= 0;
        self.__slider.value= self.property.get();
        self.__slider.oninput= self.onchange; 

        //perform all the parents
        self.__div.appendChild(self.__pt);
        self.__pt.appendChild(self.__slider);
        self.parentDiv.appendChild(self.__div);    
    }
    
    this.onchange = function()
    { 
        self.property.set(self.__slider.value);
        self.__callback();
    }
}
