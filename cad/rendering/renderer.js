

function Renderer (gl, program, camera)
{
    var self = this;
    self.gl = gl;
    self.program = program;
    self.registered_resources = [];
    self.camera = camera;

    
}
Renderer.prototype.register_resource= function(resource)
{
    this.registered_resources.push(resource);
}

Renderer.prototype.render_resources = function()
{
    console.warn("Renderer: base function render_resources not implemented!");
}
