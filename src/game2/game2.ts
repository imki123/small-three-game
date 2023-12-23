import * as THREE from 'three'
import Cannon from 'cannon'
import { initCamera, initRenderer, initScene } from '../initThree'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { setCameraAspectWhenResize } from '../game'

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
light.position.set(50, 50, 50)
light.castShadow = true // default false
light.receiveShadow = true
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

// 마우스로 카메라 앵글 변경
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.update()

// 카메라 비율 설정
window.addEventListener('resize', setCameraAspectWhenResize)

// 바닥 생성
const groundShape = new Cannon.Plane()
const groundBody = new Cannon.Body({ mass: 0, shape: groundShape })
groundBody.position.set(0, 0, 0)
groundBody.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), -Math.PI / 2)
groundBody.material = new Cannon.Material('groundMaterial')
// 바닥 사이즈 설정
const groundBodySize = 80
groundShape.worldNormal.set(0, 0, 0)
groundShape.worldNormalNeedsUpdate = true
groundShape.boundingSphereRadius = groundBodySize
// 바닥 마찰력 설정
groundBody.angularDamping = 1000
groundBody.linearDamping = 1000
world.addBody(groundBody)
const groundGeometry = new THREE.PlaneGeometry(
  groundBodySize * 2,
  groundBodySize * 2
)
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 })
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.receiveShadow = true
groundMesh.castShadow = true
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

animate()

function animate() {
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
function setKeyStatusWhenKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      isPressedArrowUp = true
      break
    case 'ArrowDown':
      isPressedArrowDown = true
      break
    case 'ArrowLeft':
      isPressedArrowLeft = true
      break
    case 'ArrowRight':
      isPressedArrowRight = true
      break
    case ' ':
      isPressedSpace = true
      break
  }
}
function setKeyStatusWhenKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      isPressedArrowUp = false
      break
    case 'ArrowDown':
      isPressedArrowDown = false
      break
    case 'ArrowLeft':
      isPressedArrowLeft = false
      break
    case 'ArrowRight':
      isPressedArrowRight = false
      break
    case ' ':
      isPressedSpace = false
      break
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
