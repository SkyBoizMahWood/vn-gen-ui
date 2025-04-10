import CharacterImage from "./TextPanel/CharacterImage";
import CharacterName from "./TextPanel/CharacterName";
import DialogBox from "./TextPanel/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useTypewriter } from "~/hooks/useTypewriter";

type TextPanelProps = {
  isNarrator: boolean;
  characterName: string;
  characterUrl: string;
  dialog: string;
  isLoading: boolean;
  haveChoicesShown: boolean;
  onNext: () => void;
};

export default function TextPanel({
  isNarrator,
  characterName,
  characterUrl,
  dialog,
  isLoading,
  haveChoicesShown,
  onNext,
}: Readonly<TextPanelProps>) {
  const isDisableClicked = isLoading || haveChoicesShown;
  const { displayedText, isTypingComplete, showAllText } = useTypewriter(dialog, 30);

  const handleClick = () => {
    if (isDisableClicked) return;
    
    if (!isTypingComplete) {
      showAllText();
    } else {
      onNext();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`${haveChoicesShown && "hidden md:block"} group absolute bottom-0 left-0 h-3/5 w-full md:h-1/3 ${isDisableClicked ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {isLoading && (
        <LoadingSpinner size="md" position="absolute" color="primary" />
      )}
      <div
        className={`flex h-full w-full flex-col items-center gap-6 overflow-auto bg-black-80 px-10 py-6 text-start transition-all md:flex-row md:gap-14 md:px-20 md:py-10 2xl:px-48 ${
          isNarrator && "justify-center"
        } ${!isDisableClicked && "hover:bg-black-75"}`}
      >
        {!isNarrator && (
          <CharacterImage
            characterName={characterName}
            characterUrl={characterUrl}
          />
        )}
        <div className="flex flex-col items-center justify-center gap-6 md:basis-4/5 md:items-start">
          {!isNarrator && <CharacterName characterName={characterName} />}
          <DialogBox text={displayedText} isNarrator={isNarrator} />
        </div>
        {!haveChoicesShown && (
          <div className="absolute bottom-6 right-6 flex items-center rounded-full border border-slate-400 px-4 py-1 text-lg text-zinc-300 shadow transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-2 group-hover:bg-zinc-950 lg:text-2xl">
            <p>Continue</p>
            <p className="arrow-right" />
          </div>
        )}
      </div>
    </div>
  );
}
