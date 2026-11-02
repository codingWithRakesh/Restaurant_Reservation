import {Router} from "express";
import {
    loginRestaurant,
    logoutRestaurant,
    currentRestaurant,
    addDetails
} from "../controllers/restaurant.controller.js";
import { verifyRestaurants } from "../middlewares/restaurants.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/login").post(loginRestaurant);
router.route("/logout").post(verifyRestaurants, logoutRestaurant);
router.route("/current").get(verifyRestaurants, currentRestaurant);
router.route("/addDetails").post(verifyRestaurants, upload.single("image"), addDetails);

export default router;