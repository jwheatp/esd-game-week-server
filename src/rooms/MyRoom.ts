import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.setSimulationInterval((deltaTime) => {
      this.update(deltaTime);
    });

    // handle player input
    this.onMessage(0, (client, data) => {
      // get reference to the player who sent the message
      const player = this.state.players.get(client.sessionId);

      player.inputQueue.push(data);
    });

    this.onMessage("trap-create", (client, message) => {
      // broadcast a message to all clients
      this.broadcast("trap-create", message);
    });

    this.onMessage("trap-move", (client, message) => {
      // broadcast a message to all clients
      this.broadcast("trap-move", message);
    });

    this.onMessage("trap-settle", (client, message) => {
      // broadcast a message to all clients
      this.broadcast("trap-settle", message);
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const mapWidth = 800;
    const mapHeight = 600;

    // create Player instance
    const player = new Player();

    // place Player at a random position
    player.x = 100;
    player.y = 430;
    player.hasFinished = false;

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  update(deltaTime: number) {
    const velocity = 2;

    this.state.players.forEach((player) => {
      let input: any;

      // dequeue player inputs
      while ((input = player.inputQueue.shift())) {
        if (input.x) {
          player.x = input.x;
        }

        if (input.y) {
          player.y = input.y;
        }

        if (input.animation) {
          player.animation = input.animation;
        }

        if (input.hasFinished) {
          player.hasFinished = input.hasFinished;
        }
      }
    });
  }
}
