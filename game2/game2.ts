import * as THREE from 'three'
import Cannon from 'cannon'
import { initCamera, initRenderer, initScene } from '../src/initThree'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { setCameraAspectWhenResize } from '../src/game'
import Stats from 'stats.js'

// Cannon.js 초기화
const world = new Cannon.World()
world.gravity.set(0, -20, 0) // 중력 설정
// 공기 저항 설정
world.defaultContactMaterial.friction = 1
world.defaultContactMaterial.restitution = 0.5
world.defaultContactMaterial.contactEquationStiffness = 1e8
world.defaultContactMaterial.contactEquationRelaxation = 3
world.defaultContactMaterial.frictionEquationStiffness = 1e8
world.defaultContactMaterial.frictionEquationRelaxation = 3

// three.js 객체 생성
export const renderer = initRenderer()
export const scene = initScene()
export const camera = initCamera()
camera.position.set(0, 100, 100)
camera.lookAt(0, 0, 0)

//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(80, 80, 80)
light.castShadow = true // default false
light.receiveShadow = true
light.shadow.mapSize.width = 5120 // default
light.shadow.mapSize.height = 5120 // default
light.shadow.camera.near = 0.5 // default
light.shadow.camera.far = 500 // default
light.shadow.camera.visible = true // default false
light.shadow.camera.scale.set(20, 20, 20) // size
scene.add(light)
scene.add(new THREE.CameraHelper(light.shadow.camera))
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// 마우스로 카메라 앵글 변경
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.update()

// 카메라 비율 설정
window.addEventListener('resize', () =>
  setCameraAspectWhenResize(renderer, camera)
)

// 바닥 생성. 정사각형 모양
const groundSize = 80
const groundShape = new Cannon.Box(new Cannon.Vec3(groundSize, 1, groundSize))
const groundBody = new Cannon.Body({ mass: 0, shape: groundShape })
groundBody.position.set(0, -1, 0)
groundBody.material = new Cannon.Material('groundMaterial')
world.addBody(groundBody)
const groundGeometry = new THREE.BoxGeometry(groundSize * 2, 2, groundSize * 2)
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.receiveShadow = true
scene.add(groundMesh)

// 구체 생성
const { sphereBody, sphereMesh } = addSphere(3)

// 키보드 방향키로 구체에 힘을 가함.
const force = 50
let isPressedArrowUp = false
let isPressedArrowDown = false
let isPressedArrowLeft = false
let isPressedArrowRight = false
let isPressedSpace = false
let isJumping = false
window.addEventListener('keydown', setKeyStatusWhenKeyDown)
window.addEventListener('keyup', setKeyStatusWhenKeyUp)

// 성능 측정
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

animate()

function animate() {
  stats.begin()
  requestAnimationFrame(animate)

  // 물리 시뮬레이션 업데이트
  world.step(1 / 60)

  // 물리 객체와 그래픽 객체 동기화
  syncPhysicsToGraphics(groundBody, groundMesh)
  syncPhysicsToGraphics(sphereBody, sphereMesh)

  // 키보드 입력에 따라 힘을 가함
  if (isPressedArrowUp) {
    sphereBody.applyForce(new Cannon.Vec3(0, 0, -force), sphereBody.position)
  }
  if (isPressedArrowDown) {
    sphereBody.applyForce(new Cannon.Vec3(0, 0, force), sphereBody.position)
  }
  if (isPressedArrowLeft) {
    sphereBody.applyForce(new Cannon.Vec3(-force, 0, 0), sphereBody.position)
  }
  if (isPressedArrowRight) {
    sphereBody.applyForce(new Cannon.Vec3(force, 0, 0), sphereBody.position)
  }
  if (isPressedSpace) {
    if (!isJumping) {
      isJumping = true
      sphereBody.applyForce(
        new Cannon.Vec3(0, force * 10, 0),
        sphereBody.position
      )
    }
  }
  if (
    Math.round(sphereBody.position.y) <=
    sphereBody.shapes[0].boundingSphereRadius
  ) {
    isJumping = false
  } else {
    isJumping = true
  }

  renderer.render(scene, camera)
  stats.end()
}

// 물리 객체와 three.js 객체 동기화
function syncPhysicsToGraphics(
  cannonBody: Cannon.Body,
  threeObject: THREE.Mesh
) {
  // @ts-expect-error Three와 Cannon의 타입 호환 문제
  threeObject.position.copy(cannonBody.position)
  // @ts-expect-error Three와 Cannon의 타입 호환 문제
  threeObject.quaternion.copy(cannonBody.quaternion)
}

// 키보드 이벤트
function setKeyStatusWhenKeyDown(e: KeyboardEvent) {
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
}
function setKeyStatusWhenKeyUp(e: KeyboardEvent) {
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

function addSphere(radius = 1) {
  // 구체 생성
  const sphereShape = new Cannon.Sphere(radius) // 반지름 5인 구체
  const sphereBody = new Cannon.Body({ mass: radius, shape: sphereShape })
  sphereBody.position.set(0, 5, 0) // 초기 위치 설정
  // 반발 계수 설정
  sphereBody.material = new Cannon.Material('sphereMaterial')
  sphereBody.material.friction = 1
  sphereBody.material.restitution = 1
  // 공기 저항 추가
  sphereBody.linearDamping = 0.5
  world.addBody(sphereBody)
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh.castShadow = true
  sphereMesh.receiveShadow = true
  scene.add(sphereMesh)
  return { sphereBody, sphereMesh }
}
