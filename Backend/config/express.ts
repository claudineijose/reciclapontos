import express from 'express';
import cfg from 'config';

export default () => {
    return express()
        .set('port', process.env.PORT || cfg.get('server.port'))
        .use(express.json());
};

