import axios from "axios";
import { createCanvas, loadImage, Image } from "canvas";
import { writeFileSync } from "fs";
import path from "path";
import { userModel } from "_database/models/UserModel";

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
  const data = await authorize(cookie, phone);
  const token = await getToken(data.get("access_token"));
  const sub = await getUserInfo(data.get("access_token"), token);
  const store = await getWeapons(data.get("access_token"), token, sub);
  const weaponList = await getWeaponList();

  const levels = weaponList.flatMap((gun) => gun.levels);

  const skins = store.map((uuid) => {
    return levels.find((level) => level.uuid === uuid)!;
  });

  const canvas = createCanvas(1280, 720);
  const context = canvas.getContext("2d");
  context.fillStyle = "#000000";
  const background = await loadImage(
    "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs3/151516766/original/8a39eb87560715d09d8574caca74fd63f870eace/sell-custom-valorant-stinger-transition.png"
  );
  context.drawImage(background, 0, 0, 1280, 720);

  const pistols = ["Sheriff", "Classic", "Frenzy", "Ghost", "Shorty"];

  await Promise.all(
    skins.map(async (skin, index) => {
      const indexHeight = index * 200 + 50;
      const { displayName, displayIcon } = skin;
      const [name] = displayName.split(" ");

      const image = await loadImage(displayIcon);
      const width = 400;
      const aspectRatio = (image.height / image.width) * width;
      const classicAspectRatio = (image.height / image.width) * 250;

      if (pistols.includes(name)) {
        if (name == "Classic") {
          context.drawImage(image, 250, indexHeight, width, classicAspectRatio);
        } else if (name == "Sheriff") {
          context.drawImage(image, 250, indexHeight, width, aspectRatio);
        } else {
          context.drawImage(image, 250, indexHeight, width, aspectRatio);
        }
        return;
      } else {
        context.drawImage(image, 250, indexHeight, width, aspectRatio);
      }
    })
  );
  const buffer = canvas.toBuffer("image/jpeg");
  const dir = path.resolve(__dirname, "../dump");
  writeFileSync(`${dir}/${phone}.jpeg`, buffer);
  return skins;
};

// main("", "");
export default main;
