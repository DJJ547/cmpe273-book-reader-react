// Helper function to determine if a color is light or dark
// export const isColorLight = (color) => {
//     // Convert color to RGB values
//     const hex = color.replace('#', '');
//     const r = parseInt(hex.substring(0, 2), 16);
//     const g = parseInt(hex.substring(2, 4), 16);
//     const b = parseInt(hex.substring(4, 6), 16);
  
//     // Calculate luminance
//     const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
//     // Return true if the color is light, false if dark
//     return luminance > 186; // 186 is a common threshold for lightness
//   };

  // Helper function to determine if a color is light or dark based on name
export const isColorLight = (color) => {
    const lightColors = ["white", "yellow", "lightgray", "lightblue", "lightgreen"];
    const darkColors = ["black", "navy", "maroon", "darkgreen", "darkblue", "purple"];
  
    // If the color is in the lightColors array, return true (light color)
    if (lightColors.includes(color.toLowerCase())) return true;
  
    // If the color is in the darkColors array, return false (dark color)
    if (darkColors.includes(color.toLowerCase())) return false;
  
    // Default to dark if the color is unknown
    return false;
  };