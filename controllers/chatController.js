import { consultarGemini } from "../services/chatService.js";

export const mostrarChat = (req, res) => {

  res.render("chat", {
    mensajes: req.session.historial || []
  });

};

export const enviarMensaje = async (req, res) => {

  try {

    const { mensaje } = req.body;

    if (!mensaje?.trim()) {
      return res.redirect("/chat");
    }

    const historial = req.session.historial || [];

    const respuesta = await consultarGemini(
      historial,
      mensaje.trim()
    );

    // Guardar conversación
    req.session.historial = [
      ...historial,
      { role: "user", text: mensaje },
      { role: "model", text: respuesta }
    ].slice(-20);

    res.render("chat", {
      mensajes: req.session.historial
    });

  } catch (error) {

    console.error(error);

    res.status(500).render("chat", {
      mensajes: req.session.historial || [],
      error: "No se pudo obtener una respuesta."
    });

  }
};