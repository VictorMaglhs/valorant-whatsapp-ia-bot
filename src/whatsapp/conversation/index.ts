import WhatsAppConnection from "../config/WhatsAppConnection";

class WhatsAppConversation {
  private client: WhatsAppConnection;

  constructor(client: WhatsAppConnection) {
    this.client = client;
  }

  private async connect() {
    return await this.client.openConnection();
  }

  public async onNewChat() {
    this.connect();
  }
}

export default WhatsAppConversation;
