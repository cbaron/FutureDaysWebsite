import React from "react";

interface Props {
  height?: number;
  width?: number;
  svgColor?: string;
}

const Logo: React.FC<Props> = ({ height = 80, width, svgColor = "#fff" }) => {
  const svgProps = {};
  if (height) {
    Object.assign(svgProps, { height });
  }
  if (width) {
    Object.assign(svgProps, { width });
  }
  return (
    <svg
      id="prefix__Layer_1"
      x={0}
      y={0}
      viewBox="0 0 1224 238.13"
      xmlSpace="preserve"
      {...svgProps}
    >
      <path
        style={{ fill: svgColor }}
        d="M1183.84 134.51l-45.99-39.29c-8.83-6.51-13.9-16.5-13.9-27.41 0-18.79 15.29-34.08 34.08-34.08s34.08 15.29 34.08 34.08a5.36 5.36 0 0010.72 0c0-24.71-20.1-44.81-44.81-44.81s-44.81 20.1-44.81 44.81c0 14.14 6.83 27.62 17.96 35.81l45.99 39.29c8.83 6.51 13.9 16.5 13.9 27.41 0 18.79-15.29 34.08-34.08 34.08s-34.08-15.29-34.08-34.08a5.36 5.36 0 00-10.72 0c0 24.71 20.1 44.81 44.81 44.81s44.81-20.1 44.81-44.81c-.01-14.14-6.83-27.62-17.96-35.81zM969.71 26.4a5.371 5.371 0 00-4.99-3.4c-2.2 0-4.18 1.35-4.99 3.4l-56.87 144.2c0 .01-.01.02-.01.02l-14.66 37.18a5.359 5.359 0 003.02 6.96c.64.25 1.31.38 1.96.38 2.14 0 4.16-1.29 4.99-3.4l13.28-33.68h106.54l13.28 33.68a5.363 5.363 0 006.96 3.02 5.359 5.359 0 003.02-6.96L969.71 26.4zm-54.03 140.93l49.04-124.34 49.04 124.34h-98.08zM460.75 23a5.36 5.36 0 00-5.36 5.36v90.7c0 47.06-38.28 85.34-85.34 85.34s-85.34-38.28-85.34-85.34v-90.7a5.36 5.36 0 00-10.72 0v90.7c0 52.97 43.09 96.06 96.06 96.06s96.06-43.09 96.06-96.06v-90.7c0-2.96-2.4-5.36-5.36-5.36zM251.74 23h-65.18a5.36 5.36 0 000 10.72h27.22v176.04a5.36 5.36 0 0010.72 0V33.73h27.22c2.96 0 5.36-2.4 5.36-5.36.03-2.97-2.37-5.37-5.34-5.37zM89.06 23H23.88a5.36 5.36 0 00-5.36 5.36v181.4a5.36 5.36 0 0010.72 0V71.55H66.7a5.36 5.36 0 000-10.72H29.24v-27.1h59.81c2.96 0 5.36-2.4 5.36-5.36A5.348 5.348 0 0089.06 23zM650.18 33.73a5.36 5.36 0 000-10.72H585a5.36 5.36 0 00-5.36 5.36v181.4c0 2.96 2.4 5.36 5.36 5.36h65.18a5.36 5.36 0 000-10.72h-59.81V71.55h37.46a5.36 5.36 0 000-10.72h-37.46v-27.1h59.81zM557.51 57.58C557.51 38.51 542 23 522.93 23h-27.76a5.36 5.36 0 00-5.36 5.36v181.4a5.36 5.36 0 0010.72 0v-98.63l46.74 100.89a5.358 5.358 0 007.12 2.61 5.353 5.353 0 002.61-7.12L503.57 92.16h19.36c19.07 0 34.58-15.51 34.58-34.58zm-56.97 23.85v-47.7h22.39c13.15 0 23.85 10.7 23.85 23.85 0 13.15-10.7 23.85-23.85 23.85h-22.39zM802 23c-.17 0-.33.03-.5.05-.17-.02-.33-.05-.5-.05h-69a5.36 5.36 0 000 10.72h69.01c.17 0 .33-.03.5-.05.17.02.33.05.5.05 47.05 0 85.34 38.28 85.34 85.34s-38.28 85.34-85.34 85.34c-.17 0-.33.03-.5.05-.17-.02-.33-.05-.5-.05H732a5.36 5.36 0 000 10.72h69.01c.17 0 .33-.03.5-.05.17.02.33.05.5.05 52.97 0 96.06-43.09 96.06-96.06S854.97 23 802 23zM1101.22 23.37a5.363 5.363 0 00-6.96 3.02l-30.78 78.05-30.78-78.04a5.359 5.359 0 00-6.96-3.02 5.359 5.359 0 00-3.02 6.96l35.39 89.75v89.68a5.36 5.36 0 0010.72 0v-89.68l35.4-89.75c1.1-2.76-.26-5.88-3.01-6.97zM158.01 23a5.36 5.36 0 00-5.36 5.36v159.79c0 8.96-7.29 16.25-16.25 16.25s-16.25-7.29-16.25-16.25V28.36a5.36 5.36 0 00-10.72 0v159.79c0 14.87 12.1 26.98 26.98 26.98 14.87 0 26.98-12.1 26.98-26.98V28.36c-.02-2.96-2.42-5.36-5.38-5.36z"
      />
    </svg>
  );
};

export default Logo;
