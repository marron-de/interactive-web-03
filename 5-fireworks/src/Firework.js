import * as THREE from "three";

class Firework {
  constructor({ x, y }) {
    const count = 1000 + Math.round(Math.random() * 5000); // 정점의 개수 1000~6000개
    const velocity = 10 + Math.random() * 10; // 10~20 사이의 값

    const particlesGeometry = new THREE.BufferGeometry();

    this.particles = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0); // 정점의 위치, (x,y,z)

      // particle.deltaX = THREE.MathUtils.randFloatSpread(velocity)
      // particle.deltaY = THREE.MathUtils.randFloatSpread(velocity)
      // particle.deltaZ = THREE.MathUtils.randFloatSpread(velocity)

      particle.theta = Math.random() * Math.PI * 2;
      particle.phi = Math.random() * Math.PI * 2;

      // 수학공식 참고
      particle.deltaX = velocity * Math.sin(particle.theta) * Math.cos(particle.phi);
      particle.deltaY = velocity * Math.sin(particle.theta) * Math.sin(particle.phi);
      particle.deltaZ = velocity * Math.cos(particle.theta);

      this.particles.push(particle);
    }

    particlesGeometry.setFromPoints(this.particles);
    // particles 배열의 각 요소에 대해 해당 요소의 위치를 버텍스로 설정하여 Geometry에 적용

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./assets/textures/particle.png");

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1,
      alphaMap: texture,
      transparent: true, // 투명하게 처리
      depthWrite: false, // 다른 물체 뒤에 있을 때에도 화면에 표시
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      blending: THREE.AdditiveBlending, // 혼합모드 설정
    });
    
    const points = new THREE.Points(particlesGeometry, particlesMaterial);

    this.points = points;

  }

  update() {
    const position = this.points.geometry.attributes.position;

    for (let i = 0; i < this.particles.length; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      position.setX(i, x + this.particles[i].deltaX);
      position.setY(i, y + this.particles[i].deltaY);
      position.setZ(i, z + this.particles[i].deltaZ);
    }

    position.needsUpdate = true;

  }
}

export default Firework


// 초기 작업
// const geometry = new THREE.BufferGeometry();
// const count = 1000 // 정점의 개수
// const positions = new Float32Array(count * 3) // 정점의 위치, (x,y,z)
// const colors = new Float32Array(count * 3) 
// for (let i = 0; i < count; i++) {
//   // randFloatSpread : -range/2에서 range/2 사이의 무작위 부동 소수점 값을 반환
//   // 숫자가 클수록 범위가 커짐
//   positions[i * 3] = THREE.MathUtils.randFloatSpread(10) // = Math.random() - 0.5;
//   positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(10)
//   positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(10)

//   colors[i * 3] = Math.random() // 0~1사이로 표현
//   colors[i * 3 + 1] = Math.random()
//   colors[i * 3 + 2] = Math.random()
// }
// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// const material = new THREE.PointsMaterial({
//   color: 0xccaaff,
//   // wireframe: true,
//   size: 0.1,
//   // sizeAttenuation: false, // 원근에 따른 점의 크기차이 표현
//   vertexColors: true, // 버텍스 색상을 활성화
// });


// const textureLoader = new THREE.TextureLoader();
// const texture =  textureLoader.load('./assets/textures/particle.png')
// material.alphaMap = texture;
// material.transparent = true; // 투명하게 처리
// material.depthWrite = false; // 다른 물체 뒤에 있을 때에도 화면에 표시

// const points = new THREE.Points(geometry, material)
// scene.add(points)