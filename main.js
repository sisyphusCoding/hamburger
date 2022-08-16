import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import{Pane} from 'tweakpane'

const pane = new Pane()

const debugObject ={}

debugObject.envMapIntensity = 1


pane.addInput(debugObject,'envMapIntensity',{
  view:'slider',
  min:0,max:10,
  step:0.5
}).on('change',()=>{updateAll()})

const canvas = document.querySelector('#canvas')

const scene = new THREE.Scene()
const sizes = {w:window.innerWidth,h:window.innerHeight}

const gltfLoader= new GLTFLoader()

const cubeTextureLoader = new THREE.CubeTextureLoader()



window.addEventListener('resize',()=>{
  sizes.w = window.innerWidth
  sizes.h = window.innerHeight

  camera.aspect = sizes.w / sizes.h
  camera.updateProjectionMatrix()

  controls.update()

renderer.setSize(sizes.w,sizes.h)
renderer.setPixelRatio(Math.min(
  window.devicePixelRatio,
  2
))
})


const enviMap = cubeTextureLoader.load([
   '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
enviMap.encoding = THREE.sRGBEncoding
scene.background = enviMap
scene.environment = enviMap

gltfLoader.load(
  '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  (gltf)=>{
    gltf.scene.scale.set(10,10,10)
    gltf.scene.position.set(0,-1,0)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)
    pane.addInput(gltf.scene.rotation,'y',{
      view:'slider',
      label:'modelY',
        min:-Math.PI,
        max:Math.PI
    })
    updateAll()
  }
)

const updateAll = () =>{

scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMap = enviMap
            child.material.envMapIntensity = debugObject.envMapIntensity
        }
    })

}



const directionalLight = new THREE.DirectionalLight('#ffffff',3)
directionalLight.position.set(0.25,3,-2.25)

scene.add(directionalLight)

pane.addInput(directionalLight,'intensity',{
  view:'slider',
  min:0,max:4
})

pane.addInput(directionalLight.position,'x',{
  view:'slider',
  min:-5,max:5
})

pane.addInput(directionalLight.position,'y',{
  view:'slider',
  min:-5,max:5
})

pane.addInput(directionalLight.position,'z',{
  view:'slider',
  min:-5,max:5
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10,5,),
  new THREE.MeshStandardMaterial({color:0x0078AA})
)
plane.receiveShadow= true
plane.rotation.x = -Math.PI * 0.5
plane.position.set(0,-.8,0)


const geometry = new THREE.SphereGeometry(.5,16,16)
const material = new THREE.MeshStandardMaterial({color:0xFF9F29})

const sphere0 = new THREE.Mesh(geometry,material)
sphere0.castShadow = true
sphere0.position.set(-1.5,0,0)


const sphere1 = new THREE.Mesh(geometry,material)

sphere1.castShadow = true

const sphere2 = new THREE.Mesh(geometry,material)

sphere2.castShadow = true
sphere2.position.set(1.5,0,0)


const camera  = new THREE.PerspectiveCamera(
  75,
  sizes.w / sizes.h,
  0.1,
  100)
camera.position.set(15,10,6)
scene.add(camera)


const controls =  new OrbitControls(camera,canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({canvas:canvas})

renderer.setSize(sizes.w,sizes.h)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping =  THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.setPixelRatio(Math.min(
  window.devicePixelRatio,
  2
))
const clock = new THREE.Clock()
const tick  = ( ) =>{
  
  const elTime = clock.elapsedTime

  controls.update()

  renderer.render(scene,camera)
  window.requestAnimationFrame(tick)
}
tick()

pane.addInput(renderer,'toneMappingExposure',{
  view:'slider',
  min:1,max:10
})
