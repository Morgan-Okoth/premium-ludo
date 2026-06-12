const MO = window.MorganOrbit || { start(){}, stop(){} };

window.startOrbit = function() { MO.start && MO.start(); };
window.stopOrbit = function() { MO.stop && MO.stop(); };
