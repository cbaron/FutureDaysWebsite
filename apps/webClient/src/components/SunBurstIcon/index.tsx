import React from "react";

interface Props {
  height?: number;
  width?: number;
}

const SunBurstIcon: React.FC<Props> = ({ height = 70, width }) => {
  const svgProps = {};
  if (height) {
    Object.assign(svgProps, { height });
  }
  if (width) {
    Object.assign(svgProps, { width });
  }
  return (
    <svg x={0} y={0} viewBox="0 0 59.3 58.14" xmlSpace="preserve" {...svgProps}>
      <path
        fill="#23221c"
        d="M15.32 24.66l-3.6-1.04-.48 1.66 3.6 1.03c.12-.55.29-1.11.48-1.65zM34.9 15.41l1.1-3.57-1.66-.51-1.09 3.57c.56.14 1.11.31 1.65.51zM29.07 14.49l-.35-3.72-1.72.16.35 3.72c.56-.08 1.14-.14 1.72-.16zM18.56 19.3l-2.88-2.39-1.11 1.33 2.88 2.4c.34-.48.71-.92 1.11-1.34zM23.34 15.85l-1.74-3.31-1.53.81 1.75 3.31c.48-.3.99-.57 1.52-.81zM39.94 18.5l2.37-2.89-1.34-1.1-2.37 2.89c.47.34.92.71 1.34 1.1zM44.81 29l3.72-.38-.17-1.72-3.72.38c.09.56.15 1.14.17 1.72zM43.42 23.27l3.29-1.76-.82-1.53-3.29 1.76c.3.49.58 1 .82 1.53zM40.85 39.9l2.9 2.37 1.1-1.34-2.9-2.37c-.35.46-.71.91-1.1 1.34zM30.39 44.81l.4 3.73 1.72-.18-.4-3.73c-.56.09-1.14.15-1.72.18zM36.1 43.39l1.78 3.3 1.52-.82-1.78-3.3c-.49.3-1 .57-1.52.82zM43.91 34.84l3.58 1.08.5-1.66-3.58-1.08c-.13.57-.3 1.12-.5 1.66zM19.5 40.93l-2.36 2.94 1.35 1.08 2.35-2.93c-.47-.34-.92-.71-1.34-1.09zM15.96 36.2l-3.29 1.81.83 1.52 3.29-1.81c-.3-.49-.58-1-.83-1.52zM24.56 43.95l-1.06 3.6 1.66.49 1.05-3.6c-.55-.13-1.11-.3-1.65-.49zM14.5 30.5l-3.73.42.19 1.72 3.73-.42c-.09-.56-.16-1.14-.19-1.72z"
      />
      <g>
        <path
          fill="#fff"
          d="M40.82 28.65h-4.54a6.74 6.74 0 00-1.44-3.46l2.01-2.01c.29-.29.29-.77 0-1.06a.754.754 0 00-1.06 0l-2.01 2.01a6.74 6.74 0 00-3.46-1.44v-4.54c0-.41-.34-.75-.75-.75s-.75.34-.75.75v4.54c-1.3.15-2.49.66-3.46 1.44l-2.01-2.01a.754.754 0 00-1.06 0c-.29.29-.29.77 0 1.06l2.01 2.01a6.74 6.74 0 00-1.44 3.46h-4.54c-.41 0-.75.34-.75.75s.34.75.75.75h4.54c.15 1.3.66 2.49 1.44 3.46l-2.01 2.01c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.01-2.01a6.74 6.74 0 003.46 1.44v4.54c0 .41.34.75.75.75s.75-.34.75-.75v-4.54a6.74 6.74 0 003.46-1.44l2.01 2.01c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.01-2.01a6.74 6.74 0 001.44-3.46h4.54a.749.749 0 100-1.5zm-11.25 6c-2.89 0-5.25-2.36-5.25-5.25s2.36-5.25 5.25-5.25 5.25 2.36 5.25 5.25-2.35 5.25-5.25 5.25z"
        />
        <circle fill="#fff" cx={29.57} cy={29.4} r={2.74} />
      </g>
    </svg>
  );
};

export default SunBurstIcon;
