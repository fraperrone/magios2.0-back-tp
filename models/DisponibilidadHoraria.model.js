class DisponibilidadHoraria {
    
    constructor(id, profesionalId, diaSemana, horaInicio, horaFin) {
        this.id = id;
        this.profesionalId = profesionalId;
        this.diaSemana = diaSemana; // Lunes=1, Martes=2, etc
        this.horaInicio = horaInicio; // hh:mm
        this.horaFin = horaFin; // hh:mm
    }
}

module.exports = DisponibilidadHoraria;