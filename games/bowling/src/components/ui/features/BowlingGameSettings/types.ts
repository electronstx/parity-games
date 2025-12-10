import { BowlingGameSettings } from "../../../game/types";

export type BowlingGameSettingsProps = {
    onStart: (settings: BowlingGameSettings) => void | Promise<void>;
    disabled?: boolean;
};