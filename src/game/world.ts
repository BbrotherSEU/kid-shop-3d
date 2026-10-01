export const shelf = {
  xs: [-3, -1, 1, 3] as const,
  y: [0.78, 2.12] as const,
  z: -3.05,
}

export function shelfPosition(slot: number, row: 0 | 1): [number, number, number] {
  return [shelf.xs[slot] ?? 0, shelf.y[row], shelf.z]
}

export const counter = {
  x: 4.7,
  z: 1.18,
}

export const doorway = {
  z: 9.3,
}

export const actor = {
  door: { x: -1.7, z: 12.15, yaw: Math.PI },
  customerStart: { x: 0, z: 2.05, yaw: Math.PI },
  checkout: { x: 2.35, z: -0.45, yaw: 0.5 },
  cashier: { x: 4.7, z: 2.2, yaw: Math.PI },
  standInFront(x: number) {
    return { x, z: -0.85, yaw: Math.PI }
  },
}

/** Cart sits beside the customer outside, and in front of them once they are pushing it. */
export function cartTarget(x: number, z: number, yaw: number, pushing: boolean) {
  const forward = pushing ? 0.92 : 0.12
  const side = pushing ? 0.72 : 1.05
  return {
    x: x + Math.sin(yaw) * forward + Math.cos(yaw) * side,
    z: z + Math.cos(yaw) * forward - Math.sin(yaw) * side,
    yaw,
  }
}

export const cameraPresets = {
  entrance: {
    pos: [2.4, 2.55, 16.6] as [number, number, number],
    look: [-0.2, 2.05, 9.1] as [number, number, number],
  },
  shopping: {
    pos: [0, 3.05, 7.8] as [number, number, number],
    look: [0, 1.9, -2.2] as [number, number, number],
  },
  cashier: {
    pos: [0.2, 2.55, 4.15] as [number, number, number],
    look: [3.4, 1.05, 0.35] as [number, number, number],
  },
}
