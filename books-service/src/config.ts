export default () => ({
    db: {
        url: process.env.DB_URI
    },
    port: process.env.PORT,
    rabit: {
        url: process.env.RABIT_URL
    }
});