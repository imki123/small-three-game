import * as THREE from 'three'
import { setCameraPosition } from './utils'

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
  document.querySelector('#three')!.appendChild(renderer.domElement)
}

function initScene() {
  // strong yellow light
  const light = new THREE.PointLight(0xffffff, 1, 100)
  scene.add(light)
}

function initCamera() {
  setCameraPosition({ x: 0, y: 0, z: 50 })
}

export function initThree() {
  initRenderer()
  initScene()
  initCamera()
}
