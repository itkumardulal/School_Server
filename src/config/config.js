require('dotenv').config()

const envPort = {
    port:process.env.PORT_NUMBER
}

const seederConfig = {
    email: process.env.SUPER_ADMIN_EMAIL ,
    password: process.env.SUPER_ADMIN_PASSWORD,
    role: process.env.SUPER_ADMIN_ROLE,
    schoolCode: process.env.SUPER_ADMIN_SCHOOL_CODE
}



module.exports = { seederConfig };


const secretConfig = {
    secretKey: process.env.SECRET_KEY
}

const dbConfig = {
    database:process.env.DB_NAME,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000,
    }
}

const r2Config = {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
    endpoint: process.env.R2_ENDPOINT,
    region: process.env.R2_REGION,
    publicUrl: process.env.R2_PUBLIC_URL
}

const authorizedDomain = {
  allowedDomains: process.env.ALLOWED_DOMAINS
    ?.split(",")
    .map(domain => domain.trim().toLowerCase())
    .filter(Boolean) || []
};


module.exports = {
    envPort,
    seederConfig,
    secretConfig,
    dbConfig,
    r2Config,
    authorizedDomain
}