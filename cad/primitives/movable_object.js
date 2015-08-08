/*
 * This module implements some "builder functions", for movable objects,
 * this means that for each object that is supposed to be moved it will 
 * add the needed functions and behavior that the whole system needs to have
 * I am using this pattern because I don't want to go down the road of inheritance
 * in JS, is not well supported if not in most modern browser
 */

function  MovableObject()
{
    //this.update_position.bind(this);
    //this.model_matrix.bind(this);
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

