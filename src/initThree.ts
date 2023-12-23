import * as THREE from 'three'
import { Font, FontLoader, WebGL } from 'three/examples/jsm/Addons.js'

export function CheckWebGLAvailable() {
  if (!WebGL.isWebGLAvailable()) {
    const warning = WebGL.getWebGLErrorMessage()
    document.getElementById('app')!.appendChild(warning)
    throw new Error('WebGL is not available')
  }
}

export function initRenderer() {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xffffff, 1) // color, opacity

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  document.querySelector('#app')!.innerHTML = ''
  document.querySelector('#app')!.appendChild(renderer.domElement)
  return renderer
}

export function initScene() {
  const scene = new THREE.Scene()
  return scene
}

export function initCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 30)
  camera.lookAt(0, 0, 0)
  return camera
}

export async function loadFont(): Promise<Font> {
  const loader = new FontLoader()
  return new Promise((resolve) => {
    loader.load('fonts/Noto Sans KR_Regular.json', function (font) {
      return resolve(font)
    })
  })
}
