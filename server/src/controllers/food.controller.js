import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import Food from "../models/food.models.js";
import { uploadToImageKit, deleteFromImageKit } from "../utils/imageKit.js";

const createFood = asyncHandler(async (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        throw new ApiError(400, "All fields are required");
    }
    if (!req.file) {
        throw new ApiError(400, "Image file is required");
    }
    const restaurantId = req.restaurant._id;
    if (!restaurantId) {
        throw new ApiError(400, "Restaurant ID is required");
    }
    
    const result = await uploadToImageKit(req.file.buffer, req.file.originalname, `/restaurants/${restaurantId}`);
    if (!result) {
        throw new ApiError(500, "Image upload failed");
    }

    const food = await Food.create({
        name,
        description,
        price,
        image: result.url,
        fileId: result.fileId,
        restaurant: restaurantId
    });

    if (!food) {
        throw new ApiError(500, "Food creation failed");
    }

    res.status(201).json(new ApiResponse(201, food, "Food created successfully"));
})

const deleteFood = asyncHandler(async (req, res) => {
    const { foodId } = req.params;
    if (!foodId) {
        throw new ApiError(400, "Food ID is required");
    }
    const food = await Food.findById(foodId);
    if (!food) {
        throw new ApiError(404, "Food not found");
    }
    const deleteResult = await deleteFromImageKit(food.fileId);
    if (!deleteResult) {
        throw new ApiError(500, "Image deletion failed");
    }
    await food.remove();
    res.status(200).json(new ApiResponse(200, null, "Food deleted successfully"));
})

const getAllFoods = asyncHandler(async (req, res) => {
    const foods = await Food.find();
    res.status(200).json(new ApiResponse(200, foods, "Foods retrieved successfully"));
})

export { createFood, deleteFood, getAllFoods };