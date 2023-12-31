import express from 'express';

import User from '../models/User.js'
import auth from '../middleware/auth.js';

const router = new express.Router();

router.get('/', auth, async (req, res) => {
    const { name, email } = req.user;
    const token = req.token;
    res.status(200).send({name, email, token});
})

router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ name: user.name, email: user.email, token });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ name: user.name, email: user.email, token });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        const user = req.user;

        user.tokens = user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

export default router;