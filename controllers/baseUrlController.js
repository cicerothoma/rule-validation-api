module.exports = (req, res, next) => {
  res.status(200).json({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Collins Thomas",
      github: "@cicerothoma",
      email: "thoamscollins582@gmail.com",
      mobile: "08138591185",
      twitter: "@CiceroThoma",
    },
  });
};
