const conocimiento = `
Gestión de Turnos — “TurnoFlex”

Descripción del negocio
TurnoFlex es un pequeño sistema para gestionar turnos de un centro de atención. Los usuarios pueden consultar profesionales, horarios disponibles y reservar un turno.

Problemática
Actualmente los turnos se registran en planillas y mensajes de WhatsApp. Esto genera turnos duplicados, errores en los horarios y dificultades para cancelar o consultar reservas.

Alcance del sistema
El backend administrar:
Profesionales.
Clientes.
Disponibilidad horaria.
Turnos.
Cancelaciones.

Reglas de negocio 
Un profesional no puede tener dos turnos en el mismo horario.
Un cliente no puede reservar dos turnos iguales.
Un turno puede estar en estado: reservado, cancelado o atendido.
Solo se pueden reservar horarios disponibles.
Una cancelación debe modificar el estado del turno.

`;

export default conocimiento;