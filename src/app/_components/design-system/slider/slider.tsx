import useSlider from "~/hooks/useSlider";

export default function Slider({
  onChange,
  disabled,
}: {
  onChange: (value: number) => void;
  disabled: boolean;
}) {
  const { position, positions, handleMouseDown } = useSlider(onChange);

  return (
    <svg
      className={`left-0 top-0 h-8 w-full select-none ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      viewBox="0 0 288 40"
      onMouseDown={disabled ? undefined : handleMouseDown}
    >
      {/* Track markers */}
      <line
        x1="0"
        y1="12"
        x2="288"
        y2="12"
        strokeWidth="2"
        className="stroke-blue-900"
      />

      {/* Distance markers */}
      <g className="fill-blue-900 text-lg font-medium">
        {/* 0 miles */}
        <line
          x1="0"
          y1="4"
          x2="0"
          y2="13"
          strokeWidth="2.5"
          className="stroke-blue-900"
        />
        <text x="0" y="35" textAnchor="middle">
          0
        </text>

        {/* 5 miles */}
        <line
          x1="72"
          y1="4"
          x2="72"
          y2="13"
          strokeWidth="2.5"
          className="stroke-blue-900"
        />
        <text x="72" y="35" textAnchor="middle">
          5
        </text>

        {/* 10 miles */}
        <line
          x1="144"
          y1="4"
          x2="144"
          y2="13"
          strokeWidth="2.5"
          className="stroke-blue-900"
        />
        <text x="144" y="35" textAnchor="middle">
          10
        </text>

        {/* 25 miles */}
        <line
          x1="216"
          y1="4"
          x2="216"
          y2="13"
          strokeWidth="2.5"
          className="stroke-blue-900"
        />
        <text x="216" y="35" textAnchor="middle">
          25
        </text>

        {/* 50 miles */}
        <line
          x1="288"
          y1="4"
          x2="288"
          y2="13"
          strokeWidth="2.5"
          className="stroke-blue-900"
        />
        <text x="288" y="35" textAnchor="middle">
          50
        </text>
      </g>

      {/* Draggable circle */}
      <circle
        cx={positions[position]}
        cy="12"
        r="9"
        strokeWidth="3"
        className="fill-blue-700 stroke-white"
      />
    </svg>
  );
}
