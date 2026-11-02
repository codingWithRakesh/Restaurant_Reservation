import {Router} from "express";
import {
    loginRestaurant,
    logoutRestaurant,
    currentRestaurant
} from "../controllers/restaurant.controller.js";
import { verifyRestaurants } from "../middlewares/restaurants.middleware.js";

const router = Router();

router.route("/login").post(loginRestaurant);
router.route("/logout").post(verifyRestaurants, logoutRestaurant);
router.route("/current").get(verifyRestaurants, currentRestaurant);

export default router;