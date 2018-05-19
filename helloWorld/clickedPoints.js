const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
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

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return
  }

  // const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

  // if (a_PointSize < 0) {
  //   console.log('Failed to get the storage location of a_PointSize')
  //   return
  // }

  // gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0)
  // gl.vertexAttrib1f(a_PointSize, 20.0)

  canvas.onmousedown = (ev) => click(ev, gl, canvas, a_Position)


  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // gl.drawArrays(gl.POINTS, 0, 1)
  console.log('done')
}

let g_points = []

const click = (ev, gl, canvas, a_Position) => {
  let x = ev.clientX
  let y = ev.clientY
  const rect = ev.target.getBoundingClientRect()
  x = ((x - rect.left) - canvas.width/2) / (canvas.width/2)
  y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2)
  g_points.push(x)
  g_points.push(y)

  gl.clear(gl.COLOR_BUFFER_BIT)

  const length = g_points.length
  for (let i = 0; i < length; i += 2) {
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0)
    console.log(g_points[i], g_points[i+1])
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}


window.onload = function() {
  main()
}
