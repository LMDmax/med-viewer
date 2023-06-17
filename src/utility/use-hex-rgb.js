const useHexRGB = () => {
  // All functions pulled from
  // https://css-tricks.com/converting-color-spaces-in-javascript/

  const hexToRGB = (h) => {
    if (!h) return null;
    let r = 0;
    let g = 0;
    let b = 0;

    // 3 digits
    if (h.length === 4) {
      r = `0x${h[1]}${h[1]}`;
      g = `0x${h[2]}${h[2]}`;
      b = `0x${h[3]}${h[3]}`;

      // 6 digits
    } else if (h.length === 7) {
      r = `0x${h[1]}${h[2]}`;
      g = `0x${h[3]}${h[4]}`;
      b = `0x${h[5]}${h[6]}`;
    }

    return `rgb(${+r},${+g},${+b})`;
  };

  const hexToRGBA = (h, opacity = 1) => {
    const rgb = hexToRGB(h);
    if (!rgb) return null;
    if (opacity < 0 || opacity > 1) {
      console.error("useHexRGB: opacity value must be between 0 and 1");
      return null;
    }
    const rgba = rgb.replace("rgb", "rgba");
    const indexPos = rgba.lastIndexOf(")");
    return `${rgba.slice(0, indexPos)},${opacity}${rgba.slice(indexPos)}`;
  };

  const RGBToHex = (r, g, b) => {
    let red = r.toString(16);
    let green = g.toString(16);
    let blue = b.toString(16);

    if (red.length === 1) red = `0${r}`;
    if (green.length === 1) green = `0${g}`;
    if (blue.length === 1) blue = `0${b}`;

    return `#${r}${g}${b}`;
  };

  return {
    hexToRGB,
    hexToRGBA,
    RGBToHex,
  };
};

export default useHexRGB;
