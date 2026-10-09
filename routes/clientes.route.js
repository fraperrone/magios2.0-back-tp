
const router = require('express').Router();
const clientesController = require('../controllers/clientes.controller');
const validacionesClientes = require('../middlewares/validacionesClientes');

router.get('/', clientesController.getClientes);
router.get('/:id', clientesController.getClienteById);
router.post('/', validacionesClientes.validarDatos, clientesController.createCliente);
router.put('/:id', validacionesClientes.validarDatos, clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;
