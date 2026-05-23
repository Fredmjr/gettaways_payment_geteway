import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const paymentModel = sequelize.define("payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usr_payment_id: {
    //same as lenco_payment_reference im sure - custom reference lookup variable for webhooks
    type: DataTypes.TEXT,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  operator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "zm",
  },
  bearer: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "customer",
  },
  payment_sttus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lenco_payment_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lenco_payment_initiatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  lenco_payment_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  lenco_payment_currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: "ZMW",
  },
  lenco_payment_reference: {
    //same as usr_payment_id im sure - custom reference lookup variable for webhooks
    type: DataTypes.STRING,
    allowNull: false,
  },
  lenco_payment_lencoReference: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lenco_payment_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "mobile-money",
  },
  lenco_payment_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pay-offline",
  },
  lenco_payment_source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "api",
  },
});

export default paymentModel;
