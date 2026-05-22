/** After first successful paint, skip opacity fade on return visits (same session). */
let sessionReady = false

export function isHeroCubeSessionReady() {
  return sessionReady
}

export function markHeroCubeSessionReady() {
  sessionReady = true
}

export function resetHeroCubeSessionReady() {
  sessionReady = false
}
