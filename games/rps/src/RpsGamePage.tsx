import { CreateForm, FooterPanel, GameContainer, HeaderPanel } from "@parity-games/ui";
import { RpsGame } from "./components/game/index.js";
import { useCallback, useRef } from "react";
import { RpsGameSettings as RpsGameSettingsType } from "./components/game/types.js";
import { RpsGameSettings } from "./components/ui/features/RpsGameSettings/RpsGameSettings.js";

export const RpsGamePage = () => {
    const gameRef = useRef<RpsGame | null>(null);
    const createGame = useCallback(() => {
        if (!gameRef.current) {
            gameRef.current = new RpsGame();
        }
        return gameRef.current;
    }, []);

    const handleStartGame = useCallback(async (settings: RpsGameSettingsType) => {
        if (gameRef.current) {
            await gameRef.current.setGameSettings(settings);
            await gameRef.current.startGame();
        }
    }, []);

    return (
        <>
            <HeaderPanel title={'Rock Paper Scissors'}/>
            <CreateForm>
                <RpsGameSettings onStart={handleStartGame} />
            </CreateForm>
            <GameContainer createGame={createGame}/>
            <FooterPanel />
        </>
    );
};