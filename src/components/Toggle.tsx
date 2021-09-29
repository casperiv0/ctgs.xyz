import * as React from "react";

interface Props {
  toggled: boolean;
  onClick: (value: any) => void;
  name: string;
}

enum Directions {
  RIGHT = 10,
  LEFT = 120,
}

export const Toggle = ({ toggled, name, onClick }: Props) => {
  const [x, setX] = React.useState(() => getDirection(toggled));

  React.useEffect(() => {
    setX(getDirection(toggled));
  }, [toggled]);

  return (
    <div className="w-[100px] flex items-center justify-between rounded-lg relative overflow-hidden">
      <div
        style={{ transform: `translateX(${x}%)` }}
        className="absolute bg-dark-gray dark:bg-black h-8 w-11 rounded-lg pointer-events-none transition-all duration-100"
      />

      <button
        onClick={() => onClick({ target: { name, value: true } })}
        type="button"
        className={`w-full p-1 cursor-pointer pointer-events-auto z-10 dark:text-white ${
          toggled && "text-white"
        }`}
      >
        On
      </button>
      <button
        onClick={() => onClick({ target: { name, value: false } })}
        type="button"
        className={`w-full p-1 cursor-pointer pointer-events-auto z-10 dark:text-white ${
          !toggled && "text-white"
        }`}
      >
        Off
      </button>
    </div>
  );
};

function getDirection(toggled: boolean) {
  if (toggled === true) {
    return Directions.RIGHT;
  }

  return Directions.LEFT;
}
