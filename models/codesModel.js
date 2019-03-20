const mongoose = require('mongoose');

const codeSchema = mongoose.Schema({
  createdAt: {
    default: null,
    type: Date
  },
  description: {type: String},
  keywords: [String],
  sampleNames: [String],
  subs: [{
    meaning: {type: String},
    sign: {type: String},  
  }],
  summary: {type: String},
  title: {type: String},
  updatedAt: {
    default: null,
    type: Date
  }
});

codeSchema.methods.apiRepr = function() {
  return {
    created: this.createdAt,
    description: this.description,
    id: this._id,
    keywords: this.keywords,
    sampleNames: this.sampleNames,
    subs: this.subs,
    summary: this.summary,
    title: this.title,
    updated: this.updatedAt
  };
}

const Code = mongoose.model('Code', codeSchema);

module.exports = {Code};
