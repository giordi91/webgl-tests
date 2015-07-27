

function FloatSlider(parentDiv ,obj, property, name, defaultValue)
{
    var self = this;
    self.property= property;
    self.name = name;
    self.obj = obj;
    self.defaultValue = defaultValue;
    self.parentDiv = parentDiv;
    self.__div;
    self.__pt;
    self.__slider;
    
    this.init = function()
    {
         
        self.__div = document.createElement('div');
        self.__div.className += "FLOAT_SLIDER";

        self.__pt = document.createElement('p');
        self.__pt.innerHTML= self.property.name;
        self.__slider= document.createElement('input');
        self.__slider.id = self.property.name;
        self.__slider.type= 'range';
        self.__div.appendChild(self.__pt);
        self.__div.appendChild(self.__slider);
        self.parentDiv.appendChild(self.__div);    
        self.__slider.onchange = self.onchange; 
    }
    
    this.onchange = function()
    { 
        self.property.set(self.__slider.value);
        self.obj.init();
    }
}
