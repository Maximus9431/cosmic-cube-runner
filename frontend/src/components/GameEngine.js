import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

// Player cube component
function PlayerCube({ position, ...props }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      // Add gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]} {...props}>
      <meshStandardMaterial 
        color="#00ff88" 
        emissive="#003322"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </Box>
  );
}

// Obstacle component
function Obstacle({ position, type = 'cube', ...props }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  if (type === 'sphere') {
    return (
      <Sphere ref={meshRef} position={position} args={[0.8]} {...props}>
        <meshStandardMaterial 
          color="#ff4444" 
          emissive="#440000"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </Sphere>
    );
  }

  return (
    <Box ref={meshRef} position={position} args={[1.2, 1.2, 1.2]} {...props}>
      <meshStandardMaterial 
        color="#ff4444" 
        emissive="#440000"
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.3}
      />
    </Box>
  );
}

// Coin component
function Coin({ position, collected, ...props }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  if (collected) return null;

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.3]} {...props}>
        <meshStandardMaterial 
          color="#ffd700" 
          emissive="#664400"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0}
        />
      </Sphere>
    </group>
  );
}

// Power-up component
function PowerUp({ position, type, collected, ...props }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.x += 0.03;
      meshRef.current.rotation.z += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  if (collected) return null;

  const colors = {
    speed: '#ff6b35',
    shield: '#00d4ff',
    multiplier: '#f7931e',
    magnet: '#00ff88'
  };

  return (
    <Box ref={meshRef} position={position} args={[0.8, 0.8, 0.8]} {...props}>
      <meshStandardMaterial 
        color={colors[type] || '#ffffff'} 
        emissive={colors[type] || '#ffffff'}
        emissiveIntensity={0.4}
        metalness={0.9}
        roughness={0.1}
      />
    </Box>
  );
}

// Ground/Track component
function Track({ segments = 100 }) {
  const trackRef = useRef();
  
  useFrame((state, delta) => {
    if (trackRef.current) {
      trackRef.current.children.forEach((segment, index) => {
        segment.position.z += delta * 20; // Move track segments
        if (segment.position.z > 10) {
          segment.position.z = -segments * 2;
        }
      });
    }
  });

  return (
    <group ref={trackRef}>
      {Array.from({ length: segments }, (_, i) => (
        <mesh key={i} position={[0, -1, -i * 2]}>
          <planeGeometry args={[10, 2]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            emissive="#0f0f23"
            emissiveIntensity={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Stars background
function Stars({ count = 1000 }) {
  const starsRef = useRef();
  
  useEffect(() => {
    if (starsRef.current) {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      }
      starsRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, [count]);

  return (
    <points>
      <bufferGeometry ref={starsRef} />
      <pointsMaterial size={0.5} color="#ffffff" />
    </points>
  );
}

// Game environment
function GameEnvironment({ gameObjects, playerPosition, gameSpeed }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Update camera to follow player
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, playerPosition[0], 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, playerPosition[1] + 3, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, playerPosition[2] + 5, 0.05);
    camera.lookAt(playerPosition[0], playerPosition[1], playerPosition[2] - 10);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ff88" />
      
      {/* Background */}
      <Stars />
      <Track />
      
      {/* Player */}
      <PlayerCube position={playerPosition} />
      
      {/* Game Objects */}
      {gameObjects.obstacles.map((obstacle, index) => (
        <Obstacle 
          key={`obstacle-${index}`}
          position={obstacle.position}
          type={obstacle.type}
        />
      ))}
      
      {gameObjects.coins.map((coin, index) => (
        <Coin 
          key={`coin-${index}`}
          position={coin.position}
          collected={coin.collected}
        />
      ))}
      
      {gameObjects.powerUps.map((powerUp, index) => (
        <PowerUp 
          key={`powerup-${index}`}
          position={powerUp.position}
          type={powerUp.type}
          collected={powerUp.collected}
        />
      ))}
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0a', 20, 100]} />
    </>
  );
}

// Main GameEngine component
const GameEngine = ({ 
  gameObjects, 
  playerPosition, 
  gameSpeed, 
  onCollision,
  onCoinCollect,
  onPowerUpCollect
}) => {
  const canvasRef = useRef();

  // Collision detection
  useEffect(() => {
    const checkCollisions = () => {
      if (!gameObjects) return;

      // Check obstacle collisions
      gameObjects.obstacles.forEach((obstacle, index) => {
        const distance = Math.sqrt(
          Math.pow(obstacle.position[0] - playerPosition[0], 2) +
          Math.pow(obstacle.position[2] - playerPosition[2], 2)
        );
        if (distance < 1) {
          onCollision?.(index, 'obstacle');
        }
      });

      // Check coin collections
      gameObjects.coins.forEach((coin, index) => {
        if (coin.collected) return;
        const distance = Math.sqrt(
          Math.pow(coin.position[0] - playerPosition[0], 2) +
          Math.pow(coin.position[2] - playerPosition[2], 2)
        );
        if (distance < 0.8) {
          onCoinCollect?.(index);
        }
      });

      // Check power-up collections
      gameObjects.powerUps.forEach((powerUp, index) => {
        if (powerUp.collected) return;
        const distance = Math.sqrt(
          Math.pow(powerUp.position[0] - powerUp.position[0], 2) +
          Math.pow(powerUp.position[2] - playerPosition[2], 2)
        );
        if (distance < 1) {
          onPowerUpCollect?.(index, powerUp.type);
        }
      });
    };

    const interval = setInterval(checkCollisions, 50);
    return () => clearInterval(interval);
  }, [gameObjects, playerPosition, onCollision, onCoinCollect, onPowerUpCollect]);

  return (
    <div className="w-full h-full">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a 0%, #1a1a2e 100%)' }}
      >
        <GameEnvironment 
          gameObjects={gameObjects}
          playerPosition={playerPosition}
          gameSpeed={gameSpeed}
        />
      </Canvas>
    </div>
  );
};

export default GameEngine;