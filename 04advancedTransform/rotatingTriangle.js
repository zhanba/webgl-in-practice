const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_modelMatrix;
  void main() {
    gl_Position = u_modelMatrix * a_Position;
  }
`

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

const ANGLE_STEP = 45.0

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

  const u_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix')

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  let currentAngle = 0.0
  const modelMatrix = new Matrix4()
  const tick = () => {
      currentAngle = animate(currentAngle)
      draw(gl, n, currentAngle, modelMatrix, u_modelMatrix)
      requestAnimationFrame(tick)
  }

  tick()

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

function draw(gl, n, currentAngle, modelMatrix, u_modelMatrix) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1)
    modelMatrix.translate(0.35, 0, 0)

    // console.log(modelMatrix.elements)
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, n) // n is 3
}


let g_last = Date.now()

function animate(angle) {
    const now = Date.now()
    const elapsed = now - g_last
    g_last = now
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
    return newAngle %= 360
}

window.onload = function() {
  main()
}
