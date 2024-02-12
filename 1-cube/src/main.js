import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

window.addEventListener("load", () => {
  init();
});

function init() {
  const optoins = { color: 0x00ffff };

  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 표면 울퉁불퉁한 부분 보정
  });

  renderer.setSize(window.innerWidth, window.innerHeight); // 사이즈 설정
  document.body.appendChild(renderer.domElement); // body 추가

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    // 시야각(Field of View): 카메라 렌즈의 시야각을 나타내는 값
    window.innerWidth / window.innerHeight,
    // 종횡비(Aspect Ratio): 뷰포트의 가로세로 비율을 나타내는 값
    1,
    // Near Clipping Plane: 카메라가 렌더링할 장면의 가까운 경계를 나타내는 값
    500
    // Far Clipping Plane: 카메라가 렌더링할 장면의 먼 경계를 나타내는 값
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 20;
  controls.enableDamping = true; // 관성
  controls.dampingFactor = 0.025;
  controls.enableZoom = true; // 기본값 true
  controls.enablePan = true; // 기본값 true
  // controls.maxDistance = 50;
  // controls.minDistance = 10;
  // controls.maxPolarAngle = Math.PI / 2;
  // controls.minPolarAngle = Math.PI / 3;
  // controls.maxAzimuthAngle = Math.PI / 2;
  // controls.minAzimuthAngle = Math.PI / 3;

  // MeshLambertMaterial 빛의 영향을 받는 Material중에서 성능이 뛰어남
  const cubeGeometry = new THREE.IcosahedronGeometry(1);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    emissive: 0x111111,
  });
  // material.color = new THREE.Color(0x00cb96); // 인스턴스 변경
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // MeshBasicMaterial는 조명에 영향을 받지않기에 빛에 의한 음영이 표현되지 않음
  const skeletonGeometry = new THREE.IcosahedronGeometry(2);
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2, // transparent가 true를 설정해줘야함
    color: 0xaaaaaa,
  });
  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

  scene.add(cube, skeleton);

  camera.position.z = 5; // 우리가 보는 방향으로 +5
  // camera.position.set(3, 4, 5);
  // camera.lookAt(cube.position);

  // THREE.DirectionalLight는 특정 방향에서 나오는 강한 빛
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(-1, 2, 3);
  scene.add(directionalLight);

  // THREE.AmbientLight는 모든 방향에서 균일하게 발생하는 약한 주변 빛
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  // ambientLight.position.set(3, 2, 1);
  // scene.add(ambientLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    const elapsedTime = clock.getElapsedTime();
    // cube.rotation.x = elapsedTime;
    // cube.rotation.y = elapsedTime;

    // skeleton.rotation.x = elapsedTime * 1.5;
    // skeleton.rotation.y = elapsedTime * 1.5;
    // cube.rotation.x += clock.getDelta()
    // cube.rotation.x = THREE.MathUtils.degToRad(45);
    // cube.position.y = Math.sin(cube.rotation.x) // sin 값은 0~1 범위를 가진다.
    // cube.scale.x = Math.cos(cube.rotation.x) // cos 값은 0~1 범위를 가진다.

    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 이 코드를 입력해줘야 반영됨

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    controls.update();
  }

  window.addEventListener("resize", handleResize);

  const gui = new GUI();

  // gui.add(cube.position, 'y', -3, 3, 0.1)
  gui
  .add(cube.position, "y")
  .min(-2)
  .max(3)
  .step(0.1);

  gui.add(cube, "visible"); // Boolean type

  gui
    .addColor(optoins, "color") // 16진수 컬러
    .onChange((value) => {
      cube.material.color.set(value);
    
    });
}
