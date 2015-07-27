var AttrDisplay= {
  FLOAT_FIELD: 1,
  FLOAT_FIELD3:2,
  FLOAT_SLIDER: 3,
  properties: {
    1: {name: "floatField", value: 1, code: "ff"},
    2: {name: "floaField3", value: 3, code: "ff3"},
    3: {name: "floatSlider", value: 2, code: "fs"}
  }
};

var AttrCategory= {
  TRANSFORM: 1,
  BUILD: 2,
  CACCA: 3,
  properties: {
    1: {name: "transform", value: 1, code: "tr"},
    2: {name: "build", value: 2, code: "b"},
    3: {name: "cacca", value: 3, code: "c"}
  }
};


function Attribute(display_type, category, name, value )
{
    var self= this;
    this.display_type = display_type;
    this.category = category;
    this.name = name;
    this.is_attribute = true;
    this.value = value;

    this.set = function(value)
    {
        self.value = value;
    }

    this.get = function(value)
    {
        return self.value;
    }
}

function AttributeCompound(display_type, category, name, size, values)
{
    var self= this;
    this.display_type = display_type;
    this.category = category;
    this.name = name;
    this.is_attribute = true;
    this.value = values;
    this.size = size;

    this.set = function(value)
    {
        self.value = value;
    }

    this.get = function(value)
    {
        return self.value;
    }
}

function get_attributes(obj, category)
{
    //lets get all the keys
    var keys = Object.keys(obj);
    var finals =[];
    var attr;
    for (var k in keys)
    {
        if (typeof obj[keys[k]] == 'function')
        {
            continue;
        }
        //short hand for the attribute 
        attr = obj[keys[k]]; 
        
        if ((attr.is_attribute != undefined)  && attr.is_attribute)
        {
            if (category== undefined)
            {
                finals.push(attr);
            }
            else if ( attr.category == category) 
            {
                finals.push(attr); 
            }
        }
    }
    return finals;

}


function generate_transform_attributes(obj)
{
    obj.t= new AttributeCompound( AttrDisplay.FLOAT_FIELD3, AttrCategory.TRANSFORM, 
                                 "Translate",3,[0,0,0]);    
    
    obj.r= new AttributeCompound( AttrDisplay.FLOAT_FIELD3, AttrCategory.TRANSFORM, 
                                 "Rotate",3,[0,0,0]);    
    obj.s= new AttributeCompound( AttrDisplay.FLOAT_FIELD3, AttrCategory.TRANSFORM, 
                                 "Scale",3,[1,1,1]);    
    /*
    obj.tx= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "TranslateX",0.0);    
    obj.ty= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "TranslateY",0.0);    
    obj.tz= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "TranslateZ",0.0);    
    obj.rx= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "RotateX",0.0);    
    obj.ry= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "RotateY",0.0);    
    obj.rz= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "RotateZ",0.0);    
    obj.sx= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "ScaleX",1.0);    
    obj.sy= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "ScaleY",1.0);    
    obj.sz= new Attribute( AttrDisplay.FLOAT_FIELD, AttrCategory.TRANSFORM, "ScaleZ",1.0);    
    */
}
