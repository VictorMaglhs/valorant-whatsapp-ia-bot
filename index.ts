import WhatsAppConversation from "./src/whatsapp/conversation/index";
import dbConnection from "./src/typeorm/connection";

const x = async () => {
	await dbConnection();

	const b = new WhatsAppConversation();
	await b.connect();
	b.conversation();
};

x();
