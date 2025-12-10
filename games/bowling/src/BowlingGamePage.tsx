import { CreateForm, FooterPanel, GameContainer, HeaderPanel, SoundSettings } from "@parity-games/ui";
import { useSoundSettings } from "./utils/hooks/useSoundSettings.js";
import { useBowlingGame } from "./utils/hooks/useBowlingGame.js";
import { BowlingGameSettings } from "./components/ui/features/BowlingGameSettings/BowlingGameSettings.js";

export const BowlingGamePage = () => {
    const { soundSettings, toggleSound, toggleMusic } = useSoundSettings();
    const { createGame, startGame, isGameStarted } = useBowlingGame();

    return (
        <>
            <HeaderPanel title={'Bowling'}>
                <SoundSettings 
                    settings={soundSettings}
                    onToggleSound={toggleSound}
                    onToggleMusic={toggleMusic}
                />
            </HeaderPanel>
            {!isGameStarted && (
                <CreateForm>
                    <BowlingGameSettings onStart={startGame} />
                </CreateForm>
            )}
            <GameContainer createGame={createGame}/>
            <FooterPanel />
        </>
    );
};