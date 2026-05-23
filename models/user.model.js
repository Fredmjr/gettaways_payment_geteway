import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const userModel = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usr_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default userModel;
