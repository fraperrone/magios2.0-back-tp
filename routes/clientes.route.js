
const router = require('express').Router();
const clientesController = require('../controllers/clientes.controller');

router.get('/', clientesController.getClientes);
router.get('/:id', clientesController.getClienteById);
router.post('/', clientesController.createCliente);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;
