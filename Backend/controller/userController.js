const sendEmail = require('../Helper/mailer');
const billModel = require('../model/billModel');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const payController = async (req, res) => {
  const { id } = req.params;
  const status = 'paid';
  try {
    console.log({ id, status });
    const updatedBill = await billModel.findOneAndUpdate(
      { billId: id },
      { $set: { status } },
      { new: true }
    );
    if (!updatedBill) {
      return res.status(400).json({ message: 'Bill not found' });
    } else {
      sendEmail(updatedBill.userEmail, 'Bill paid', `Your bill ${updatedBill.billTitle} has been paid`);
      return res.status(200).json({ message: 'Bill updated successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal error' });
  }
};

const getUserBills = async (req, res) => {
  const { userMail } = req.params;
  try {
    const bills = await billModel.find({ userEmail: userMail });

    if (!bills || bills.length === 0) {
      return res.status(404).json({ message: 'No bills found' });
    }
    else {
      res.status(200).json(bills);
    }

  } catch (error) {
    res.status(500).json({ message: 'Internal error' });
  }
};

const generateOrders= async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};

const verifyPayment= async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};

module.exports = {payController, getUserBills, generateOrders, verifyPayment };