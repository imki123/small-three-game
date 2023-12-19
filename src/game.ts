import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { camera, defaultFont, renderer, scene } from './initThree'
import { startRender } from './utils'
import { initThree } from './initThree'

// Start game
console.log('# this is game.ts')
initThree().then(() => {
  // create objectives
  const greenCube = addDefaultCube(8)
  greenCube.position.x = -20
  greenCube.material.color.setHex(0x00ff00)

  const blueCube = addDefaultCube(8)
  blueCube.material.color.setHex(0x0000ff)

  const blackCube = addDefaultCube(8)
  blackCube.position.x = 20

  const yellowSphere = addDefaultSphere(1)
  yellowSphere.position.z = 30
  yellowSphere.material.color.setHex(0xeeee55)

  const welcomeText = addDefaultText('안녕하세요~')
  welcomeText.position.x = 10
  welcomeText.position.y = 10

  window.addEventListener('keydown', setKeyStatusWhenKeyDown)
  window.addEventListener('keyup', setKeyStatusWhenKeyUp)
  window.addEventListener('resize', setCameraAspectWhenResize)

  startRender(() => {
    moveMaterial(yellowSphere)
    moveTextRepeatedly(welcomeText)
  })
})

// keyboard control
let isPressedArrowUp = false
let isPressedArrowDown = false
let isPressedArrowLeft = false
let isPressedArrowRight = false
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
  // WARN: 점프 후에 내려왔을 때 포지션이 0이 아닌 경우 0으로 맞춰주는 코드
  if (isJumping === undefined) {
    if (material.position.y !== 0) {
      material.position.y =
        material.position.y - MIN_UNIT < 0 ? 0 : material.position.y - MIN_UNIT
    }
  }

  // move camera following material
  camera.position.set(
    material.position.x,
    material.position.y + 10,
    material.position.z + 10
  )
  camera.lookAt(
    material.position.x,
    material.position.y,
    material.position.z - 20
  )
}

function moveTextRepeatedly(text?: THREE.Mesh) {
  if (!text) {
    return
  }

  if (text.position.x > -25) {
    text.position.x -= 0.1
  } else {
    text.position.x = 10
  }
}

function addDefaultCube(size = 1) {
  const boxGeometry = new THREE.BoxGeometry(size, size, size)
  const coloredMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(boxGeometry, coloredMaterial)
  scene.add(mesh)
  return mesh
}

// add default sphere
function addDefaultSphere(radius = 0.5) {
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
  const coloredMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(sphereGeometry, coloredMaterial)
  scene.add(mesh)
  return mesh
}

// add default text
function addDefaultText(text: string) {
  const textGeometry = new TextGeometry(text, {
    font: defaultFont,
    size: 10, // font size
    height: 0.1, // font depth
    curveSegments: 12,
    bevelEnabled: false,
  })
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(mesh)
  return mesh
}

export function setKeyStatusWhenKeyDown(e: KeyboardEvent) {
  console.log(e.key === ' ' ? 'Space' : e.key)
  if (e.key === 'ArrowUp') {
    isPressedArrowUp = true
  }
  if (e.key === 'ArrowDown') {
    isPressedArrowDown = true
  }
  if (e.key === 'ArrowLeft') {
    isPressedArrowLeft = true
  }
  if (e.key === 'ArrowRight') {
    isPressedArrowRight = true
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
  if (e.key === 'ArrowUp') {
    isPressedArrowUp = false
  }
  if (e.key === 'ArrowDown') {
    isPressedArrowDown = false
  }
  if (e.key === 'ArrowLeft') {
    isPressedArrowLeft = false
  }
  if (e.key === 'ArrowRight') {
    isPressedArrowRight = false
  }
}

export function setCameraAspectWhenResize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}
