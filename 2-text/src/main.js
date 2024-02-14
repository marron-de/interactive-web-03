import * as THREE from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import GUI from 'lil-gui'

window.addEventListener("load", () => {
  init();
});


async function init() { // 비동기적으로 동작함
  const gui = new GUI();
  
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 1, 5)


  /** Controls */
  new OrbitControls(camera, renderer.domElement)


  /** Font */
  const fontLoader = new FontLoader();  
  // load()는 콜백 함수를 사용하여 로드 작업이 완료될 때 처리할 작업을 지정 
  // loadAsync()는 프로미스를 반환하여 await 키워드를 사용하여 비동기 작업의 완료를 기다림
  const font = await fontLoader.loadAsync("./assets/fonts/The Jamsil 3 Regular_Regular.json")


  /** Text */
  const textGeometry = new TextGeometry("Three.js Interactive Web", {
    font,
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  const textMaterial = new THREE.MeshPhongMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.castShadow = true;
  scene.add(text);
  // textGeometry.computeBoundingBox();
  // textGeometry.translate( // 화면의 중앙 정렬
  //   -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,
  //   -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,
  //   -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5
  // );
  textGeometry.center();


  /** Texture */
  const textureLoader = new THREE.TextureLoader().setPath('./assets/textures/')
  const textTexture = textureLoader.load('holographic.jpeg')
  // loadAsync()를 사용하지 않아도 Texture 인스턴스 사용 가능
  textMaterial.map = textTexture;


  /** Plane */
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshPhongMaterial({ color : 0x000000})
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.receiveShadow = true;
  plane.position.z = -10;
  scene.add(plane)


  /** AmbientLight */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);


  /** SpotLihgt */
  const spotLight = new THREE.SpotLight(0xffffff, 10, 30, Math.PI * 0.15, 0.2, 0.5)
  
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024; // 그림자 해상도 높이는 작업 (기본값:512)
  spotLight.shadow.mapSize.height = 1024; // 그림자 해상도 높이는 작업 (기본값:512)
  spotLight.shadow.radius = 10;

  spotLight.position.set(0, 0, 3);
  spotLight.target.position.set(0, 0, -3); // 빛의 향하는 타켓(기본값은 원점)
  scene.add(spotLight, spotLight.target)

  const spotLightTexture = textureLoader.load('gradient.jpg')
  spotLightTexture.encoding = THREE.sRGBEncoding
  THREE.LinearEncoding;
  spotLight.map = spotLightTexture

  window.addEventListener('mousemove', event => {
    const x = ((event.clientX / window.innerWidth) - 0.5) * 5
    const y = ((event.clientY / window.innerHeight) - 0.5) * 5
    spotLight.target.position.set(x, -y, -3) // Three.js은 원점기준으로 위는 + 아래는 -
  })

  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  // scene.add(spotLightHelper)

  const spotLightFolder = gui.addFolder('Spotlight')
  spotLightFolder
  .add(spotLight, 'angle')
  .min(0)
  .max(Math.PI / 2)
  .step(0.01)

  spotLightFolder
  .add(spotLight.position, 'z')
  .min(1)
  .max(10)
  .step(0.01)
  .name('position.z')
  
  spotLightFolder
  .add(spotLight, 'distance') // 빛의 거리
  .min(1)
  .max(30)
  .step(0.01)
  
  spotLightFolder
  .add(spotLight, 'decay') // 빛이 희미해지는 정도
  .min(0)
  .max(10)
  .step(0.01)
  
  spotLightFolder
  .add(spotLight, 'penumbra') // 0~1 사이의 값을 가지며, 블러효과 
  .min(0)
  .max(1)
  .step(0.01)
  
  spotLightFolder
  .add(spotLight.shadow, 'radius') // 0~1 사이의 값을 가지며, 블러효과 
  .min(1)
  .max(20)
  .step(0.01)
  .name('shadow.radius')


  /** PointLight */
  const pointLight = new THREE.PointLight(0xffffff, 4)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
  pointLight.position.set(3, 0, 2)
  // scene.add(pointLight)

  
  /** Effects */
  // 렌더링된 장면에 추가적인 시각적 효과를 적용 => 후처리
  const composer = new EffectComposer(renderer); 
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 1, 0) // => 광선 효과
  composer.addPass(unrealBloomPass)

  const unrealBloomPassFolder = gui.addFolder('UnrealBloomPass')

  unrealBloomPassFolder
  .add(unrealBloomPass, 'strength')
  .min(0)
  .max(3)
  .step(0.01)

  unrealBloomPassFolder
  .add(unrealBloomPass, 'radius')
  .min(0)
  .max(1)
  .step(0.01)

  unrealBloomPassFolder
  .add(unrealBloomPass, 'threshold')
  .min(0)
  .max(1)
  .step(0.01)


  render();

  function render() {
    composer.render();

    spotLightHelper.update();

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); 

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);
}
