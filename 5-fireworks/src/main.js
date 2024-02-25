import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Firework from "./Firework";

window.addEventListener("load", () => {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    1, 
    10000,    
  );
 
  camera.position.z = 8000; 

  new OrbitControls(camera, renderer.domElement);

  const fireworks = [];
  fireworks.update = function () {
    for (let i = 0; i < this.length; i++) {
      const firework = fireworks[i];

      firework.update();
    }
  };

  const firework = new Firework({ x:0, y:0})
  scene.add(firework.points)

  fireworks.update();

  render();

  function render() {
    fireworks.update();

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

  function handleMouseDown() {
    const firework = new Firework({
      x: THREE.MathUtils.randFloatSpread(8000), // 위치 랜덤으로 설정
      y: THREE.MathUtils.randFloatSpread(8000),
    });

    scene.add(firework.points);

    fireworks.push(firework);
  }

  window.addEventListener('mousedown', handleMouseDown);
}
