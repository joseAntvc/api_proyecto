const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config()


function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_ROUTE;
    return jwt({
        secret: secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/api\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}

async function isRevoked(req, token){
    //console.log(token)
    //console.log(req.auth)
    if(!token.payload.isAdmin) {
       return true;
    }
}
module.exports = authJwt