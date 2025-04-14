// // route to initilize khalti payment gateway
// app.post("/initialize-khali", async (req, res) => {
//   try {
//     //try catch for error handling
//     const { itemId, totalPrice, website_url } = req.body;
//     const itemData = await Item.findOne({
//       _id: itemId,
//       price: Number(totalPrice),
//     });

//     if (!itemData) {
//       return res.status(400).send({
//         success: false,
//         message: "item not found",
//       });
//     }
//     // creating a purchase document to store purchase info
//     const purchasedItemData = await PurchasedItem.create({
//       item: itemId,
//       paymentMethod: "khalti",
//       totalPrice: totalPrice * 100,
//     });

//     const paymentInitate = await initializeKhaltiPayment({
//       amount: totalPrice * 100, // amount should be in paisa (Rs * 100)
//       purchase_order_id: purchasedItemData._id, // purchase_order_id because we need to verify it later
//       purchase_order_name: itemData.name,
//       return_url: `${process.env.BACKEND_URI}/complete-khalti-payment`, // it can be even managed from frontedn
//       website_url,
//     });

//     res.json({
//       success: true,
//       purchasedItemData,
//       payment: paymentInitate,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       error,
//     });
//   }
// });


import dotenv from "dotenv";
dotenv.config();
import express from 'express'

const router = express.Router();


router.post("/complete-khalti-payment", async (req, res) => {
  console.log("complete-khalti-payment called")
  const {product_id,buyer_name,amount} = req.body
  const convertedAmount = Number(amount) * 100; // Convert to paisa
try {
  const response = await fetch(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `http://localhost:5173/appointments`,
          website_url: `http://localhost:5173/appointments`,

          amount: convertedAmount,
          purchase_order_id: product_id,
          purchase_order_name: buyer_name,
        }),
      }
    );

    console.log(response);
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        message: data.payment_url,
      });
    }
  
} catch (error) {
  res.json({
    success: false,
    message: error.messs
  });
}
})


export default router;