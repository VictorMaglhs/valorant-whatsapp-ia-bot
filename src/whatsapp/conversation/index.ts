import { WAChat } from "@adiwajshing/baileys";
import WhatsAppConnection from "../config/WhatsAppConnection";

class WhatsAppConversation {
  private client = new WhatsAppConnection();

  public async connect() {
    this.client.connect();
  }

  public async newConversation() {
    this.client.conn.on("chat-update", async (chat: WAChat) => {
      return;
    });
  }
}

export default WhatsAppConversation;
