

function FloatSlider(parentDiv ,obj, property )
{
    var self = this;
    self.property= property;
    self.obj = obj;
    self.parentDiv = parentDiv;
    self.__div;
    self.__pt;
    self.__slider;
    
    this.init = function()
    {
         
        self.__div = document.createElement('div');
        self.__div.className += "FLOAT_SLIDER";

        self.__pt = document.createElement('p');
        self.__pt.innerHTML= self.property.name +": ";
        self.__slider= document.createElement('input');
        self.__slider.id = self.property.name;
        self.__slider.type= 'range';
        self.__slider.max= 100;
        self.__slider.min= 0;
        self.__slider.value= self.property.get();

        self.__div.appendChild(self.__pt);
        self.__pt.appendChild(self.__slider);
        self.parentDiv.appendChild(self.__div);    
        self.__slider.oninput= self.onchange; 
    }
    
    this.onchange = function()
    { 
        self.property.set(self.__slider.value);
        self.obj.init();
    }
}
