import { Combatant } from "./Combatant";

export class Team {

    private lastCombatant: Combatant = null;

    name: string;

    combatants: Combatant[] = [];
    colour: string = "#ffffff";

    fetchRemainingCombatants(): Combatant[] {
        return this.combatants.filter(c => !c.dead);
    }

    /**
     * Fetches the combatant in this team due to have their turn next.
     * A combatant will be alive. If no such combatant is found null is returned.
     * Calling this method increments the internal combatant counter.
     */
    fetchNextCombatant(): Combatant {

        if (!this.lastCombatant) {
            this.lastCombatant = this.combatants[0];
        }
        else {
            let nextCombatant: Combatant = null;
            const startIndex = this.combatants.indexOf(this.lastCombatant);
            let i = startIndex + 1;
            while (!nextCombatant) {
                if (i === this.combatants.length) {
                    i = 0;
                }
                const combatant = this.combatants[i];
                if (combatant === this.lastCombatant) {
                    // there are no more combatants, exit
                    return null;
                }
                else if (!combatant.dead) {
                    nextCombatant = combatant;
                }
                i++;
            }
            this.lastCombatant = nextCombatant;
        }
        return this.lastCombatant;
    }
}