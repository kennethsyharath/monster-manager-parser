import { JsonCharacterParser } from '../JsonCharacterParser';
import * as fs from 'fs';
import * as path from 'path';

let fileDat:string;
let statIds = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma"
];

beforeAll(() => {
  fileDat = fs.readFileSync(path.join(__dirname, './assets/BasicMonster.json'),
    {encoding: 'utf8'});
});

test('parse returns defined character', () => {
  const parser = new JsonCharacterParser();
  const char = parser.parse(fileDat);

  expect(char).toBeDefined();
});

test ('parse initializes stats properly', () => {
  const parser = new JsonCharacterParser();
  const char = parser.parse(fileDat);

  expect(char.getStat("strength")).toBe(10);
  expect(char.getStat("dexterity")).toBe(10);
  expect(char.getStat("constitution")).toBe(10);
  expect(char.getStat("intelligence")).toBe(10);
  expect(char.getStat("wisdom")).toBe(10);
  expect(char.getStat("charisma")).toBe(10);
});

test ('parse initializes actions properly', () => {
  const parser = new JsonCharacterParser();
  const char = parser.parse(fileDat);

  expect(char.actions.has("greatsword")).toBeTruthy();
  expect(char.actions.has("scorching_ray")).toBeTruthy();

  expect(char.actions.get("greatsword")?.iterations ?? undefined).toBe(2);
  expect(char.actions.get("scorching_ray")?.iterations ?? undefined).toBe(3);

  expect(char.actions.get("greatsword")?.rolls.get("attack")?.bonus ?? undefined).toStrictEqual(0);
  expect(char.actions.get("greatsword")?.rolls.get("attack")?.diceToRoll ?? undefined).toStrictEqual([20]);
  expect(char.actions.get("greatsword")?.rolls.get("damage")?.bonus ?? undefined).toStrictEqual(0);
  expect(char.actions.get("greatsword")?.rolls.get("damage")?.diceToRoll ?? undefined).toStrictEqual([4,4]);
  expect(char.actions.get("greatsword")?.rolls.get("speed")?.bonus ?? undefined).toStrictEqual(0);
  expect(char.actions.get("greatsword")?.rolls.get("speed")?.diceToRoll ?? undefined).toStrictEqual([10]);

  expect(char.actions.get("scorching_ray")?.rolls.get("attack")?.bonus ?? undefined).toStrictEqual(0);
  expect(char.actions.get("scorching_ray")?.rolls.get("attack")?.diceToRoll ?? undefined).toStrictEqual([20]);
  expect(char.actions.get("scorching_ray")?.rolls.get("damage")?.bonus ?? undefined).toStrictEqual(0);
  expect(char.actions.get("scorching_ray")?.rolls.get("damage")?.diceToRoll ?? undefined).toStrictEqual([6,6]);
  expect(char.actions.get("scorching_ray")?.rolls.get("speed")?.bonus ?? undefined).toStrictEqual(0);
  expect(char.actions.get("scorching_ray")?.rolls.get("speed")?.diceToRoll ?? undefined).toStrictEqual([12]);

  expect(char.perform("greatsword")?.length).toBe(2);
  expect(char.perform("scorching_ray")?.length).toBe(3);
});
