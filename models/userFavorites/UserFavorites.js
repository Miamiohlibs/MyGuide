const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const UserFavoritesSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  favoriteGuides: {
    type: [Number],
    required: true,
    default: [],
  },
  favoriteDatabases: {
    type: [Number],
    required: true,
    default: [],
  },
  favoriteSubjects: {
    type: [String],
    required: true,
    default: [],
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

mongoose.model('userFavorites', UserFavoritesSchema);
