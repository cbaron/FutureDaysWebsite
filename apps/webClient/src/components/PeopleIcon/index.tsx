import React from "react";

interface Props {
  height?: number;
  width?: number;
}

const PeopleIcon: React.FC<Props> = ({ height = 70, width }) => {
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
          d="M28.13 32.14c2.81 0 5.1-2.79 5.1-6.21s-2.29-6.21-5.1-6.21c-1.39 0-2.69.67-3.66 1.87-.93 1.16-1.44 2.7-1.44 4.33 0 3.44 2.29 6.22 5.1 6.22zm0-11.05c2.06 0 3.74 2.17 3.74 4.85s-1.68 4.85-3.74 4.85-3.74-2.18-3.74-4.85c0-2.68 1.68-4.85 3.74-4.85zm4.29 10.37c-.38 0-.68.3-.68.68 0 .38.3.68.68.68a4.22 4.22 0 014.22 4.22c0 .3-.24.54-.54.54H20.17c-.3 0-.54-.24-.54-.54a4.22 4.22 0 014.22-4.22c.38 0 .68-.3.68-.68 0-.38-.3-.68-.68-.68-3.08 0-5.58 2.5-5.58 5.58 0 1.05.85 1.9 1.9 1.9h15.92c1.05 0 1.91-.85 1.91-1.9 0-3.08-2.5-5.58-5.58-5.58zm-3.79-12.49c.49-.29 1.01-.43 1.54-.43 2.06 0 3.74 2.17 3.74 4.85 0 .48-.05.95-.16 1.4-.09.37.14.73.51.82a.674.674 0 00.82-.5c.13-.55.19-1.13.19-1.71 0-3.42-2.29-6.21-5.1-6.21-.77 0-1.55.22-2.24.62-.32.19-.43.61-.24.93.2.31.62.42.94.23zm5.97 9.77a.68.68 0 000 1.36c2.33 0 4.08 1.94 4.08 4.26 0 .08-.02.15-.05.22-.15.34 0 .75.35.9a.677.677 0 00.9-.34c.11-.24.16-.51.16-.77 0-3.08-2.36-5.63-5.44-5.63z"
          fill="#fff"
        />
      </g>
    </svg>
  );
};

export default PeopleIcon;