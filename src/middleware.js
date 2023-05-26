import { OIDC } from "@tenancy.tly/auth";
import { tenancy } from "./tenancy-client.js";

const oidc = new OIDC({
  issuer: process.env.AUTH_ISSUER,
  jwks: {
    jwksUri: process.env.AUTH_JWKS_URI,
  },
});

export const auth = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });

  const token = authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = await oidc.verify(token);

    req.user = user;
    tenancy.setAuth(authorization);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
