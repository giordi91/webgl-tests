

function Renderer (gl, program, camera)
{
    var self = this;
    self.gl = gl;
    self.program = program;
    self.registered_resources = [];
    self.camera = camera;

    this.register_resource(resource)
    {
        self.register_resource.push(resource);
    }

}
