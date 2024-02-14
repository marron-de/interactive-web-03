import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'
import { GUI } from 'lil-gui'
import Card from "./Card";

window.addEventListener("load", () => {
  init();
});

function init() {
  const gui = new GUI()

  const COLORS = ['#ff6e6e', '#31e0c1', '#006fff', "#ffd732"]

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // 투명 처리
  });

  // renderer.setClearAlpha(0.5);
  // renderer.setClearColor(0x00aaff, 0.5) // 배경과 투명도 같이 설정
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // const textureLoader = new THREE.TextureLoader();
  // const texture = textureLoader.load('./assets/sky_texture.jpg')
  // scene.background = texture;

  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    1, 
    500,    
  ); 
  camera.position.z = 25; 


  /** Controls */
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;
  controls.rotateSpeed = 0.75; // 드래그 시 회전속도
  controls.enableDamping = true; // 관성
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;
 

  /** Card */
  const card = new Card({
    width: 10,
    height: 15.8,
    radius: 0.5,
    color: COLORS[0],
  });
  card.mesh.rotation.z = Math.PI * 0.1;
  scene.add(card.mesh)

  gsap.to(card.mesh.rotation, { y: -Math.PI * 4, duration: 2.5, ease: 'back.out(2.5)' })

  const cardFoler = gui.addFolder('Card')

  cardFoler
  .add(card.mesh.material, 'roughness')
  .min(0)
  .max(1)
  .step(0.01)
  .name('material.roughness');

  cardFoler
  .add(card.mesh.material, 'metalness')
  .min(0)
  .max(1)
  .step(0.01)
  .name('material.metalness');


  /** AmbientLight */ // 색표현을 위해 조명 추가
 const ambientLight = new THREE.AmbientLight(0xffffff, 2)
 ambientLight.position.set(-5, -5, -5);
 scene.add(ambientLight)


 /** DirectionalLight */
 const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
 const directionalLight2 = directionalLight1.clone();
 directionalLight1.position.set(1, 1, 3);
 directionalLight2.position.set(-1, 1, -3);
 scene.add(directionalLight1, directionalLight2)


  render();

  function render() {
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


  /** Button */
  const container = document.querySelector(".container");
  COLORS.forEach(color => {
    const button = document.createElement('button')

    button.style.backgroundColor = color;
    
    button.addEventListener('click', () => {
      card.mesh.material.color = new THREE.Color(color);

      gsap.to(card.mesh.rotation, { y: card.mesh.rotation.y - Math.PI / 2, duration: 1, ease: 'back.out(2.5)' })
    })

    container.appendChild(button)
  })
}
