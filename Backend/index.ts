import app from './config/express';
import indexRoutes from './src/routers/';

const server = app();
const port = server.get('port');

server.use(indexRoutes);

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});