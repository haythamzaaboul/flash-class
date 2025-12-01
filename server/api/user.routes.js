import { Router } from "express";
import { getUser, createUser, login, refreshToken} from "../controllers/user.controller.js";
import { auth } from "../middleware/authMiddleware.js";
import { rate } from "../middleware/rateLimiter.js";
import { validateUserinfo, userinfoSchema,verifyNewUserSchema } from "../validators/userValidator.js";

const router = Router();
router.get("/:id",rate,auth,getUser);// we need to vberify if the user is authentiated (jwt/session) before allowing access
router.post("/auth/register",rate,validateUserinfo(verifyNewUserSchema),createUser);
router.post("/auth/login",rate, validateUserinfo(userinfoSchema),login);
router.post("/auth/refresh-token",rate, refreshToken);

export default router;