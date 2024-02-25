import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


window.addEventListener("load", () => {
  init();
});

async function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.outputEncoding = THREE.sRGBEncoding;
  // 렌더링된 색상을 sRGB 색 공간에 맞게 인코딩하여 올바른 색상 출력
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    1, 
    500,    
  );
 
  camera.position.set(0, 5, 20)


  // controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 3;


  // progresssBar
  const progresssBar = document.querySelector('#progress-bar');
  const progressBarContainer = document.querySelector('#progress-bar-container');  
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (url, loaded, total) => {
    progresssBar.value = (loaded / total) * 100;
  };
  loadingManager.onLoad = () => {
    progressBarContainer.style.display = 'none';
  };


  // model
  const gltfLoader = new GLTFLoader(loadingManager);
  const gltf = await gltfLoader.loadAsync('models/character.gltf')
  const model = gltf.scene
  model.scale.set(0.1, 0.1, 0.1)
  model.traverse(object => {
    if(object.isMesh) {
      object.castShadow = true;
    }
  })
  scene.add(model)
  camera.lookAt(model.position)


  // plane  
  const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 10000);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -7.5
  plane.receiveShadow = true,
  scene.add(plane)


  // hemisphereLight
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x555555)
  hemisphereLight.position.set(0, 20, 10);
  scene.add(hemisphereLight)


  // spotLight
  const spotLight = new THREE.SpotLight(0xffffff, 5, 50, Math.PI * 0.15, 0.5, 0);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 8;
  spotLight.position.set(0, 20, 0);
  scene.add(spotLight)

  
  // mixer
  const mixer = new THREE.AnimationMixer(model); 
  const buttons = document.querySelector('.actions');

  let currentAction;

  const combatAnimations = gltf.animations.slice(0, 5);
  const dancingAnimations = gltf.animations.slice(5);

  combatAnimations.forEach(animation => {
    const button = document.createElement('button');

    button.innerText = animation.name;
    buttons.appendChild(button);

    button.addEventListener('click', () => {
      const previousAction = currentAction;

      currentAction = mixer.clipAction(animation);

      if (previousAction !== currentAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }
    });
  });

  const hasAnimation = gltf.animations.length !== 0;
  if (hasAnimation) {
    currentAction = mixer.clipAction(gltf.animations[0]);

    currentAction.play();
  }


  const raycaster = new THREE.Raycaster();
  // 카메라 시선을 기반으로 특정 지점을 향해 레이를 쏘고, 그 레이가 교차하는 객체를 검출
  const pointer = new THREE.Vector2();

  const clock = new THREE.Clock()


  render();

  function render() {
    const delta = clock.getDelta();
    mixer.update(delta)

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 이 코드를 입력해줘야 반영됨

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);
  
  function handlePointerDown(event) {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2; 
    pointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    // 화면 중심기준 (0,0), THREE에서는 y축은 위가 + 이고 아래가 - 이므로

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children); 
    const object = intersects[0]?.object;

    if (object?.name === 'Ch46') { // 캐릭터와 교차점이 발생하는 경우
      const previousAction = currentAction;
      const index = Math.round(Math.random() * (dancingAnimations.length - 1));
      currentAction = mixer.clipAction(dancingAnimations[index]);
      currentAction.loop = THREE.LoopOnce;
      currentAction.clampWhenFinished = true;
      // 애니메이션이 종료된 후에 재생을 중단할지 여부, 마지막프레임에서 멈춤

      if (previousAction !== currentAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }


      mixer.addEventListener('finished', handleFinished);

      function handleFinished() {
        mixer.removeEventListener('finished', handleFinished);

        const previousAction = currentAction;

        currentAction = mixer.clipAction(combatAnimations[0]);
        
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }
    }
  }

  window.addEventListener('pointerdown', handlePointerDown);
}
