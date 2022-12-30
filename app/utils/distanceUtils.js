const distanceFromNest = (x, y) => {
  return (Math.sqrt( Math.pow((250000-x), 2) + Math.pow((250000-y), 2) ) / 1000).toFixed(2);
};

export { distanceFromNest };
