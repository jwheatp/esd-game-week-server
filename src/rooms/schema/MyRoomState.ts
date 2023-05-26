import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;

  hasFinished: boolean = false;

  trapPositions: { x: number; y: number }[];
  trapNames: string[];

  @type("string") animation: string;

  inputQueue: any[] = [];
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
