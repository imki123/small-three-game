import * as THREE from 'three'
import { camera, initThree, scene } from './initThree'
import { renderRepeatedlySceneAndCamera } from './utils'
import { useEffect } from 'react'

export default function Game() {
  useEffect(() => {
    initThree()
    renderRepeatedlySceneAndCamera(() => {
      renderCameraWithKeyboardEvent()
    })

    window.addEventListener('keydown', setKeyStatusWhenKeyDown)
    window.addEventListener('keyup', setKeyStatusWhenKeyUp)
    return () => {
      window.removeEventListener('keydown', setKeyStatusWhenKeyDown)
      window.removeEventListener('keyup', setKeyStatusWhenKeyUp)
    }
  }, [])

  // set materials
  const greenCube = addDefaultCube(5)
  greenCube.position.x = -5
  greenCube.position.y = -3
  const blueCube = addDefaultCube(5)
  blueCube.position.x = 5
  blueCube.position.y = -3
  blueCube.material.color.setHex(0x0000ff)

  return null
}

function addDefaultCube(size = 1) {
  const boxGeometry = new THREE.BoxGeometry(size, size, size)
  const coloredMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(boxGeometry, coloredMaterial)
  scene.add(cube)
  return cube
}

// keyboard control
let arrowUpPressed = false
let arrowDownPressed = false
let arrowLeftPressed = false
let arrowRightPressed = false
let isJumping: boolean | undefined = undefined

function setKeyStatusWhenKeyDown(e: KeyboardEvent) {
  console.log(e.key === ' ' ? 'Space' : e.key)
  if (e.key === 'ArrowUp') {
    arrowUpPressed = true
  }
  if (e.key === 'ArrowDown') {
    arrowDownPressed = true
  }
  if (e.key === 'ArrowLeft') {
    arrowLeftPressed = true
  }
  if (e.key === 'ArrowRight') {
    arrowRightPressed = true
  }
  if (e.key === ' ' && isJumping === undefined) {
    isJumping = true
    setTimeout(() => {
      isJumping = false
      setTimeout(() => {
        isJumping = undefined
      }, 100)
    }, 100)
  }
}

function setKeyStatusWhenKeyUp(e: KeyboardEvent) {
  console.log('--', e.key === ' ' ? 'Space' : e.key)
  if (e.key === 'ArrowUp') {
    arrowUpPressed = false
  }
  if (e.key === 'ArrowDown') {
    arrowDownPressed = false
  }
  if (e.key === 'ArrowLeft') {
    arrowLeftPressed = false
  }
  if (e.key === 'ArrowRight') {
    arrowRightPressed = false
  }
}

function renderCameraWithKeyboardEvent() {
  if (arrowUpPressed) {
    camera.position.z -= 0.1
  }
  if (arrowDownPressed) {
    camera.position.z += 0.1
  }
  if (arrowLeftPressed) {
    camera.position.x -= 0.1
  }
  if (arrowRightPressed) {
    camera.position.x += 0.1
  }
  if (isJumping === true) {
    if (camera.position.y + 0.5 <= 100) {
      camera.position.y = camera.position.y + 0.5
    }
  }
  if (isJumping === false) {
    if (camera.position.y - 0.5 >= 0) {
      camera.position.y = camera.position.y - 0.5
    }
  }
  if (isJumping === undefined) {
    if (camera.position.y !== 0) {
      camera.position.y =
        camera.position.y - 0.5 < 0 ? 0 : camera.position.y - 0.5
    }
  }
}
