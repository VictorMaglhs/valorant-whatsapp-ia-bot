import { getRepository } from "typeorm";
import { User } from "@entitys/UserEntity";
import Model from "@models/Model";

export const userModel = new Model(User);

userModel.create({ phone: 123 });
