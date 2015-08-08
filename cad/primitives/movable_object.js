/*
 * This class implements a movable behavior means that the class will eb able to move in space,
 * the way it works is by defining three attributes translate rotate and scale, those attributes
 * are automatically connected to a callback function that updates the internal matrix that is then used
 * for rendering
 */

function  MovableObject()
{
    //here we declare the three attributes, the callback is bindend explicitly to this scope
    //to avoid loosing scope later down the pipe, basically like defining an anonymous function
    this.t= new AttributeCompound( AttrDisplay.FLOAT_FIELD3, AttrCategory.TRANSFORM, 
                             "Translate",3,[0,0,0],3, this.update_position.bind(this));    
    this.r= new AttributeCompound( AttrDisplay.FLOAT_FIELD3, AttrCategory.TRANSFORM, 
                             "Rotate",3,[0,0,0],5 ,this.update_position.bind(this));    
    this.s= new AttributeCompound( AttrDisplay.FLOAT_FIELD3, AttrCategory.TRANSFORM, 
                                 "Scale",3,[1,1,1],0.1,this.update_position.bind(this));    
}

MovableObject.prototype.translate_matrix= function()
{
    var values =  this.t.get();
    mat = translate(values[0],values[1],values[2]);
    return mat;
}
MovableObject.prototype.rotate_matrix= function()
{
    var values =  this.r.get();
    matX = rotate(values[0],[1,0,0]);
    matY = rotate(values[1],[0,1,0]);
    matZ = rotate(values[2],[0,0,1]);

    var yz= mult(matY,matZ);
    var xyz = mult(matX, yz); 
    return xyz;
}

MovableObject.prototype.scale_matrix= function()
{
    var values =  this.s.get();
    mat = scaleM(values);
    return mat;
}

MovableObject.prototype.model_matrix = function()
{
    var tm = this.translate_matrix();
    var rm = this.rotate_matrix();
    var sm = this.scale_matrix();
    var finalM = mult(rm,sm);
    var finalM2= mult(tm,finalM);
    return finalM2; 
}

MovableObject.prototype.update_position = function()
{
    this.__model_matrix = this.model_matrix();
}

