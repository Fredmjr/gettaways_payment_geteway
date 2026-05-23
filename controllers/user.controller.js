import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { encryptJWT } from "../middleware/jwe/encrypt.js";
import userModel from "../models/user.model.js";

dotenv.config();

export const crtusrUrl = async (req, res) => {
  try {
    const uuid = uuidv4();
    const usr_id_crtd = await userModel.create({
      usr_id: uuid,
    });
    console.log(usr_id_crtd);
    if (usr_id_crtd) {
      const token = {
        ky: uuid,
      };
      const secretKey = Buffer.from(process.env.SECRETHEX, "hex");
      const l = await encryptJWT(token, secretKey);

      if (l) {
        console.log(l);
        res.status(200).json({
          usr_id_tkn: l,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};
