import { BackgroundRenderer } from "../scenery/BackgroundRenderer";
import { SkyBackgroundRenderer } from "../scenery/SkyBackgroundRenderer";
import { SimulationState } from "./SimulationState";
import { Team } from "../Team";
import { Combatant } from "../Combatant";
import { KeyEvent, State } from "../messageBus/KeyEvent";
import { PointerState } from "../messageBus/PointerState";
import { MessageBus } from "../messageBus/messageBus";
import { SineWaveTerrainGenerator } from "../terrainGeneration/SineWaveTerrainGenerator";

export class GameScene extends Phaser.Scene {
    private backgroundRenderer: BackgroundRenderer;
    private messageBus: MessageBus;
    private keyEvents: KeyEvent[] = [];

    /**
     * Indicates if the camera is being dragged.
     */
    private dragMode: boolean = false;
    private lastDragPosition = { x: 0, y: 0 };
    private selectedArrowSprite: Phaser.GameObjects.Sprite;
    private selectedArrowOffsetY = -65;

    constructor() {
        super('GameScene');
    }

    public preload() {

        SimulationState.current().gameScene = this;

        this.load.image("foreground", `assets/${SimulationState.current().foreground}`);
        this.load.image("lizard", "assets/lizard.png");
        this.load.image("smoke", "assets/white-smoke.png");
        this.load.image("yellow", "assets/yellow.png");
        this.load.image("bazookaRocket", "assets/bazookaRocket.png");
        this.load.image("selectArrow", "assets/selectArrow.png");

        this.cameras.main.setViewport(0, 0, 1000, 1000);
    }

    public create() {

        this.messageBus = SimulationState.current().messageRegister as MessageBus;

        this.backgroundRenderer = new SkyBackgroundRenderer();
        this.selectedArrowSprite = this.add.sprite(0, 0, "selectArrow").setScale(0.5);

        this.render();

        const team1 = new Team();
        team1.name = "Team 1";
        team1.colour = "#FF0000";
        const team2 = new Team();
        team2.name = "Team 2";
        team2.colour = "#0000FF";

        SimulationState.current().teams.push(team1);
        SimulationState.current().teams.push(team2);

        SimulationState.current().lizards.push(new Combatant().initialise(this, 100, 200, team1));
        SimulationState.current().lizards.push(new Combatant().initialise(this, 200, 400, team1));
        SimulationState.current().lizards.push(new Combatant().initialise(this, 325, 350, team1));
        SimulationState.current().lizards.push(new Combatant().initialise(this, 465, 100, team2));
        SimulationState.current().lizards.push(new Combatant().initialise(this, 700, 320, team2));
        SimulationState.current().lizards.push(new Combatant().initialise(this, 815, 360, team2));

        SimulationState.current().selectedLizard = SimulationState.current().lizards[0];

        new SineWaveTerrainGenerator().generate(SimulationState.current());

        this.physics.world.on('collide', (body: Phaser.Physics.Impact.Body, other: Phaser.Physics.Impact.Body, axis: string) => {

            const p1 = SimulationState.current().fetchProjectile(body);
            const p2 = SimulationState.current().fetchProjectile(other);
            const projectile = p1 ? p1 : p2;

            if (projectile) {

                const l1 = SimulationState.current().fetchCombatant(body);
                const l2 = SimulationState.current().fetchCombatant(other);
                const combatant = l1 ? l1 : l2;

                if (combatant) {
                    projectile.onCombatantCollision(combatant, SimulationState.current());
                }
                else {
                    const dt1 = SimulationState.current().fetchTerrainFromBody(body);
                    const dt2 = SimulationState.current().fetchTerrainFromBody(body);
                    const destructibleTerrain = dt1 ? dt1 : dt2;

                    if (destructibleTerrain) {
                        projectile.onTerrainCollision(destructibleTerrain, SimulationState.current());
                    }
                }
            }

        });

        const gameScene = this;
        this.input.keyboard.on('keydown', function (event: KeyboardEvent) {
            gameScene.keyEvents.push(new KeyEvent(event.code, State.DOWN, event.ctrlKey, event.shiftKey));
        });
        this.input.keyboard.on('keyup', function (event: KeyboardEvent) {
            gameScene.keyEvents.push(new KeyEvent(event.code, State.UP, event.ctrlKey, event.shiftKey))
        });

        this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {

            if (pointer.middleButtonDown() && pointer) {
                gameScene.dragMode = true;
                gameScene.lastDragPosition.x = pointer.x;
                gameScene.lastDragPosition.y = pointer.y;
            }
        });

