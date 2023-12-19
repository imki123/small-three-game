import * as THREE from 'three'
import { setCameraPosition } from './utils'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { Font, FontLoader } from 'three/examples/jsm/Addons.js'

if (!WebGL.isWebGLAvailable()) {
  const warning = WebGL.getWebGLErrorMessage()
  document.getElementById('three')!.appendChild(warning)
  throw new Error('WebGL is not available')
}

// create global variables
export let defaultFont: Font
export const renderer = new THREE.WebGLRenderer()
export const scene = new THREE.Scene()
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
export const light = new THREE.DirectionalLight(0xffffff, 1)

export async function initThree() {
  console.log('# this is initThree.ts')
  await loadFont()
  initRenderer()
  initScene()
  initCamera()
  return true
}

function initRenderer() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xffffff, 1) // color, opacity

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  document.querySelector('#app')!.innerHTML = ''
  document.querySelector('#app')!.appendChild(renderer.domElement)
}

function initScene() {
  scene.clear()
}

function initCamera() {
  setCameraPosition({ x: 0, y: 0, z: 30 })
  camera.lookAt(0, 0, 0)
}

async function loadFont(): Promise<Font> {
  const loader = new FontLoader()
  return new Promise((resolve) => {
    if (defaultFont) {
      return resolve(defaultFont)
    }
    loader.load('fonts/Noto Sans KR_Regular.json', function (font) {
      defaultFont = font
      return resolve(font)
    })
  })
}
