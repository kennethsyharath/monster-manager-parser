import { Action, Character, DndOutcomeRuleset, Roll } from '@dev-alyssa/monster-lib';
import { CharacterParser } from './CharacterParser';

export class JsonCharacterParser implements CharacterParser {

  static readonly KEY_PARSERVERSION:string = "_monsterManagerParserVersion";
  static readonly KEY_STATS:string = "stats";
  static readonly KEY_ACTIONS:string = "actions";
  static readonly KEY_ACTION_ITERATIONS:string = "iterations";
  static readonly KEY_ACTION_ROLLS:string = "rolls";
  static readonly KEY_ROLL_BONUS:string = "bonus";
  static readonly KEY_ROLL_DICE:string = "diceToRoll";

  parse(str: string): Character {
    const blob = JSON.parse(str);

    if (!this.hasValidSemVer(blob)) {
      throw new Error("Error parser version number mismatch");
    } else {
      // We now need to deconstruct the object to represent a Character
      const stats = this.extractStats(blob);
      const actions = this.extractActions(blob);
      return new Character(stats, actions);

    }
  }

  hasValidSemVer(blob:any):boolean {
    // TODO: compare semvers to get the desired result. For now not important.
    return blob[JsonCharacterParser.KEY_PARSERVERSION] !== undefined
  }

  extractStats(blob:any):[string, number][] {
    const statsblob = blob[JsonCharacterParser.KEY_STATS]
    const keys = Object.keys(statsblob);
    return keys.map((key) => [key, <number>statsblob[key]])
  }

  extractActions(blob:any):[string, Action][] {
    const actionsBlob = blob[JsonCharacterParser.KEY_ACTIONS];
    const actionIds = Object.keys(actionsBlob);

    //we need to extract more

    return actionIds.map((aId) => {
      const aBlob = actionsBlob[aId];
      const rollsBlob = aBlob[JsonCharacterParser.KEY_ACTION_ROLLS];
      const rKeys = Object.keys(rollsBlob);

      const rolls = rKeys.map((rKey) => {
        const rBlob = rollsBlob[rKey];

        return <[string, Roll]>[
          rKey, 
          new Roll(
            rBlob[JsonCharacterParser.KEY_ROLL_BONUS],
            new DndOutcomeRuleset(), // TODO: We need a Ruleset Selector/Resolver here
            ...rBlob[JsonCharacterParser.KEY_ROLL_DICE]
          )
        ];
      });

      return [
        aId, 
        new Action(
          rolls, 
          aBlob[JsonCharacterParser.KEY_ACTION_ITERATIONS]
        )
      ]
    });
       
  }
}
