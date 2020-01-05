import { WeaponChoice } from "./WeaponChoice";
import { UiScene } from "../game/UiScene";

export class WeaponChoiceScreen {

    private readonly rowSpace = 30;
    private weaponChoiceRows: WeaponChoiceRow[]
    private titleLabel: Phaser.GameObjects.Text;
    private backgroundRectangle: Phaser.GameObjects.Rectangle;

    public initialise(uiScene: UiScene, weaponChoice: WeaponChoice[]): WeaponChoiceScreen {

        this.backgroundRectangle = uiScene.add.rectangle(
            0,
            0,
            uiScene.cameras.main.width * 2,
            uiScene.cameras.main.height * 2,
            0x666666,
            0x666666)
            .setDepth(9);
        this.titleLabel = uiScene.add.text(0, 100, "Weapon Selection").setDepth(10);
        this.titleLabel.x = (uiScene.cameras.main.width/ 2) - (this.titleLabel.displayWidth / 2);

        const rows: WeaponChoiceRow[] = [];
        let offsetY = 200;
        weaponChoice.forEach(wc => {
            rows.push(WeaponChoiceRow.create(this, uiScene, wc, offsetY));
            offsetY += this.rowSpace;
        });
        this.weaponChoiceRows = rows;

        return this;
    }

    public visible(visible: boolean) {
        this.titleLabel.visible = visible;
        this.backgroundRectangle.visible = visible;
        this.weaponChoiceRows.forEach(wc => wc.visible(visible));
    }

    public isVisible(): boolean {
        return this.titleLabel.visible;
    }

}

class WeaponChoiceRow {

    private readonly rowRectangle: Phaser.GameObjects.Rectangle;
    private readonly nameLabel: Phaser.GameObjects.Text;
    private readonly descriptionLabel: Phaser.GameObjects.Text;
    private readonly weaponChoice: WeaponChoice;

    public constructor(rowRectangle: Phaser.GameObjects.Rectangle, nameLabel: Phaser.GameObjects.Text, descriptionLabel: Phaser.GameObjects.Text, weaponChoice: WeaponChoice) {
        this.rowRectangle = rowRectangle;
        this.nameLabel = nameLabel;
        this.descriptionLabel = descriptionLabel;
        this.weaponChoice = weaponChoice;
    }

    public visible(visible: boolean) {
        this.rowRectangle.visible = visible;
        this.nameLabel.visible = visible;
        this.descriptionLabel.visible = visible;
    }

    public static create(weaponChoiceScreen: WeaponChoiceScreen, uiScene: UiScene, weaponChoice: WeaponChoice, offsetY: number) {
        const rowRectangle = uiScene.add.rectangle(200, offsetY, uiScene.cameras.main.width * 2, 60, 0x666666).setDepth(9);
        const nameLabel = uiScene.add.text(140, offsetY, weaponChoice.name).setDepth(10);
        const descriptionLabel = uiScene.add.text(400, offsetY, weaponChoice.description).setDepth(10);

        const row = new WeaponChoiceRow(rowRectangle, nameLabel, descriptionLabel, weaponChoice);

        rowRectangle.setInteractive();
        rowRectangle.on('pointerdown', function (pointer: Phaser.Input.Pointer) {

            if (pointer && pointer.leftButtonDown() && row.rowRectangle.visible) {
                console.log(row.weaponChoice.name);
                weaponChoiceScreen.visible(false);
            }
        });

        return row;
    }
}
