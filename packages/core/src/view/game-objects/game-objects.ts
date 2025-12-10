import type { GameObject } from "./types";

export class GameObjects {
    #objects: Array<GameObject> = [];

    addObject(object: GameObject): void {
        this.#objects.push(object);
    }

    create(...args: any[]): void {
        this.#objects.forEach(obj => obj.create(...args));
    }

    show(): void {
        this.#objects.forEach(obj => obj.show?.());
    }

    hide(): void {
        this.#objects.forEach(obj => obj.hide?.());
    }

    update(): void {
        this.#objects.forEach(obj => obj.update?.());
    }

    reset(): void {
        this.#objects.forEach(obj => obj.reset?.());
    }

    destroy(): void {
        this.#objects.forEach(obj => obj.destroy?.());
    }
}