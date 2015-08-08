
function SelectionRenderer(gl, program, camera, width, height)
{
    Renderer.apply(this, arguments);
    
    this.bf = new FrameBuffer(this.gl,width,height,true); 
    this.bf.init();
    this.bf.is_complete();
    this.bf.unbind();
    var self = this;
    self.width = width;
    self.height = height;
    this.hex_color_at_pixel  = function(x,y)
    {
    
    
        self.render_resources();
        var color= new Uint8Array(4);
        self.gl.readPixels(x-10, self.height-y+10,1,1,self.gl.RGBA,self.gl.UNSIGNED_BYTE,color); 
        self.bf.unbind();
        return color;
    }

}
SelectionRenderer.prototype = Object.create(Renderer.prototype);
SelectionRenderer.prototype.constructor = SelectionRenderer;

SelectionRenderer.prototype.render_resources = function()
{
    this.bf.bindFrame();
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
    var obj;
    this.gl.enable(gl.DEPTH_TEST);
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

        this.program.setUniform4f("color",obj.SELECTION_COLOR);
        this.gl.drawArrays( this.gl.TRIANGLES, 0, obj.data.length/3 );

    }    
}


