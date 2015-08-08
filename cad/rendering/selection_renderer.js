
function SelectionRenderer(gl, program, camera)
{
    Renderer.apply(this, arguments);
}
SelectionRenderer.prototype = Object.create(Renderer.prototype);
SelectionRenderer.prototype.constructor = SelectionRenderer;

SelectionRenderer.prototype.render_resources = function()
{
    var obj;
    this.program.use();
    var projM = this.camera.projection_matrix(); 
    var ModelViewM= this.camera.model_view_matrix();
    this.program.setMatrix4("MVP", mult(projM,ModelViewM));
    for (var r in this.registered_resources)
    {
        obj = this.registered_resources[r];
        this.program.setMatrix4("modelM",obj.__model_matrix);

        obj.buffer.bind(); 
        vPosition = this.gl.getAttribLocation( this.program.get(), "vPosition" );
        this.gl.vertexAttribPointer( vPosition, 3, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vPosition );

        obj.buffer_bar.bind(); 
        vBC = this.gl.getAttribLocation( this.program.get(), "vBC" );
        this.gl.vertexAttribPointer( vBC, 3, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vBC);

        this.program.setUniform4f("color",obj.color);
        if(obj.is_selected)
        {
            this.program.setUniform4f("wire_color",obj.SELECTED_WIREFRAME_COLOR);
        }
        else
        {
            obj.program.setUniform4f("wire_color",[0,0.0,0,1]);
        }
        this.gl.drawArrays( this.gl.TRIANGLES, 0, obj.data.length/3 );

    }    
}

