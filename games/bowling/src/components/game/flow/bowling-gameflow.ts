import { Gameflow, GameData, GameEvents } from "@parity-games/core";
import BowlingGameData from "../data/bowling-game-data.js";
import { isBowlingGameSettings } from "../utils/guards.js";
import { IBowlingScene } from "../view/types.js";

export default class BowlingGameflow extends Gameflow {
    #scene: IBowlingScene;
    #roundCompletedEmitted: boolean = false;
    #ballWasLaunched: boolean = false;

    constructor(gameData: GameData, scene: IBowlingScene) {
        super(gameData, scene);
        this.#scene = scene;
    }

    override setGameSettings(gameSettings: any): void {
        if (isBowlingGameSettings(gameSettings)) {
            this.gameData.setGameSettings(gameSettings);
            (this.gameData as BowlingGameData).initializeFrames();
        }
    }

    override startGame(): void {
        const gData = this.gameData.getGameData();
        this.#scene.initHUD(gData.numberOfFrames, gData.playerScore, gData.opponentScore);
        this.#scene.showStartGame();
        this.#updateScoreboard();
    }

    override startRound(roundNumber: number): void {
        const gameData = this.gameData as BowlingGameData;
        const currentPlayer = gameData.getCurrentPlayer();
        const shouldResetAllPins = gameData.shouldResetAllPins();
        
        this.#scene.showRound(roundNumber, currentPlayer, shouldResetAllPins); 
        
        this.#updateScoreboard();
        
        this.#roundCompletedEmitted = false;
        this.#ballWasLaunched = false;
    }

    override showRoundResult(...args: any[]): void {
        const resultData = args[0];
        const gameData = this.gameData as BowlingGameData;
        
        if (resultData && resultData.pinsKnockedDown !== undefined) {
            if (!gameData.canProcessThrowResult()) {
                return;
            }
            
            gameData.setThrowResult(resultData.pinsKnockedDown);
            
            const endGameResult = gameData.checkEndGame();
            if (endGameResult) {
                this.#scene.showRoundResult(this.gameData.getRoundResultData());
                this.#updateScoreboard();
                this.#scene.stopGameLoop();
                setTimeout(() => {
                    this.#scene.app.stage.emit(GameEvents.GAME_END, endGameResult);
                }, 2000);
                return;
            }
            
            this.#scene.showRoundResult(this.gameData.getRoundResultData());
            this.#updateScoreboard();
            
            setTimeout(() => {
                this.#scene.app.stage.emit(GameEvents.ROUND_STARTED);
            }, 2000);
        } else {
            this.#scene.showRoundResult(this.gameData.getRoundResultData());
            this.#updateScoreboard();
        }
    }

    override showEndGame(result: any, timescale?: number): void {
        this.#scene.stopGameLoop();
        this.#scene.showEndGame(result, timescale);
        this.#updateScoreboard();
    }

    override restartGame(): void {
        this.#scene.stopGameLoop();
        this.gameData.resetData();
        this.#scene.restartGame();
        this.#updateScoreboard();
    }

    #updateScoreboard(): void {
        const scoreboardData = (this.gameData as BowlingGameData).getScoreboardData();
        this.#scene.updateScoreboard(scoreboardData);
    }

    protected override setupCustomEventHandlers(): void {
        const userInputHandler = (data: { angle: number }) => {
            if (!this.#ballWasLaunched) {
                this.#scene.launchBall(data.angle);
            }
        };
        this.subscribe('USER_INPUT_BALL_LAUNCH', userInputHandler);
        
        const ballStoppedHandler = () => {
            if (!this.#ballWasLaunched || this.#roundCompletedEmitted) {
                return;
            }
            this.#scene.onBallStopped();
        };
        this.subscribe('BALL_STOPPED', ballStoppedHandler);
        
        const ballLaunchedHandler = () => {
            this.#ballWasLaunched = true;
        };
        this.subscribe('BALL_LAUNCHED', ballLaunchedHandler);
        
        const pinsSettledHandler = (data: { pinsKnockedDown: number, totalKnockedDown: number }) => {
            if (this.#roundCompletedEmitted) {
                return;
            }
            
            this.#roundCompletedEmitted = true;
            this.#ballWasLaunched = false;
            
            this.#scene.app.stage.emit(GameEvents.ROUND_COMPLETED, {
                pinsKnockedDown: data.pinsKnockedDown
            });
        };
        this.subscribe('PINS_SETTLED', pinsSettledHandler);
    }

    cleanupEventHandlers(): void {
        super.cleanupEventHandlers();
    }
}