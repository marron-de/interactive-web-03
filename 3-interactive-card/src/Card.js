import * as THREE from "three";

// const card = new Card({
//   width: 2,
//   height: 3,
//   color: '#0077ff'
// })

class Card {
  constructor({ width, height, radius, color }) {
    const x = width/2 - radius // Three.js은 원점 중심으로 x, y 계산
    const y = height/2 - radius // Three.js은 원점 중심으로 x, y 계산
    const shape = new THREE.Shape();

    shape // 카드형태
    .absarc(x, y, radius, Math.PI / 2, 0, true) // 1번째 곡선
    .lineTo(x + radius, -y) // 2번째 점까지 선분 
    .absarc(x, -y, radius, 0, -Math.PI / 2, true) // 2번째 곡선
    .lineTo(-x, -(y + radius)) // 3번째 점까지 선분 
    .absarc(-x, -y, radius, -Math.PI / 2, Math.PI, true) // 3번째 곡선
    .lineTo(-(x + radius), y) // 4번째 점까지 선분 
    .absarc(-x, y, radius, Math.PI, Math.PI / 2, true) // 4번째 곡선

    const geometry = new THREE.ExtrudeGeometry(shape, { // 두께 표현 Geometry
      depth: 0.01,
      bevelThickness: 0.1,
    }); 

    const material = new THREE.MeshStandardMaterial({ 
      color,
      side: THREE.DoubleSide, // 성능적인 이유로 기본값은 앞면만 노출됨, 추가 설정필요
      roughness: 0.3,
      metalness: 0.5,
     })

    const mesh = new THREE.Mesh(geometry, material)

    this.mesh = mesh;
  }
}

export default Card