import React from "react";

interface Props {
  height?: number;
  width?: number;
}

const BulbIcon: React.FC<Props> = ({ height = 70, width }) => {
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
      <g id="prefix__Bulb_4_">
        <path
          d="M29.46 18c-3.72 0-6.75 3.03-6.75 6.75 0 1.8.6 3.31 1.18 4.78.55 1.39 1.07 2.71 1.07 4.22 0 .8.42 1.5 1.05 1.9-.19.33-.3.7-.3 1.1 0 .8.42 1.5 1.05 1.9-.19.33-.3.7-.3 1.1 0 1.24 1.01 2.25 2.25 2.25h1.5c1.24 0 2.25-1.01 2.25-2.25 0-.4-.11-.78-.3-1.1.63-.4 1.05-1.1 1.05-1.9 0-.4-.11-.78-.3-1.1.63-.4 1.05-1.1 1.05-1.9 0-1.51.52-2.83 1.07-4.22.58-1.46 1.18-2.98 1.18-4.78 0-3.72-3.03-6.75-6.75-6.75zm.75 22.5h-1.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h1.5c.41 0 .75.34.75.75s-.34.75-.75.75zm.75-3h-3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75zm-3.63-11.42c.61.5 1.34.92 2.13.92.79 0 1.53-.42 2.14-.93-.19 1.62-.59 2.64-1.02 3.7-.5 1.24-1.01 2.53-1.1 4.73h-.04c-.09-2.63-.63-3.93-1.17-5.17-.39-.91-.76-1.8-.94-3.25zm6.31 2.89c-.58 1.46-1.18 2.98-1.18 4.78 0 .41-.34.75-.75.75h-.73c.09-1.91.53-3.02 1-4.17.58-1.44 1.23-3.08 1.23-6.33 0-.02-.01-.05-.01-.07-.01-.05-.01-.1-.03-.15-.01-.05-.03-.09-.05-.13-.02-.04-.05-.08-.08-.12a.573.573 0 00-.11-.11c-.02-.01-.03-.04-.05-.05-.02-.01-.04-.01-.06-.03-.04-.02-.09-.04-.14-.06a.401.401 0 00-.15-.03c-.02 0-.04-.01-.07-.01-.02 0-.05.01-.07.01-.05.01-.1.01-.15.03-.04.01-.09.03-.13.05-.04.02-.08.05-.12.08-.04.03-.08.07-.11.11-.02.02-.04.03-.05.05-.42.63-1.55 1.92-2.38 1.92-.82 0-1.96-1.29-2.38-1.92-.01-.02-.03-.03-.05-.05a.573.573 0 00-.11-.11c-.04-.03-.07-.06-.12-.08a.502.502 0 00-.13-.05.401.401 0 00-.15-.03c-.02 0-.04-.01-.07-.01-.02 0-.04.01-.07.01-.05 0-.1.01-.15.03-.05.02-.1.03-.14.06-.02.01-.04.01-.06.03-.02.01-.03.03-.05.05-.04.03-.08.07-.11.11l-.08.11c-.02.04-.04.09-.05.13l-.03.15c0 .02-.01.05-.01.07 0 3.15.6 4.56 1.19 5.92.5 1.16.96 2.27 1.05 4.58h-.73c-.41 0-.75-.34-.75-.75 0-1.8-.6-3.31-1.18-4.78-.55-1.39-1.07-2.71-1.07-4.22 0-2.89 2.36-5.25 5.25-5.25s5.25 2.36 5.25 5.25c.01 1.52-.51 2.84-1.06 4.23z"
          fill="#fff"
        />
      </g>
    </svg>
  );
};

export default BulbIcon;