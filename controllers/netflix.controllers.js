import mongoose from 'mongoose';
import Netflix from '../models/netflix.model.js';

const getAllNetflixCompanies = async (req, res) => {
  try {
    const registros = await Netflix.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de Netflix'
    });
  }
};

const getNetflixCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const registro = await Netflix.findById(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro de Netflix no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: registro
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el registro de Netflix'
    });
  }
};

const postNetflixCompany = async (req, res) => {
  try {
    const nuevoRegistro = new Netflix(req.body);
    const registroGuardado = await nuevoRegistro.save();

    return res.status(201).json({
      success: true,
      message: 'Registro de Netflix creado correctamente',
      data: registroGuardado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el registro de Netflix'
    });
  }
};

const putNetflixCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const registroActualizado = await Netflix.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: 'after',
        runValidators: true
      }
    );

    if (!registroActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Registro de Netflix no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro de Netflix actualizado correctamente',
      data: registroActualizado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el registro de Netflix'
    });
  }
};

const deleteNetflixCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const registroEliminado = await Netflix.findByIdAndDelete(id);

    if (!registroEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Registro de Netflix no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro de Netflix eliminado correctamente',
      data: registroEliminado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro de Netflix'
    });
  }
};

const getNetflixCompaniesByCountry = async (req, res) => {
  try {
    const { pais } = req.params;

    const registros = await Netflix.find({
      pais: { $regex: pais, $options: 'i' }
    });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al filtrar registros de Netflix por país'
    });
  }
};

export {
  getAllNetflixCompanies,
  getNetflixCompanyById,
  postNetflixCompany,
  putNetflixCompany,
  deleteNetflixCompany,
  getNetflixCompaniesByCountry
};
