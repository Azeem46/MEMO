import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "test"; // Use environment variable for secret

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Log the entire authorization header
    console.log("Authorization header:", authHeader);

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];

    // Log the token value (ensure not to log sensitive information in production)
    console.log("Token extracted:", token);

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const isCustomAuth = token.length < 500; // Assuming custom tokens are shorter

    let decodedData;

    if (isCustomAuth) {
      // Verify the token
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id; // For custom tokens
      console.log("Custom token verified. User ID:", req.userId);
    } else {
      // Decode the token (usually for OAuth or similar tokens)
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; // For non-custom tokens
      console.log("OAuth token decoded. User ID:", req.userId);
    }

    // Log the decoded token payload
    console.log("Token payload:", decodedData);

    if (!req.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Generic server error
    res
      .status(500)
      .json({ message: "An error occurred while processing the token" });
  }
};

export default auth;
