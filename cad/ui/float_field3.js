
/*
 * This class is used to display a property that is a AttributeCompound,
 * for each property will create a float field.
 * Each float field will trigger on change function, alist of values will
 * be passed to the AttributeCompound which will be able to handle this list
 * @param parentDiv: the div we want to parent to, most likely this will be the
 *                   main container
 * @param obj: the object we want to display the property of
 * @param property: AttributeCompound, an instance of the property to display
 */
function FloatFieldArray(parentDiv ,obj, property)
{
    var self = this;
    //storing inputs
    self.property= property;
    self.obj = obj;
    self.parentDiv = parentDiv;
    
    //private data
    self.__div;
    self.__pt;
    self.__sliders=[];
    
    this.init = function()
    {
         
        //creating the div
        self.__div = document.createElement('div');
        self.__div.className += "FLOAT_FIELD3";

        //creating the p element to display the name of the property
        self.__pt = document.createElement('p');
        self.__pt.innerHTML= self.property.name +": ";
        self.__div.appendChild(self.__pt);
        
        //lets create the needed input sliders 
        var slider;
        var br; 
        for(var i=0; i<property.size; i++)
        {
            slider= document.createElement('input');
            slider.id = self.property.name;
            slider.type= 'number';
            slider.step =0.1;
            slider.value= self.property.get()[i];
            
            br= document.createElement('br');
            self.__pt.appendChild(br); 
            self.__pt.appendChild(slider);
            self.__sliders.push(slider);
            slider.oninput= self.onchange; 
        }

        //parent the main div
        self.parentDiv.appendChild(self.__div);    
    }
    
    this.onchange = function()
    { 
        var data=[];
        var value;
        
        //looping the size of the property and 
        //pushing the parsed float to a list
        for (var i=0; i<self.property.size;i++)
        {
            value = parseFloat(self.__sliders[i].value);
            if (isNaN(value) )
            {
                value =0;
            }
            data.push(value);
        }
        //once all the data is built we pass it ot the property
        self.property.set(data);
        //lets call the wanted function
        self.obj.update_position();
    }
}
