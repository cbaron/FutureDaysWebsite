import React from "react";

interface Props {
  height?: number;
  width?: number;
}

const GlobeIcon: React.FC<Props> = ({ height = 70, width }) => {
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
      viewBox="0 0 59.3 58.14"
      xmlSpace="preserve"
      {...svgProps}
    >
      <path
        style={{ fill: "#23221c" }}
        d="M15.32 24.66l-3.6-1.04-.48 1.66 3.6 1.03c.12-.55.29-1.11.48-1.65zM34.9 15.41l1.1-3.57-1.66-.51-1.09 3.57c.56.14 1.11.31 1.65.51zM29.07 14.49l-.35-3.72-1.72.16.35 3.72c.56-.08 1.14-.14 1.72-.16zM18.56 19.3l-2.88-2.39-1.11 1.33 2.88 2.4c.34-.48.71-.92 1.11-1.34zM23.34 15.85l-1.74-3.31-1.53.81 1.75 3.31c.48-.3.99-.57 1.52-.81zM39.94 18.5l2.37-2.89-1.34-1.1-2.37 2.89c.47.34.92.71 1.34 1.1zM44.81 29l3.72-.38-.17-1.72-3.72.38c.09.56.15 1.14.17 1.72zM43.42 23.27l3.29-1.76-.82-1.53-3.29 1.76c.3.49.58 1 .82 1.53zM40.85 39.9l2.9 2.37 1.1-1.34-2.9-2.37c-.35.46-.71.91-1.1 1.34zM30.39 44.81l.4 3.73 1.72-.18-.4-3.73c-.56.09-1.14.15-1.72.18zM36.1 43.39l1.78 3.3 1.52-.82-1.78-3.3c-.49.3-1 .57-1.52.82zM43.91 34.84l3.58 1.08.5-1.66-3.58-1.08c-.13.57-.3 1.12-.5 1.66zM19.5 40.93l-2.36 2.94 1.35 1.08 2.35-2.93c-.47-.34-.92-.71-1.34-1.09zM15.96 36.2l-3.29 1.81.83 1.52 3.29-1.81c-.3-.49-.58-1-.83-1.52zM24.56 43.95l-1.06 3.6 1.66.49 1.05-3.6c-.55-.13-1.11-.3-1.65-.49zM14.5 30.5l-3.73.42.19 1.72 3.73-.42c-.09-.56-.16-1.14-.19-1.72z"
      />
      <g id="prefix__Globe_4_">
        <path
          d="M29.68 19.25c-6.62 0-12 4.71-12 10.5s5.38 10.5 12 10.5 12-4.71 12-10.5-5.38-10.5-12-10.5zm-4.23 2.27c-.44.55-.83 1.18-1.17 1.88-.43-.19-.84-.41-1.2-.64.71-.5 1.51-.91 2.37-1.24zm-3.6 2.26c.55.39 1.17.74 1.85 1.05-.42 1.25-.68 2.67-.74 4.18h-3.73c.19-2.01 1.15-3.82 2.62-5.23zm-2.63 6.72h3.73c.07 1.51.32 2.92.74 4.18-.68.3-1.3.65-1.85 1.05-1.46-1.42-2.42-3.23-2.62-5.23zm3.86 6.24c.37-.23.77-.45 1.2-.64.34.7.73 1.34 1.17 1.89-.86-.33-1.65-.75-2.37-1.25zm5.85 1.9c-1.27-.33-2.4-1.46-3.21-3.08.99-.29 2.07-.48 3.21-.54v3.62zm0-5.11c-1.36.06-2.64.28-3.8.63-.37-1.1-.61-2.34-.68-3.66h4.48v3.03zm0-4.53h-4.48c.07-1.31.31-2.55.68-3.66 1.16.35 2.44.57 3.8.63V29zm0-4.53c-1.14-.06-2.23-.24-3.22-.54.81-1.62 1.95-2.75 3.22-3.08v3.62zM40.14 29h-3.73c-.07-1.51-.32-2.92-.74-4.18.68-.3 1.3-.65 1.85-1.05 1.46 1.42 2.42 3.23 2.62 5.23zm-3.86-6.24c-.37.23-.77.45-1.2.64-.34-.7-.73-1.34-1.17-1.89.86.33 1.66.75 2.37 1.25zm-5.85-1.9c1.27.33 2.4 1.46 3.21 3.07-.99.29-2.07.48-3.21.54v-3.61zm0 5.11c1.36-.06 2.64-.28 3.8-.63.37 1.1.61 2.34.68 3.66h-4.48v-3.03zm0 4.53h4.48c-.07 1.31-.31 2.55-.68 3.66a15.56 15.56 0 00-3.8-.63V30.5zm0 8.14v-3.61c1.14.06 2.23.24 3.22.54-.82 1.61-1.95 2.75-3.22 3.07zm3.48-.66c.44-.54.83-1.18 1.17-1.88.43.19.84.4 1.2.64-.71.5-1.51.92-2.37 1.24zm3.6-2.26c-.55-.39-1.17-.75-1.85-1.05.42-1.26.68-2.67.74-4.18h3.73c-.19 2.01-1.15 3.82-2.62 5.23z"
          fill="#fff"
        />
      </g>
    </svg>
  );
};

export default GlobeIcon;
