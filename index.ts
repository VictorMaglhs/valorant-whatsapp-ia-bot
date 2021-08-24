import dbConnection from "@database/connection";
import { User } from "@entitys/UserEntity";
import Model from "@methods/Model";
import WhatsAppConnection from "src/whatsapp/config/WhatsAppConnection";
import { userModel } from "@methods/UserModel";
import WhatsAppConversation from "src/whatsapp/conversation";

const x = async () => {
  await dbConnection();
  const a = new WhatsAppConnection("");
  a.openConnection();
  a.newConversation();
};

x();
