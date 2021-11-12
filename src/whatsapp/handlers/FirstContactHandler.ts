import { MessageType, WA, WAChat } from "@adiwajshing/baileys";
import { userModel } from "_models/UserModel";
import WhatsAppConversation from "../conversation";

import WhatsAppConnection from "../config/WhatsAppConnection";

class FirstContact {
  private static client = new WhatsAppConversation();

  // public static async firstContactHandler(phone: string) {
  //   try {
  //     await this.client.sendMessage(
  //       phone,
  //       "teste vindo do bot",
  //       MessageType.text
  //     );
  //     console.log("aa");
  //   } catch (err) {
  //     if (err) throw err;
  //     console.log(err);
  //   }
  // }

  public static async second() {
    console.log("DENTRO DO s");
  }
}

export default FirstContact;
