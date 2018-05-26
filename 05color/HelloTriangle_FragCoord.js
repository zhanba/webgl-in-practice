const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  uniform float u_Width;
  uniform float u_Height;
  void main() {
    gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
  }
`

function main() {
  var canvas = document.getElementById('webgl')

  var gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Failed to get rendering context for WebGL')
    return
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.')
    return
  }

  const n = initVertexBuffers(gl)

  if (n < 0) {
    console.log('Falied to set the position of the vertices')
    return
  }


  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // gl.drawArrays(gl.TRIANGLES, 0, n)
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n) 
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n)
  console.log('done')
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5])
  const n = 4;

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Falied to create the buffer object')
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  const width = gl.drawingBufferWidth
  const height = gl.drawingBufferHeight

  const u_Width = gl.getUniformLocation(gl.program, 'u_Width')
  const u_Height = gl.getUniformLocation(gl.program, 'u_Height')

  gl.uniform1fv(u_Width, new Float32Array([width]))
  gl.uniform1fv(u_Height, new Float32Array([height]))

  return n
}


window.onload = function() {
  main()
}
