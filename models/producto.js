
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    //relacion con otra table usuario
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    //relacion con otra table categoria
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: { type: String },
});


ProductoSchema.methods.toJSON = function() {
    //excluid __V, password, _id
    const { __v, estado, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Producto', ProductoSchema);