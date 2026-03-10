const staffMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "staff") {
    return res.status(403).json({
      message: "Staff access required",
    });
  }
  next();
};

module.exports = staffMiddleware;
