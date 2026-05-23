import { initializor } from "../payment_models/lenco/initializor.js";
import paymentModel from "../models/payment.model.js";
import { v4 as uuidv4 } from "uuid";

export const initUrl = async (req, res) => {
  const { amount, phone, operator } = req.body;
  const srvr_data = {
    amount,
    phone,
    operator,
    reference: `${uuidv4()}`,
    bearer: "merchant",
    country: "zm",
  };

  try {
    const initializor_data = await initializor(srvr_data);
    console.log("initializor_data: ", initializor_data); //full boldy log
    //conection failed
    //timeouts errs & general initilizer err
    if (
      initializor_data.timeout_sttus === true ||
      initializor_data.general_timeout_sttus === true
    ) {
      const erMgs_div = `
    <div>
    <p>err_code: 004</p>
    <p>Unable to process payment ticket, contact customer service!</p>
    </div>`;
      return res.status(400).json({
        timed_out: true,
        mgs: erMgs_div,
      });
    }

    //connection established
    if (initializor_data.data.status === false) {
      //failed
      console.log(
        "payment_payment_processing_sttus: false",
        `message: ${initializor_data.data.message}`,
      );
      return res.status(400).json({
        payment_processing_sttus: false,
        erMgs: initializor_data.data.message,
      });
    } else if (initializor_data.data.status === true) {
      //wait processing
      //tasks
      console.log(initializor_data.temp_reference);
      const new_payment_record = await paymentModel.create({
        //user mobileMoneyDetails variables
        phone: phone,
        amount: amount,
        operator: operator,
        //constant variables
        usr_payment_id: initializor_data.temp_reference,
        country: "zm", //only zambia (zm) & malawi (mw) allowed
        bearer: "customer",
        payment_sttus: "Pending",
        //lenco payment details variables
        accountName: initializor_data.data.data.mobileMoneyDetails.accountName,
        lenco_payment_id: initializor_data.data.data.id,
        lenco_payment_initiatedAt: initializor_data.data.data.initiatedAt,
        lenco_payment_amount: initializor_data.data.data.amount,
        lenco_payment_currency: "ZMW",
        lenco_payment_reference: initializor_data.data.data.reference,
        lenco_payment_lencoReference: initializor_data.data.data.lencoReference,
        lenco_payment_type: "mobile-money",
        lenco_payment_status: "pay-offline",
        lenco_payment_source: "api",
      });
      if (!new_payment_record) {
        return res.status(400).json({
          erMgs: "Unable to process & configure payment request!",
        });
      }
      //response
      console.log(
        "payment_processing_sttus: true",
        `message: Process payment...`,
      );
      return res.status(200).json({
        payment_processing_sttus: true,
        mgs: "Enter PIN on your mobile phone",
        /* mgs: "Complete payment on your mobile phone", */
        chkr_usr_pymnt_id: new_payment_record.dataValues.usr_payment_id,
        chkr_lnc_pymnt_id: new_payment_record.dataValues.lenco_payment_id,
      });
      /*  return res.status(200).json({
        payment_processing_sttus: true,
      }); */
    } else {
      //general failed response
      return res.status(400).json({
        erMgs: "Unable to process payment, contact customer service!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};

//processing page
export const ckrpymntUrl = async (req, res) => {
  const { chkr_usr_pymnt_id, chkr_lnc_pymnt_id } = req.body;

  try {
    const result = await paymentModel.findOne({
      where: {
        usr_payment_id: chkr_usr_pymnt_id,
        lenco_payment_id: chkr_lnc_pymnt_id,
      },
    });
    const erMgs_div = `
    <div>
    <p>err_code: 003</p>
    <p>Unable to process payment ticket, contact customer service!</p>
    </div>`;
    if (!result) {
      return res.status(400).json({
        erMgs: true,
        mgs: erMgs_div,
      });
    }
    //pending
    if (result.dataValues.payment_sttus === "Pending") {
      console.log("pending");
      //recheck again after 10 secs if status changed to Paid
      return res.status(200).json({
        payment_paid_sttus: false,
      });
    }

    //paid
    if (result.dataValues.payment_sttus === "Paid") {
      return res.status(200).json({
        payment_paid_sttus: true,
        mgs: "Payment Completed!",
        pymnt_details_operator: result.dataValues.operator,
        pymnt_details_name: result.dataValues.accountName,
        pymnt_details_amount: result.dataValues.lenco_payment_amount,
        pymnt_details_currency: result.dataValues.lenco_payment_currency,
        pymnt_details_type: result.dataValues.lenco_payment_type,
        pymnt_details_date: result.dataValues.createdAt,
      });
    }

    console.log(chkr_usr_pymnt_id, chkr_lnc_pymnt_id);
    return res.status(200).json({
      mgs: "Unable to process request!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};

//rechecker 1 -5 secs
export const reckrpymntUrl = async (req, res) => {
  const { chkr_usr_pymnt_id, chkr_lnc_pymnt_id } = req.body;
  const result = await paymentModel.findOne({
    where: {
      usr_payment_id: chkr_usr_pymnt_id,
      lenco_payment_id: chkr_lnc_pymnt_id,
    },
  });
  const erMgs_div = `
    <div>
    <p>err_code: 003</p>
    <p>Unable to process payment ticket, contact customer service!</p>
    </div>`;
  if (!result) {
    return res.status(200).json({
      erMgs: true,
      mgs: erMgs_div,
    });
  }
  //pending
  if (result.dataValues.payment_sttus === "Pending") {
    return res.status(200).json({
      payment_paid_sttus: false,
      mgs: "Checking payment....",
    });
  }

  //paid
  if (result.dataValues.payment_sttus === "Paid") {
    return res.status(200).json({
      payment_paid_sttus: true,
      mgs: "Payment Completed!",
      pymnt_details_operator: result.dataValues.operator,
      pymnt_details_name: result.dataValues.accountName,
      pymnt_details_amount: result.dataValues.lenco_payment_amount,
      pymnt_details_currency: result.dataValues.lenco_payment_currency,
      pymnt_details_type: result.dataValues.lenco_payment_type,
      pymnt_details_date: result.dataValues.createdAt,
    });
  }

  try {
    console.log(chkr_usr_pymnt_id, chkr_lnc_pymnt_id);
    res.status(200).json({
      mgs: "Unable to process request!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};

//rechecker 2 - 15 secs
export const lastreckrpymntUrl = async (req, res) => {
  const { chkr_usr_pymnt_id, chkr_lnc_pymnt_id } = req.body;
  try {
    const result = await paymentModel.findOne({
      where: {
        usr_payment_id: chkr_usr_pymnt_id,
        lenco_payment_id: chkr_lnc_pymnt_id,
      },
    });
    const erMgs_div = `
    <div>
    <p>err_code: 003</p>
    <p>Unable to process payment ticket, contact customer service!</p>
    <br>
    <p>Payment Ticket ID (PTID): ${chkr_lnc_pymnt_id}</p>
    <p id="pymnttknIDdscptn">Copy ID above, use it to reference and track your payment status once customer service is contacted</p>
    <button id="faildpymntpg_rtrnhmBtn">home</button>
    <button id="faildpymntpg_cstmrspprtBtn">custmer support</button>
    <br>
    </div>`;
    if (!result) {
      return res.status(200).json({
        erMgs: true,
        mgs: erMgs_div,
      });
    }
    //pending
    if (result.dataValues.payment_sttus === "Pending") {
      return res.status(200).json({
        last_payment_paid_sttus: false,
        mgs: erMgs_div,
        ticket_id: chkr_lnc_pymnt_id,
      });
    }

    //paid
    if (result.dataValues.payment_sttus === "Paid") {
      return res.status(200).json({
        payment_paid_sttus: true,
        mgs: "Payment Completed!",
        pymnt_details_operator: result.dataValues.operator,
        pymnt_details_name: result.dataValues.accountName,
        pymnt_details_amount: result.dataValues.lenco_payment_amount,
        pymnt_details_currency: result.dataValues.lenco_payment_currency,
        pymnt_details_type: result.dataValues.lenco_payment_type,
        pymnt_details_date: result.dataValues.createdAt,
      });
    }

    console.log(chkr_usr_pymnt_id, chkr_lnc_pymnt_id);
    return res.status(200).json({
      mgs: "Unable to process request!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};

////search payment
export const paymntrsltUrl = async (req, res) => {
  const { a } = req.body;
  try {
    const result = await paymentModel.findOne({
      where: {
        lenco_payment_reference: a,
      },
    });
    if (!result) {
      return res.status(200).json({
        pymnt_found: false,
        mgs: "No payment found by provided Payment Ticket ID ",
      });
    }
    const fltrd_result = {
      nm: result.dataValues.accountName,
      amnt: result.dataValues.amount,
      crrncy: result.dataValues.lenco_payment_currency,
      type: result.dataValues.lenco_payment_type,
      status: result.dataValues.payment_sttus,
      phone: result.dataValues.phone,
      payment_ticket_id: result.dataValues.lenco_payment_reference,
      recorded_date: result.dataValues.createdAt,
      initiated_date: result.dataValues.lenco_payment_initiatedAt,
    };
    const company_name = "Unknown";
    return res.status(200).json({
      pymnt_found: true,
      pymnt_details: fltrd_result,
      pymnt_mgs: "Payment Details",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};
////search receipt
/* export const paymntrceptUrl = async (req, res) => {
  const { a } = req.body;
  try {
    const result = await paymentModel.findOne({
      where: {
        lenco_payment_reference: a,
      },
    });
    if (!result) {
      return res.status(200).json({
        pymnt_found: false,
        mgs: "No payment found by provided Payment Ticket ID ",
      });
    }
    const fltrd_result = {
      nm: result.dataValues.accountName,
      amnt: result.dataValues.amount,
      crrncy: result.dataValues.lenco_payment_currency,
      type: result.dataValues.lenco_payment_type,
      status: result.dataValues.payment_sttus,
      phone: result.dataValues.phone,
      payment_ticket_id: result.dataValues.lenco_payment_reference,
      ticket_receipt: result.dataValues.id,
    };
    const company_name = "Unknown";
    return res.status(200).json({
      pymnt_found: true,
      pymnt_details: fltrd_result,
      pymnt_mgs: "Payment Complete!",
      pymnt_end_note: `Thank you for shoping at ${company_name}!`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};
 */
