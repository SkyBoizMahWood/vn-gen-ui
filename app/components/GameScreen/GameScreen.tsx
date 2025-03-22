import { useState } from "react";
import { useNavigate, useNavigation, Link } from "@remix-run/react";
import ChoicePanel from "./Panel/ChoicePanel";
import { StoryChoice } from "~/models/story/StoryChoice";
import TextPanel from "./Panel/TextPanel";
import ConfirmDialog from "~/components/ConfirmDialog";
import { useLoadingState } from "~/hooks/useLoadingState";
import ButtonText from "./ButtonText";

type GameScreenProps = {
  dialog: string;
  isNarrator: boolean;
  characterName: string;
  characterUrl: string;
  sceneTitle?: string;
  sceneUrl: string;
  isLastNarrative: boolean;
  choices: StoryChoice[];
  order: number;
  onChapterEnd: () => void;
  onNextDialog: (currentOrder: number) => void;
};

export default function GameScreen({
  dialog,
  isNarrator,
  characterName,
  characterUrl,
  sceneTitle,
  sceneUrl,
  choices,
  isLastNarrative,
  order,
  onChapterEnd,
  onNextDialog,
}: Readonly<GameScreenProps>) {
  const navigation = useNavigation();
  const [showChoice, setShowChoice] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isLoading = useLoadingState(["/"]); // Loại trừ path "/" (trang chủ)

  const handleBack = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmBack = () => {
    window.location.href = "/";
  };

  const handleCancelBack = () => {
    setShowConfirmDialog(false);
  };

  const handleNext = () => {
    if (isLastNarrative) {
      if (choices.length > 0) {
        setShowChoice(true);
      } else {
        onChapterEnd();
      }
    } else {
      onNextDialog(order);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <ButtonText 
        onClick={handleBack}
        text="Back to Stories"
        position="top-left"
      />

      <img
        className="brightness-80 bg-slate relative h-full w-full border-none object-cover"
        src={"data:image/png;base64,"+sceneUrl}
        alt={sceneTitle ?? "No image available."}
      />
      {showChoice && choices.length > 0 && <ChoicePanel choices={choices} />}
      <TextPanel
        isNarrator={isNarrator}
        characterName={characterName}
        characterUrl={characterUrl}
        dialog={dialog}
        isLoading={isLoading}
        haveChoicesShown={showChoice}
        onNext={handleNext}
      />
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelBack}
        onConfirm={handleConfirmBack}
        title="Quit Game"
        message="Are you sure you want to quit?"
      />
    </div>
  );
}