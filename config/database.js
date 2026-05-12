import mongoose from 'mongoose';

const conectarMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Netflix_backend';

    await mongoose.connect(mongoUri);

    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

export { conectarMongoDB };
