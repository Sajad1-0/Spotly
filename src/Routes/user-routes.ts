import { authenticateToken } from "../middlewares/auth-utils-service";
import {creatingUsers, 
    findAllUsers, 
    deleteUserById, 
    updateUserById, 
    findUserById,
    loginUser} from "../users/user-controller";
import { authorize } from "../middlewares/authorize-utils";
import {Router} from "express";

const router = Router();

router.post('/register', creatingUsers);
router.post('/', authorize(['user:create']), creatingUsers);
router.get('/', findAllUsers);
router.delete('/:id', authenticateToken, deleteUserById);
router.get('/:id', authenticateToken, findUserById);
router.put('/:id', authenticateToken,updateUserById);
router.post('/login',authenticateToken, loginUser);

export default router;