import { camera, renderer, scene } from './initThree'

let animationFrameId = 0
export function startRender(callback?: () => void) {
  callback?.()
  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(() => {
    startRender(callback)
  })
}
export function cancelRender() {
  cancelAnimationFrame(animationFrameId)
}

export function setCameraPosition({
  x,
  y,
  z,
}: {
  x?: number
  y?: number
  z?: number
}) {
  camera.position.x = x || camera.position.x
  camera.position.y = y || camera.position.y
  camera.position.z = z || camera.position.z
}
