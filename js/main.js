import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.129.0-chk6X8RSBl37CcZQlxof/mode=imports,min/optimized/three.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.129.0-chk6X8RSBl37CcZQlxof/examples/jsm/controls/OrbitControls.js'

function main() {
  const fov = 60
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 20, 0)
  camera.lookAt(0, 0, 0)

  const scene = new THREE.Scene()

  const ambientLight = new THREE.AmbientLight(0x333366, 2)
  const pointLight = new THREE.PointLight(0xffff99, 3)
  scene.add(ambientLight, pointLight)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  new OrbitControls(camera, renderer.domElement)

  renderer.setSize(window.innerWidth, window.innerHeight - 100)
  document.getElementById('main').appendChild(renderer.domElement)

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()
  })

  const geometry = new THREE.SphereGeometry(1, 32, 32)

  const solarSystem = new THREE.Object3D()
  scene.add(solarSystem)

  const sunMaterial = new THREE.MeshBasicMaterial()
  sunMaterial.map = new THREE.TextureLoader().load('images/sunmap.jpg')
  const sunMesh = new THREE.Mesh(geometry, sunMaterial)
  sunMesh.scale.set(2, 2, 2)
  solarSystem.add(sunMesh)

  const earthOrbit = new THREE.Object3D()
  solarSystem.add(earthOrbit)
  earthOrbit.rotation.x = 0.01

  const earthPivot = new THREE.Object3D()
  earthOrbit.add(earthPivot)
  earthPivot.position.x = 8

  const earthMaterial = new THREE.MeshPhongMaterial()
  earthMaterial.bumpMap = new THREE.TextureLoader().load('images/earthbump.jpg')
  earthMaterial.bumpScale = 0.5
  const earthTexture = new THREE.TextureLoader().load('images/earthmap.jpg')
  earthMaterial.map = earthTexture
  const earthMesh = new THREE.Mesh(geometry, earthMaterial)
  earthPivot.add(earthMesh)

  const moonOrbit = new THREE.Object3D()
  earthPivot.add(moonOrbit)

  const moonMaterial = new THREE.MeshPhongMaterial()
  moonMaterial.bumpMap = new THREE.TextureLoader().load('images/moonbump.jpg')
  moonMaterial.bumpScale = 0.5
  moonMaterial.map = new THREE.TextureLoader().load('images/moonmap.jpg')
  const moonMesh = new THREE.Mesh(geometry, moonMaterial)
  moonMesh.scale.set(0.5, 0.5, 0.5)
  moonOrbit.add(moonMesh)
  moonMesh.position.x = 2

  document.addEventListener('keydown', onDocumentKeyDown)
  function onDocumentKeyDown({ which }) {
    switch (which) {
      case '37':
        camera.position.x += 1
        break
      case '38':
        camera.position.z += 1
        break
      case '39':
        camera.position.x -= 1
        break
      case '40':
        camera.position.z -= 1
        break
      default:
        break
    }
  }

  function render(time) {
    sunMesh.rotation.y = time * 0.001
    earthMesh.rotation.y = time * 0.001
    moonMesh.rotation.y = time * 0.0004

    moonOrbit.rotation.y = time * 0.002
    earthOrbit.rotation.y = time * 0.0003

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

main()
