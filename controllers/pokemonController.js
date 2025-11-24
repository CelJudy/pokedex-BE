const db = require('../config/database');
/**
 * POST /api/pokemon/saveFavorite
 * Guarda pokemon favorito por usuario
 */
const saveFavorite = async (req, res, next) => {
  
  try {
    const { id, pokemon } = req.body;

    // Guardar favorito
    const response = await db.query(`INSERT INTO favorite VALUES ($1, $2) RETURNING *`, 
        [pokemon, id]);



    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Pokemon añadido a favoritos.',
    });
  } catch (error) {
    next(error);
  }

};


const deleteFavorite = async (req, res, next) => {
  
  try {
    const { id, pokemon } = req.body;

    // Guardar favorito
    const response = await db.query(`delete from favorite where pokemon=$1 and user_id=$2`, 
        [pokemon, id]);



    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Pokemon eliminado de favoritos.',
    });
  } catch (error) {
    next(error);
  }

};

module.exports = {
    saveFavorite,
    deleteFavorite
};


