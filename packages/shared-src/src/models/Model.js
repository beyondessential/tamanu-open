import * as sequelize from 'sequelize';

export const Sequelize = sequelize.Sequelize;

const firstLetterLowercase = s => (s[0] || '').toLowerCase() + s.slice(1);

export class Model extends sequelize.Model {
  forResponse() {
    // Reassign reference associations to use camelCase & dataValues.
    // That is, it turns
    // { id: 12345, field: 'value', ReferenceObject: [model instance] }
    // into
    // { id: 12345, field: 'value', referenceObject: { id: 23456, name: 'object' } }

    const values = Object.entries(this.dataValues)
      .filter(([key, val]) => val !== null)
      .reduce(
        (obj, [key, val]) => ({
          ...obj,
          [key]: val,
        }),
        {},
      );

    const references = this.constructor.getListReferenceAssociations();

    if (!references) return values;

    // Note that we don't call forResponse on the nested object, this is under the assumption that
    // if the structure of a nested object differs significantly from its database representation,
    // it's probably more correct to implement that as a separate endpoint rather than putting the
    // logic here.
    return references.reduce((allValues, referenceName) => {
      const { [referenceName]: referenceVal, ...otherValues } = allValues;
      if (!referenceVal) return allValues;
      return { ...otherValues, [firstLetterLowercase(referenceName)]: referenceVal.dataValues };
    }, values);
  }

  toJSON() {
    return this.forResponse();
  }

  getModelName() {
    return this.constructor.name;
  }

  getNotes(limit = undefined) {
    const { Note } = this.sequelize.models;
    return Note.findAll({
      where: {
        recordType: this.getModelName(),
        recordId: this.id,
      },
      limit,
    });
  }

  static getListReferenceAssociations() {
    // List of relations to include when fetching this model
    // as part of a list (eg to display in a table)
    //
    // This will get used in an options object passed to a sequelize
    // query, so returning 'undefined' by default here just leaves that key
    // empty (which is the desired behaviour).
    return undefined;
  }

  static getFullReferenceAssociations() {
    // List of relations when fetching just this model
    // (eg to display in a detailed view)
    return this.getListReferenceAssociations();
  }
}
