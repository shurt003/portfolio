/*
  Plain data + numeric constants for the orchestration scene. Kept free of any
  Three.js import so pages can read GLOBE_CONFIG / NODES_META (for HUD
  projection and the detail panel) without pulling the WebGL bundle into the
  main chunk — the heavy OrchestrationSwarm stays lazy-loaded.
*/

export const GLOBE_R = 1.75
export const OFFSET_X = 1.35
export const OFFSET_Y = 0.1
export const CAM_Z = 6.2
export const FOV = 45

/* Shared so the HUD overlay can project the globe's screen position exactly. */
export const GLOBE_CONFIG = { radius: GLOBE_R, offsetX: OFFSET_X, offsetY: OFFSET_Y, camZ: CAM_Z, fov: FOV }

/* Asset-node metadata — drives both 3D positions and the HUD detail panel. */
export const NODES_META = [
  { id: 'ALPHA',   lat: 28,  lon: -45,  cls: 'RECON',  status: 'ACTIVE',  links: 3 },
  { id: 'BRAVO',   lat: 54,  lon: 28,   cls: 'RELAY',  status: 'ACTIVE',  links: 3 },
  { id: 'CHARLIE', lat: -8,  lon: 86,   cls: 'SENSOR', status: 'STANDBY', links: 2 },
  { id: 'DELTA',   lat: -34, lon: -22,  cls: 'PATROL', status: 'ACTIVE',  links: 2 },
  { id: 'ECHO',    lat: 12,  lon: 158,  cls: 'RELAY',  status: 'ACTIVE',  links: 3 },
  { id: 'FOXTROT', lat: 44,  lon: -150, cls: 'UPLINK', status: 'STANDBY', links: 3 },
]
