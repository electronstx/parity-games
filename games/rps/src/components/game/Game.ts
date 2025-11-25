import { Application } from 'pixi.js';
import { GameScene } from './scenes/game-scene.js';
import { ScaleManager } from "./utils/scale.js";

export class Game {
	#app!: Application;
	#gameScene!: GameScene;
	#sceneReady!: Promise<GameScene>;
	#scaleManager!: ScaleManager;

	async init(parent: HTMLDivElement) {
		this.#app = new Application();

		this.#sceneReady = (async () => {
			await this.#app.init({
				backgroundColor: 0x000000,
				resolution: window.devicePixelRatio || 1,
				autoDensity: true,
				preference: 'webgl',
				resizeTo: parent
			});

			parent.appendChild(this.#app.canvas);

			this.#scaleManager = new ScaleManager(this.#app, parent, 1280, 768, 'contain');

			this.#gameScene = new GameScene(this.#app, this.#scaleManager.scale);
			await this.#gameScene.create();
			this.#app.stage.addChild(this.#gameScene);

			this.#scaleManager.onResize((scale, w, h) => {
				this.#gameScene.onResize(scale, w, h);
			});

			return this.#gameScene;
		})();

		await this.#sceneReady;
		return this;
	}

	get scene(): GameScene {
		return this.#gameScene;
	}

	get whenReady(): Promise<GameScene> {
		return this.#sceneReady;
	}

	async emit(event: string, payload?: unknown) {
		const scene = await this.whenReady;
		if (scene?.app) {
			scene.app.stage.emit(event, payload);
		}
	}

	async on(event: string, listener: (event: unknown) => void): Promise<void> {
		const scene = await this.whenReady;
		if (scene?.app) {
			scene.app.stage.on(event, listener);
		}
	}

	async once(event: string, listener: (event: unknown) => void): Promise<void> {
		const scene = await this.whenReady;
		if (scene?.app) {
			scene.app.stage.once(event, listener);
		}
	}

	async off(event: string, listener: (event: unknown) => void): Promise<void> {
		const scene = await this.whenReady;
		if (scene?.app) {
			scene.app.stage.off(event, listener);
		}
	}

	destroy() {
		if(this.#app){
			this.#app.destroy();
		}
	}
}