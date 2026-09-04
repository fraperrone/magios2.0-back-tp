
const router = require('express').Router();
const profesionalesController = require('../controllers/Profesionales.controller');

router.get('/', profesionalesController.getProfesionales);
router.get('/:id', profesionalesController.getProfesionalById);
router.post('/', profesionalesController.createProfesional);
router.put('/:id', profesionalesController.updateProfesional);
router.delete('/:id', profesionalesController.deleteProfesional);

module.exports = router;