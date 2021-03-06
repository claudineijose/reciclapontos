import app from './config/express';

const server = app();
const port = server.get('port');

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});