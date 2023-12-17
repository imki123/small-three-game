import { camera, renderer, scene } from './initThree'

export function renderRepeatedlySceneAndCamera(callback?: () => void) {
  callback?.()
  requestAnimationFrame(() => {
    renderRepeatedlySceneAndCamera(callback)
  })
  renderer.render(scene, camera)
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
