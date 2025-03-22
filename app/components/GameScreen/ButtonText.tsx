type ButtonTextProps = {
  onClick: () => void;
  text: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export default function ButtonText({ 
  onClick, 
  text,
  position = "top-left" 
}: Readonly<ButtonTextProps>) {
  const positionClasses = {
    "top-left": "left-4 top-4",
    "top-right": "right-4 top-4",
    "bottom-left": "left-4 bottom-4",
    "bottom-right": "right-4 bottom-4"
  };

  return (
    <button 
      onClick={onClick}
      className={`absolute z-20 rounded-full bg-black-80 px-4 py-2 text-white transition-all hover:bg-black-75 ${positionClasses[position]}`}
    >
      {text}
    </button>
  );
} 