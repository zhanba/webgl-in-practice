const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`

const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initTextures(gl, n)) {
    console.log('Failed to init texture')
  }

}

function initVertexBuffers(gl) {
  const verticesTexCoords = new Float32Array(
    [-0.5, 0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0])
  const n = 4;

  const vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Falied to create the buffer object')
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(a_Position)

  const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')

  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(a_TexCoord)

  return n
}

function initTextures(gl, n) {
  const texture = gl.createTexture()

  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')

  const image = new Image()
  image.onload = () => loadTexture(gl, n, texture, u_Sampler, image)
  image.src = './05color/sky.jpg'
  return true
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

  gl.uniform1i(u_Sampler, 0)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}

window.onload = function() {
  main()
}