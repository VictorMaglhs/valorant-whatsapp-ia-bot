import {
  WAConnection,
  ReconnectMode,
  waChatKey,
  WAConnectOptions,
  DisconnectReason,
  WAOpenResult,
  MessageType,
  WAChatUpdate,
  WAChat,
} from "@adiwajshing/baileys";

import { writeFileSync, unlink, existsSync } from "fs";

const la = "./src/whatsapp/config/ConnectionCredentials.json";

class WhatsAppConnection {
  public conn = new WAConnection();
  private authCredentials: string;
  private autoReconnect: ReconnectMode = 1;
  private connectOptions: WAConnectOptions["maxRetries"] = 10;
  private chatOrderingKey: WAConnection["chatOrderingKey"] = waChatKey(true);

  constructor(authCredentials: string) {
    this.authCredentials = authCredentials;
  }

  private async storeCredentials(authCredentials: string) {
    writeFileSync(
      "./src/whatsapp/config/ConnectionCredentials.json",
      authCredentials
    );
  }

  public async openConnection(): Promise<WAOpenResult | undefined> {
    this.autoReconnect;
    this.connectOptions;
    this.chatOrderingKey;

    if (la) {
      this.conn.loadAuthInfo(la);
      return await this.conn.connect();
    } else {
      await this.conn.connect();
      const credentials = this.conn.base64EncodedAuthInfo();
      this.storeCredentials(JSON.stringify(credentials, null, "\t"));
    }
  }

  public async newConversation() {
    this.conn.on("chat-update", async (chat: WAChat) => {
      if (chat.messages == undefined) return;

      const m = chat.messages.all()[0];
      // if (m.key.fromMe) return;
      const messageContent = m.message?.conversation;

      if (!messageContent || m.key.fromMe) return;
      console.log("chat", chat.presences?.name);
      console.log("key ", m.key);
      console.log(`mensagem: ${messageContent}`);

      //console.log(messageContent);

      // if (sender == "554197212482@s.whatsapp.net") {
      //   await this.conn.sendMessage(sender, "porra e essa", messageType.);
      // }
    });
  }
}

export default WhatsAppConnection;
