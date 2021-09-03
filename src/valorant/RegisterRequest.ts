import axios from "axios";
import { createCanvas, loadImage, Image } from "canvas";
import { writeFileSync } from "fs";
import path from "path";

const getCookie = async () => {
  const response = await axios.post(
    "https://auth.riotgames.com/api/v1/authorization",
    {
      client_id: "play-valorant-web-prod",
      nonce: "1",
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
    }
  );

  const cookie = response.headers["set-cookie"];
  return cookie;
};

const authorize = async (cookie: any, login: string) => {
  const credentials = login.split(" ");

  const response = await axios.put(
    "https://auth.riotgames.com/api/v1/authorization",
    {
      type: "auth",
      username: credentials[0],
      password: credentials[1],
      method: "PUT",
    },
    {
      headers: {
        Cookie: cookie,
      },
    }
  );

  const qs = response.data.response.parameters.uri.split(
    "https://playvalorant.com/opt_in#"
  )[1];

  const params = new URLSearchParams(qs);

  return params;
};

const getToken = async (token: any) => {
  const response = await axios.post(
    "https://entitlements.auth.riotgames.com/api/token/v1",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.entitlements_token;
};

const getUserInfo = async (accessToken: any, entitlementsToken: any) => {
  const response = await axios.get("https://auth.riotgames.com/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Riot-Entitlements-JWT": entitlementsToken,
    },
  });

  return response.data.sub;
};

const getWeapons = async (
  accessToken: any,
  entitlementsToken: any,
  sub: string
): Promise<string[]> => {
  const response = await axios.get(
    `https://pd.na.a.pvp.net/store/v2/storefront/${sub}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Riot-Entitlements-JWT": entitlementsToken,
      },
    }
  );

  return response.data.SkinsPanelLayout.SingleItemOffers as string[];
};

const getWeaponList = async (): Promise<Weapon[]> => {
  const response = await axios.get(
    "https://valorant-api.com/v1/weapons/skins",
    {
      params: {
        language: "pt-BR",
      },
    }
  );

  return response.data.data as Weapon[];
};

export const main = async (login: string, phone: string) => {
  const cookie = await getCookie();
  const data = await authorize(cookie, login);
  const token = await getToken(data.get("access_token"));
  const sub = await getUserInfo(data.get("access_token"), token);
  const store = await getWeapons(data.get("access_token"), token, sub);
  const weaponList = await getWeaponList();

  const levels = weaponList.flatMap((gun) => gun.levels);

  const skins = store.map((uuid) => {
    const skin = levels.find((level) => level.uuid === uuid);
    return skin;
  });

  const canvas = createCanvas(800, 800);
  const context = canvas.getContext("2d");
  context.fillStyle = "#000000";
  const images = skins.map((image) => {
    return image!.displayIcon;
  });
  const skinNames = skins.map((parameters) => {
    return parameters!.displayName.split(" ")[0];
  });
  const background = await loadImage(
    "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs3/151516766/original/8a39eb87560715d09d8574caca74fd63f870eace/sell-custom-valorant-stinger-transition.png"
  );
  context.drawImage(background, 0, 0, 800, 800);

  const pistols = ["Sheriff", "Classic", "Frenzy", "Ghost", "Shorty"];

  // PRIMEIRA ARMA
  const skin1 = await loadImage(images[0]);
  if (pistols.includes(skinNames[0])) {
    if (skinNames[0] == "Classic") {
      context.drawImage(skin1, 350, 50, 275, 135);
    } else {
      context.drawImage(skin1, 250, 50, 400, 105);
    }
  } else {
    context.drawImage(skin1, 140, 50, 512, 120);
  }

  // SEGUNDA ARMA
  const skin2 = await loadImage(images[1]);
  if (pistols.includes(skinNames[1])) {
    if (skinNames[1] == "Classic") {
      context.drawImage(skin2, 350, 250, 275, 135);
    } else {
      context.drawImage(skin2, 250, 250, 400, 105);
    }
  } else {
    context.drawImage(skin2, 140, 250, 512, 120);
  }

  // TERCEIRA ARMA
  const skin3 = await loadImage(images[2]);
  if (pistols.includes(skinNames[2])) {
    if (skinNames[2] == "Classic") {
      context.drawImage(skin3, 350, 450, 275, 135);
    } else {
      context.drawImage(skin3, 250, 450, 400, 105);
    }
  } else {
    context.drawImage(skin3, 140, 450, 512, 120);
  }

  // QUARTA ARMA
  const skin4 = await loadImage(images[3]);
  if (pistols.includes(skinNames[3])) {
    if (skinNames[3] == "Classic") {
      context.drawImage(skin4, 350, 650, 275, 135);
    } else {
      context.drawImage(skin4, 250, 650, 400, 105);
    }
  } else {
    context.drawImage(skin4, 140, 650, 512, 120);
  }

  //RENDERIZAR CANVAS
  const buffer = canvas.toBuffer("image/jpeg");
  const dir = path.resolve(__dirname, "../dump");
  writeFileSync(`${dir}/${phone}.jpeg`, buffer);
  return skins;
};

// main("agrro2000 MARvic123.", "5531991292142");
export default main;
