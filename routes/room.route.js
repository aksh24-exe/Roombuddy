import express from "express";
import { postRoom, searchRoom } from "../controller/room.controller.js";
const router = express.Router();

router.post("/",postRoom)
router.post("/search-buddies", searchRoom);
// router.post("/rooms", registerUser);


export default router;
