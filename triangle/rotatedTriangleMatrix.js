const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_xformMatrix;
  void main() {
    gl_Position = u_xformMatrix * a_Position;
  }
`

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

  const ANGLE = 90.0
  const radian = Math.PI * ANGLE / 180.0
  const cosB = Math.cos(radian)
  const sinB = Math.sin(radian)

  // rotate
//   const xformMatrix = new Float32Array([
//       cosB, sinB, 0.0, 0.0,
//       -sinB, cosB, 0.0, 0.0,
//       0.0, 0.0, 1, 0.0,
//       0.0, 0.0, 0.0, 1,
//   ])

// translate
//   const Tx = 0.5;
//   const Ty = 0.5;
//   const Tz = 0;
//   const xformMatrix = new Float32Array([
//       1, 0, 0.0, 0.0,
//       0, 1, 0.0, 0.0,
//       0.0, 0.0, 1, 0.0,
//       Tx, Ty, Tz, 1,
//   ])

    // zoom
    const Sx = 1;
    const Sy = 1.5;
    const Sz = 1;
  const xformMatrix = new Float32Array([
      Sx, 0, 0.0, 0.0,
      0, Sy, 0.0, 0.0,
      0.0, 0.0, Sz, 0.0,
      0, 0, 0, 1,
  ])

  const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')

  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // gl.drawArrays(gl.TRIANGLES, 0, n) // n is 3
  gl.drawArrays(gl.TRIANGLES, 0, n) // n is 3
  console.log('done')
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5])
  const n = 3;

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
  return n
}


window.onload = function() {
  main()
}
