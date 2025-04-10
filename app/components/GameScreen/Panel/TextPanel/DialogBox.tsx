import { useTypewriter } from "~/hooks/useTypewriter";

type DialogBoxProps = {
  text: string;
  isNarrator: boolean;
};

export default function DialogBox({
  isNarrator,
  text,
}: Readonly<DialogBoxProps>) {
  return (
    <p
      className={`text-lg leading-relaxed tracking-wide text-slate-50 lg:text-xl 2xl:text-2xl ${
        isNarrator &&
        "text-center text-xl font-bold lg:px-16 lg:text-2xl 2xl:text-3xl"
      }`}
    >
      {text}
    </p>
  );
}

