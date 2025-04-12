import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

// list of all the endpoints
// endpoint for getting data of the current logged in user
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);
// endpoint for creating a user
router.post("/", jwtCheck, MyUserController.createCurrentUser);
// endpoint for updating a user
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);


export default router;
