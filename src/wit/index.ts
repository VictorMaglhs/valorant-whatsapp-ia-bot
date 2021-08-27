import { Wit, WitContext } from "node-wit";

class WitConnection {
  public static async handleMessage(text: string) {
    const client = new Wit({
      accessToken: `${process.env.WIT_SERVER_TOKEN}`,
    });

    await client.message(text, {}).then(({ entities, intents, traits }) => {
      console.log(intents);
      console.log(entities);
      console.log(traits);
    });
  }
}

export default WitConnection;
