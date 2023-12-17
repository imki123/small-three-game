import * as THREE from 'three'
import { camera, initTree, scene } from './initThree'
import { renderRepeatedlySceneAndCamera } from './utils'

export default function Game() {
  function addDefaultCube(size = 1) {
    const boxGeometry = new THREE.BoxGeometry(size, size, size)
    const coloredMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(boxGeometry, coloredMaterial)
    scene.add(cube)
    return cube
  }

  function jumpWithKeyboard() {
    // 스페이스바를 누르면 0.5초동안 y축으로 1만큼 올라갔다가 다시 내려오기. 그동안 스페이스바는 눌리지 않는다.
    const isJumping = false
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' && !isJumping) {
        console.log(e.key)
        camera.position.y += 1
        setTimeout(() => {
          camera.position.y -= 1
        }, 500)
      }
    })
  }
  jumpWithKeyboard()

  function moveCameraWithKeyboard() {
    window.addEventListener('keydown', (e) => {
      console.log(e.key)
      if (e.key === 'ArrowUp') {
        camera.position.z -= 0.5
      } else if (e.key === 'ArrowDown') {
        camera.position.z += 0.5
      } else if (e.key === 'ArrowLeft') {
        camera.position.x -= 0.5
      } else if (e.key === 'ArrowRight') {
        camera.position.x += 0.5
      }
    })
  }

  // start game
  initTree()
  renderRepeatedlySceneAndCamera(() => {
    // RotateCameraZ(0.01)
  })
  moveCameraWithKeyboard()

  // set materials
  const greenCube = addDefaultCube(5)
  greenCube.position.x = -5
  const blueCube = addDefaultCube(5)
  blueCube.position.x = 5
  blueCube.material.color.setHex(0x0000ff)

  return null
}
