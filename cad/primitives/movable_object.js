/*
 * This module implements some "builder functions", for movable objects,
 * this means that for each object that is supposed to be moved it will 
 * add the needed functions and behavior that the whole system needs to have
 * I am using this pattern because I don't want to go down the road of inheritance
 * in JS, is not well supported if not in most modern browser
 */

function generate_matrix_function(object)
{
    object.translate_matrix = translate_matrix;

}


function translate_matrix()
{
    console.log("hei translate mothafucka");
    console.log(self.height);
    //mat = translate();
}
