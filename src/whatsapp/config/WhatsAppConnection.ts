import { WAConnection, DisconnectReason } from "@adiwajshing/baileys";
import { credentialsModel } from "@models/CredentialsModel";

class WhatsAppConnection {
  public conn = new WAConnection();

  // # ARMAZENAR CREDENDIAIS
  private async storeCredentials(
    client_id: string,
    server_token: string,
    client_token: string,
    enc_key: string,
    mac_key: string
  ) {
    const getCredentials = await credentialsModel.select(1);

    const credentialsData = {
      id: 1,
      client_id,
      server_token,
      client_token,
      enc_key,
      mac_key,
    };

    if (!getCredentials) {
      console.log("---------> CRIOU CREDENCIAIS");

      credentialsModel.create(credentialsData);
    } else {
      console.log("---------> ATUALIZOU CREDENCIAIS");
      credentialsModel.update(credentialsData, { id: 1 });
    }
  }

  // # GERAR CREDENCIAIS
  public async generateCredentials() {
    this.conn.connectOptions.maxRetries = 3;
    this.conn.connectOptions.queryChatsTillReceived = true;
    this.conn.clearAuthInfo();
    await this.conn.connect();

    const authTokens = this.conn.base64EncodedAuthInfo();

    this.storeCredentials(
      authTokens.clientID,
      authTokens.serverToken,
      authTokens.clientToken,
      authTokens.encKey,
      authTokens.macKey
    );
  }

  // CONECTAR
  public async connect() {
    const getCredentials = await credentialsModel.select(1);
    console.log(getCredentials);

    this.conn.on(
      "close",
      async (err: { reason: DisconnectReason; isReconnecting: boolean }) => {
        return await this.generateCredentials();
      }
    );

    if (!getCredentials) await this.generateCredentials();
    const credentials = {
      clientID: `${getCredentials!.client_id}`,
      serverToken: `${getCredentials!.server_token}`,
      clientToken: `${getCredentials!.client_token}`,
      encKey: `${getCredentials!.enc_key}`,
      macKey: `${getCredentials!.mac_key}`,
    };
    this.conn.loadAuthInfo(credentials);
    await this.conn.connect();
  }
}

export default WhatsAppConnection;
