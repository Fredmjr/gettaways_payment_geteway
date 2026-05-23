export const appUrl = async (req, res) => {
  try {
    return res.status(200).json({
      mgs: "test",
    });
  } catch (error) {
    res.status(400).json({
      erMgs: "Unable to process request!",
    });
  }
};
