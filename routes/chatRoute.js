import { Router } from "express";

import {
  mostrarChat,
  enviarMensaje
} from "../controllers/chatController.js";

const router = Router();

router.get("/", mostrarChat);
router.post("/mensaje", enviarMensaje);

export default router;