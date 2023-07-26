import { MessageType, WAChat } from "@adiwajshing/baileys";

import { BotStep } from "_types/Step";
import WhatsAppConnection from "../config/WhatsAppConnection";
import { main } from "src/valorant/RegisterRequest";
import { readFileSync } from "fs";
import path from "path";
import { userModel } from "_models/UserModel";

class WhatsAppConversation {
	private client = new WhatsAppConnection();

	public async connect() {
		this.client.connect();
	}

	private async getUserStep(sender: string): Promise<number> {
		const user = await userModel.select({ phone: sender });
		if (!user) {
			console.log("chegou aqui");

			await userModel.create({ step: 0, phone: sender });
			const step: any = await userModel.select({ phone: sender });
			return step.step;
		} else {
			console.log("agr la");
			const user: any = await userModel.select({ phone: sender });

			return user.step;
		}
	}

	public async conversation() {
		this.client.conn.on("chat-update", async (chat: WAChat) => {
			if (!chat.messages) return;
			const message = chat.messages.all()[0];
			const sender = message.key.remoteJid!;

			const configuration =
				!message ||
				message.status ||
				message.key.participant ||
				message.status > 0 ||
				message.key.fromMe ||
				sender == "status";
			if (configuration) return;

			const msg = message.message?.conversation!;

			const step = await this.getUserStep(sender);

			if (step == BotStep.FIRST_CONTACT || !step) {
				// FirstContact.firstContactHandler(sender);
				await this.client.conn.sendMessage(
					sender,
					"FAAAALA, beleza? Ta afim de saber sua loja?? Então primeiro vou precisar que você logue por aqui mesmo! Dessa forma: \n\n*usuario senha*\n\n(Você só precisa logar uma vez, depois só me manda um oi que ta tudo certo)\n\n ̿̿ ̿̿ ̿̿ ̿'̿'̵͇̿̿з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿",
					MessageType.text
				);
				console.log(step);
				return await userModel.update({ phone: sender }, { step: 1 });
			}

			if (step == BotStep.REGISTRATION) {
				// FirstContact.firstContactHandler(sender);
				const response = await main(msg!, sender.split("@")[0]);
				const skins = response.map((parameters) => {
					return parameters.displayName + "\n";
				});
				await this.client.conn.sendMessage(
					sender,
					`AQUI TAO SUAS SKINS CORRE PRA COMPRAR!!🔫🔫 \n\n${skins.join(
						""
					)}`,
					MessageType.text
				);
				const dir = path.resolve(__dirname, "../../dump");
				console.log(dir);
				const skinPng = readFileSync(
					`${dir}/${sender.split("@")[0]}.jpeg`
				);
				return await this.client.conn.sendMessage(
					sender,
					skinPng,
					MessageType.image
				);
			}
		});
	}
}

export default WhatsAppConversation;
