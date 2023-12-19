import * as THREE from 'three'
import { setCameraPosition } from './utils'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { Font, FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'

if (!WebGL.isWebGLAvailable()) {
  const warning = WebGL.getWebGLErrorMessage()
  document.getElementById('three')!.appendChild(warning)
  throw new Error('WebGL is not available')
}

// create global variables
export const renderer = new THREE.WebGLRenderer()
export const scene = new THREE.Scene()
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

function initRenderer() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xffffff, 1) // color, opacity
  document.querySelector('#three')!.innerHTML = ''
  document.querySelector('#three')!.appendChild(renderer.domElement)
}

function initScene() {
  scene.clear()
}

function initCamera() {
  setCameraPosition({ x: 0, y: 0, z: 30 })
  camera.lookAt(0, 0, 0)
}

export let defaultFont: Font | undefined
async function loadFont(): Promise<Font> {
  const loader = new FontLoader()
  return new Promise((resolve) => {
    loader.load('fonts/Noto Sans KR_Regular.json', function (font) {
      defaultFont = font
      return resolve(font)
    })
  })
}

export function initThree() {
  initRenderer()
  initScene()
  initCamera()
  loadFont()
}
