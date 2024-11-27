
export const getBackgroundColor = (colorCode) => {
  // Convert the hex color to RGB
  const hex = colorCode.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Check if the color is light or dark based on a luminance threshold (128 is commonly used)
  return luminance > 128 ? 'black' : 'white';
};