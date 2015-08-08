

function BasicRenderer(gl, program, camera)
{
    Renderer.apply(this, arguments);
}
BasicRenderer.prototype = Object.create(Renderer.prototype);
BasicRenderer.prototype.constructor = BasicRenderer;

BasicRenderer.prototype.render_resources = function()
{
    var obj;
    this.program.use();
    var projM = this.camera.projection_matrix(); 
    var ModelViewM= this.camera.model_view_matrix();
    this.program.setMatrix4("MVP", mult(projM,ModelViewM));
    for (var r in this.registered_resources)
    {
        obj = this.registered_resources[r];
        obj.buffer.bind(); 
        vPosition = this.gl.getAttribLocation( this.program.get(), "vPosition" );
        this.gl.vertexAttribPointer( vPosition, 3, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vPosition );
        
        this.program.setUniform4f("color",obj.color);
        this.gl.drawArrays( this.gl.LINES, 0, obj.data.length/3 );
    }    
}

