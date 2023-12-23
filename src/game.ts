import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import {
  CheckWebGLAvailable,
  initCamera,
  initRenderer,
  initScene,
  loadFont,
} from './initThree'
import { Font } from 'three/examples/jsm/Addons.js'

// Check if WebGL is available
CheckWebGLAvailable()

// Init Three.js
export const renderer = initRenderer()
export const camera = initCamera()
export const scene = initScene()

StartGame()

async function StartGame() {
  const font = await loadFont()

  const greenCube = addDefaultCube(8)
  greenCube.material.color.setHex(0x00ff00)
  greenCube.position.x = -20
  greenCube.position.y = 4

  const blueCube = addDefaultCube(8)
  blueCube.material.color.setHex(0x0000ff)
  blueCube.position.y = 4

  const whiteCube = addDefaultCube(8)
  whiteCube.material.color.setHex(0xffffff)
  whiteCube.position.x = 20
  whiteCube.position.y = 4

  const yellowSphere = addDefaultSphere(1)
  yellowSphere.material.color.setHex(0xeeee55)
  yellowSphere.position.y = 1
  yellowSphere.position.z = 30
  greenCube.position.y = 4

  const welcomeText = addDefaultText(font, '안녕하세요~')
  welcomeText.position.x = 5
  welcomeText.position.y = 10

  // TODO: light and shadow test

  //Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(50, 50, 50)
  light.castShadow = true // default false
  light.shadow.mapSize.width = 5120 // default
  light.shadow.mapSize.height = 5120 // default
  light.shadow.camera.near = 0.5 // default
  light.shadow.camera.far = 500 // default
  light.shadow.camera.visible = true // default false
  light.shadow.camera.scale.set(10, 10, 10) // size
  scene.add(light)
  scene.add(new THREE.CameraHelper(light.shadow.camera))
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  //Create a plane that receives shadows (but does not cast them)
  const planeGeometry = new THREE.PlaneGeometry(80, 100, 32, 32)
  planeGeometry.rotateX(-Math.PI / 2)
  planeGeometry.translate(0, 0, 0)
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.receiveShadow = true
  scene.add(plane)

  window.addEventListener('keydown', setKeyStatusWhenKeyDown)
  window.addEventListener('keyup', setKeyStatusWhenKeyUp)
  window.addEventListener('resize', setCameraAspectWhenResize)

  animate(() => {
    moveMaterial(yellowSphere)
    moveTextRepeatedly(welcomeText)
  })
}

// keyboard control
let isPressedArrowUp = false
let isPressedArrowDown = false
let isPressedArrowLeft = false
let isPressedArrowRight = false
let isPressedSpace = false
let isJumping: boolean | undefined = undefined

const MIN_UNIT = 0.2
function moveMaterial(material: THREE.Mesh) {
  if (isPressedArrowUp) {
    material.position.z -= MIN_UNIT
  }
  if (isPressedArrowDown) {
    material.position.z += MIN_UNIT
  }
  if (isPressedArrowLeft) {
    material.position.x -= MIN_UNIT
  }
  if (isPressedArrowRight) {
    material.position.x += MIN_UNIT
  }
  if (isPressedSpace) {
    if (isJumping === undefined) {
      isJumping = true
      setTimeout(() => {
        isJumping = false
        setTimeout(() => {
          isJumping = undefined
        }, 300)
      }, 300)
    }
  }

  if (isJumping === true) {
    const maxHeight = 1000
    if (material.position.y + MIN_UNIT <= maxHeight) {
      material.position.y = material.position.y + MIN_UNIT
    }
  }
  if (isJumping === false) {
    if (material.position.y - MIN_UNIT >= 0) {
      material.position.y = material.position.y - MIN_UNIT
    }
  }
  // WARN: 점프 후에 내려왔을 때 포지션이 1이 아닌 경우 1로 맞춰주기
  if (isJumping === undefined) {
    if (material.position.y !== 1) {
      material.position.y =
        material.position.y - MIN_UNIT < 1 ? 1 : material.position.y - MIN_UNIT
    }
  }

  // move camera following material
  camera.position.set(
    material.position.x,
    material.position.y + 20,
    material.position.z + 20
  )
  camera.lookAt(
    material.position.x,
    material.position.y,
    material.position.z - 20
  )
}

let isMovingLeft = true
function moveTextRepeatedly(text?: THREE.Mesh) {
  if (!text) {
    return
  }
  if (isMovingLeft) {
    if (text.position.x > -25) {
      text.position.x -= 0.1
    } else {
      isMovingLeft = false
    }
  } else {
    if (text.position.x < 5) {
      text.position.x += 0.1
    } else {
      isMovingLeft = true
    }
  }
}

function addDefaultCube(size = 1) {
  const boxGeometry = new THREE.BoxGeometry(size, size, size)
  const coloredMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(boxGeometry, coloredMaterial)
  scene.add(mesh)
  return mesh
}

// add default sphere
function addDefaultSphere(radius = 0.5) {
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
  const coloredMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(sphereGeometry, coloredMaterial)
  scene.add(mesh)
  return mesh
}

// add default text
function addDefaultText(font: Font, text: string) {
  const textGeometry = new TextGeometry(text, {
    font: font,
    size: 3, // font size
    height: 0.1, // font depth
    curveSegments: 12,
    bevelEnabled: false,
  })
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(mesh)
  return mesh
}

export function setKeyStatusWhenKeyDown(e: KeyboardEvent) {
  console.log(e.key === ' ' ? 'Space' : e.key)
  if (e.key === 'ArrowUp' || e.key === 'w') {
    isPressedArrowUp = true
  }
  if (e.key === 'ArrowDown' || e.key === 's') {
    isPressedArrowDown = true
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    isPressedArrowLeft = true
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    isPressedArrowRight = true
  }
  if (e.key === ' ') {
    isPressedSpace = true
  }
  if (e.key === ' ' && isJumping === undefined) {
    isJumping = true
    setTimeout(() => {
      isJumping = false
      setTimeout(() => {
        isJumping = undefined
      }, 300)
    }, 300)
  }
}

export function setKeyStatusWhenKeyUp(e: KeyboardEvent) {
  console.log('--', e.key === ' ' ? 'Space' : e.key)
  if (e.key === 'ArrowUp' || e.key === 'w') {
    isPressedArrowUp = false
  }
  if (e.key === 'ArrowDown' || e.key === 's') {
    isPressedArrowDown = false
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    isPressedArrowLeft = false
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    isPressedArrowRight = false
  }
  if (e.key === ' ') {
    isPressedSpace = false
  }
}

export function setCameraAspectWhenResize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

let animationFrameId = 0
export function animate(callback?: () => void) {
  callback?.()
  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(() => {
    animate(callback)
  })
}
export function cancelRender() {
  cancelAnimationFrame(animationFrameId)
}
