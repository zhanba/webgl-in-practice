const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
    v_Color = a_Color;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
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
//   gl.drawArrays(gl.POINTS, 0, n) // n is 3
  gl.drawArrays(gl.TRIANGLES, 0, n) // n is 3
  console.log('done')
}

function initVertexBuffers(gl) {
  const verticesColors = new Float32Array(
      [0.0, 0.5, 1.0, 0.0, 0.0,
       -0.5, -0.5, 0.0, 1.0, 0.0,
       0.5, -0.5, 0.0, 0.0, 1.0])
  const n = 3;
  const sizes = new Float32Array([10, 20, 30])

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Falied to create the buffer object')
    return -1
  }
  const sizeBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  const FSIZE = verticesColors.BYTES_PER_ELEMENT
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
  gl.enableVertexAttribArray(a_Position)

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
  gl.enableVertexAttribArray(a_Color)

  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW)
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_PointSize)

  return n
}


window.onload = function() {
  main()
}