        this.input.on('pointerup', function (pointer: Phaser.Input.Pointer) {
            if (pointer.middleButtonReleased()) {
                gameScene.dragMode = false;
            }
        });

        this.input.on('wheel', function (pointer, currentlyOver, dx, dy: number, dz, event) {

            const zoomDelta = 0.2;
            if (dy < 0) {
                gameScene.cameras.main.zoom += zoomDelta;
            }
            else {
                gameScene.cameras.main.zoom -= zoomDelta;
            }
            if (gameScene.cameras.main.zoom < 0.2) {
                gameScene.cameras.main.zoom = 0.2;
            }
            else if (gameScene.cameras.main.zoom > 4) {
                gameScene.cameras.main.zoom = 4;
            }

        });

    }

    public render() {

        this.backgroundRenderer.render(SimulationState.current());

        // move selected arrow
        if (SimulationState.current().selectedLizard) {
            this.selectedArrowSprite.setVisible(true);
            this.selectedArrowSprite.setPosition(SimulationState.current().selectedLizard.x, SimulationState.current().selectedLizard.y + this.selectedArrowOffsetY);
        }
        else {
            this.selectedArrowSprite.setVisible(false);
        }
    }

    /**
     * This method is called once per game step while the scene is running.
     * 
     * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number) {

        const scene = this as Phaser.Scene;

        this.render();


        // set collisions - must be done every update
        this.physics.world.setBoundsCollision(false, false, false, false);

        // TODO: this sets every chunk of terrain for collision detection. This is very
        // expensive and is limiting potential map size. Should only set outside facing terrain
        // for collision checks
        SimulationState.current().destructibleTerrain.forEach(s => {
            SimulationState.current().lizards.forEach(l => {
                scene.physics.world.collide(s.sprite, l.sprite);
            });

            SimulationState.current().projectiles.forEach(p => {
                scene.physics.world.collide(s.sprite, p.sprite);
            });
        });

        SimulationState.current().lizards.forEach(l => {
            SimulationState.current().projectiles.forEach(p => {
                scene.physics.world.collide(l.sprite, p.sprite);
            });
        });

        // process messages

        const cursors = scene.input.keyboard.createCursorKeys();

        const x = scene.input.activePointer.x;
        const y = scene.input.activePointer.y;
        const pointerState = new PointerState(x, y);

        this.messageBus.processProducers(SimulationState.current(), this.keyEvents, cursors, pointerState);
        this.messageBus.processConsumers(SimulationState.current());

        this.keyEvents = [];


        // update combatants and projectiles
        SimulationState.current().lizards.forEach(l => {
            l.update(SimulationState.current());
        });

        SimulationState.current().projectiles.forEach(p => {
            p.update(scene);
        });

        // remove exploded projectiles
        SimulationState.current().projectiles = SimulationState.current().projectiles.filter(p => !p.exploded);

        // pan the camera
        if (this.dragMode) {
            const pointer = scene.input.activePointer;
            const deltaX = pointer.x - this.lastDragPosition.x;
            const deltaY = pointer.y - this.lastDragPosition.y;

            // TODO: this panning doesn't follow the mouse exactly if a non 1.0 scale is being used.
            scene.cameras.main.setScroll(scene.cameras.main.scrollX - deltaX, scene.cameras.main.scrollY - deltaY);

            if (scene.cameras.main.x < 0) {
                scene.cameras.main.x = 0;
            }
            if (scene.cameras.main.y < 0) {
                scene.cameras.main.y = 0;
            }

            this.lastDragPosition.x = pointer.x;
            this.lastDragPosition.y = pointer.y;
        }
    }
}