import { MessageType, WA, WAChat } from "@adiwajshing/baileys";
import { userModel } from "@database/models/UserModel";
import WhatsAppConversation from "..";

import WhatsAppConnection from "../../config/WhatsAppConnection";

class FirstContact {
  private static client = new WhatsAppConnection();

  public static async firstContactHandler(phone: string) {
    const contact = await userModel.findUser(phone);

    console.log(this.client.conn.state);

    try {
      await this.client.conn.sendMessage(
        phone,
        "teste vindo do bot",
        MessageType.text
      );
      console.log("aa");
    } catch (err) {
      if (err) throw err;
      console.log(err);
    }
  }

  public static async second() {
    console.log("DENTRO DO s");
  }
}

export default FirstContact;
