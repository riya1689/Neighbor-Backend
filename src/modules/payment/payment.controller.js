import paymentService from "./payment.service.js";

export const initiatePayment = async (req, res, next) => {
  try {
    const { planType } = req.body;
    const userId = req.user.id;

    const result = await paymentService.initPayment({
      userId,
      planType,
    });

    res.status(200).json({
      success: true,
      message: "Payment session initiated",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const paymentSuccess = async (req, res, next) => {
  try {
    const { tran_id } = req.body;
    const result = await paymentService.handleSuccess(tran_id);
    res.status(200).json({
      success: true,
      message: "Payment successful and subscription activated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentFail = async (req, res, next) => {
  try {
    const { tran_id } = req.body;
    const result = await paymentService.handleFailOrCancel(tran_id, "FAILED");
    res.status(400).json({
      success: false,
      message: "Payment failed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentCancel = async (req, res, next) => {
  try {
    const { tran_id } = req.body;
    const result = await paymentService.handleFailOrCancel(tran_id, "CANCELLED");
    res.status(400).json({
      success: false,
      message: "Payment cancelled",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
