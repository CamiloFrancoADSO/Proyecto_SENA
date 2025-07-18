// Servicio para manejar operaciones de ambientes de formación
import { request } from './apiClient.js';

export const ambienteService = {
    /**
     * Obtiene todos los ambientes de formación del centro del usuario logueado
     * @returns {Promise<Array>} Lista de ambientes de formación
     */
    getAmbientesByCentro: async () => {
        try {
            console.log('🌐 ambienteService: Iniciando petición para obtener ambientes');
            
            // Obtener código de centro del usuario logueado
            const userString = localStorage.getItem('user');
            if (!userString) {
                throw new Error('No se encontró información del usuario logueado');
            }
            
            const user = JSON.parse(userString);
            const codCentro = user.cod_centro;
            
            if (!codCentro) {
                throw new Error('El usuario no tiene un centro asignado');
            }
            
            console.log('🏢 Código de centro del usuario:', codCentro);
            
            const ambientes = await request(`/ambiente/get-by-centro/${codCentro}`);
            console.log('✅ ambienteService: Respuesta exitosa:', ambientes);
            return ambientes;
        } catch (error) {
            console.error('❌ ambienteService: Error al obtener ambientes:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo ambiente de formación
     * @param {Object} ambienteData - Datos del ambiente a crear
     * @param {string} ambienteData.nombre_ambiente - Nombre del ambiente
     * @param {number} ambienteData.num_max_aprendices - Número máximo de aprendices
     * @param {string} ambienteData.municipio - Municipio donde se ubica
     * @param {string} ambienteData.ubicacion - Ubicación específica
     * @param {boolean} ambienteData.estado - Estado del ambiente (opcional, por defecto true)
     * @returns {Promise<Object>} Respuesta del servidor
     */
    createAmbiente: async (ambienteData) => {
        try {
            console.log('🌐 ambienteService: Creando ambiente:', ambienteData);
            
            // Obtener código de centro del usuario logueado
            const userString = localStorage.getItem('user');
            if (!userString) {
                throw new Error('No se encontró información del usuario logueado');
            }
            
            const user = JSON.parse(userString);
            const codCentro = user.cod_centro;
            
            if (!codCentro) {
                throw new Error('El usuario no tiene un centro asignado');
            }
            
            // Agregar cod_centro automáticamente
            const dataWithCentro = {
                ...ambienteData,
                cod_centro: codCentro
            };
            
            console.log('📊 Datos completos para crear:', dataWithCentro);
            
            const response = await request('/ambiente/create', {
                method: 'POST',
                body: JSON.stringify(dataWithCentro)
            });
            
            console.log('✅ ambienteService: Ambiente creado exitosamente:', response);
            return response;
        } catch (error) {
            console.error('❌ ambienteService: Error al crear ambiente:', error);
            throw error;
        }
    }
}; 