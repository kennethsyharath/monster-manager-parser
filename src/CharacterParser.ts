import { Character } from '@dev-alyssa/monster-lib';

export interface CharacterParser {
  parse(str: string): Character;
}
