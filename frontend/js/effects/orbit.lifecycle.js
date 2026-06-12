const MO = typeof window !== 'undefined' && window.__morganOrbit ? window.__morganOrbit : { start(){}, stop(){} };

export function startOrbit(){ MO.start && MO.start(); }
export function stopOrbit(){ MO.stop && MO.stop(); }
