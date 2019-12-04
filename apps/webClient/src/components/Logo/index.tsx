import React from "react";

interface Props {
  fill: string;
}

const Logo: React.FC<Props> = ({ fill = "black" }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 50 44">
      <title>{"FutureDays Software Logo"}</title>
      <g transform="translate(-8 -11)" fill="none" fillRule="evenodd">
        <text
          fontFamily="AmericanTypewriter, American Typewriter"
          fontSize={50}
          fill={`${fill}`}
        >
          <tspan x={1.75} y={45}>
            {"{ }"}
          </tspan>
        </text>
        <ellipse fill={`${fill}`} cx={17.016} cy={22.5} rx={1.547} ry={1.5} />
        <path stroke={`${fill}`} strokeLinecap="square" d="M32.484 11.5v43" />
        <ellipse fill={`${fill}`} cx={49.547} cy={22.5} rx={1.547} ry={1.5} />
      </g>
    </svg>
  );
};

export default Logo;
