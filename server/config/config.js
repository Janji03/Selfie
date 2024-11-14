const config = {
  port: process.env.PORT || 5000,
  dbURI: process.env.MONGO_URI || 'mongodb+srv://root:root@selfie-mern.vukiuom.mongodb.net/?retryWrites=true&w=majority&appName=selfie-MERN',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key', 
};

export default config;
