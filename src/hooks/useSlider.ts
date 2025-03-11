import { useState } from "react";

export default function useSlider(handleChange: (value: number) => void) {
  const [position, setPosition] = useState(0);
  const positions = [0, 72, 144, 216, 288]; // x coordinates for each marker
  const values = [0, 5, 10, 25, 50]; // corresponding distance values

  const handleMouseDown = (e: React.MouseEvent) => {
    const svgRect = e.currentTarget.getBoundingClientRect();

    const updatePosition = (clientX: number) => {
      const relativeX = clientX - svgRect.left;
      const svgX = (relativeX / svgRect.width) * 288;

      // Find closest snap point
      let closestIndex = 0;
      let minDistance = Math.abs(positions[0] - svgX);

      positions.forEach((pos, index) => {
        const distance = Math.abs(pos - svgX);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setPosition(closestIndex);
      handleChange(values[closestIndex]);
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    updatePosition(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return { position, positions, handleMouseDown };
}
