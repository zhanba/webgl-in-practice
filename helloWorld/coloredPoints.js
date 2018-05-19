const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
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

  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  if (u_FragColor < 0) {
    console.log('Failed to get the storage location of u_FragColor')
    return
  }

  canvas.onmousedown = (ev) => click(ev, gl, canvas, a_Position, u_FragColor)


  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  console.log('done')
}

let g_points = []
let g_colors = []

const click = (ev, gl, canvas, a_Position, u_FragColor) => {
  let x = ev.clientX
  let y = ev.clientY
  const rect = ev.target.getBoundingClientRect()
  x = ((x - rect.left) - canvas.width/2) / (canvas.width/2)
  y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2)
  g_points.push([x, y])

  if (x >= 0 && y >= 0) {
    g_colors.push([1, 0, 0, 1])
  } else if (x < 0 && y < 0) {
    g_colors.push([0, 1, 0, 1])
  } else {
    g_colors.push([1, 1, 1, 1])
  }

  gl.clear(gl.COLOR_BUFFER_BIT)

  const length = g_points.length
  for (let i = 0; i < length; i ++) {
    const xy = g_points[i]
    const rgba = g_colors[i]
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0)
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}


window.onload = function() {
  main()
}
