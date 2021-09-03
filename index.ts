import dbConnection from "@database/connection";

import WhatsAppConnection from "src/whatsapp/config/WhatsAppConnection";
import { userModel } from "@models/UserModel";
import WhatsAppConversation from "src/whatsapp/conversation";
// import WhatsAppConversation from "src/whatsapp/conversation";

const x = async () => {
  await dbConnection();

  const b = new WhatsAppConversation();
  await b.connect();
  b.conversation();
};

x();
