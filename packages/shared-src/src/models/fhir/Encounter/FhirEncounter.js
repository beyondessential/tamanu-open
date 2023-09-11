import { Sequelize, DataTypes } from 'sequelize';

import { FhirResource } from '../Resource';
import { getQueryOptions } from './getQueryOptions';
import { getValues } from './getValues';
import { fromEncounters } from './getQueryToFindUpstreamIds';
import { searchParameters } from './searchParameters';

export class FhirEncounter extends FhirResource {
  static init(options, models) {
    super.init(
      {
        status: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        class: DataTypes.JSONB,
        subject: DataTypes.JSONB,
        actualPeriod: DataTypes.JSONB,
        location: DataTypes.JSONB,
      },
      options,
    );

    this.UpstreamModels = [models.Encounter];
    this.upstreams = [models.Encounter, models.Discharge, models.Patient, models.Location];
  }

  static CAN_DO = new Set([]);

  async updateMaterialisation() {
    const upstream = await this.getUpstream(getQueryOptions(this.sequelize.models));
    const values = await getValues(upstream, this.sequelize.models);
    this.set(values);
  }

  static async queryToFindUpstreamIdsFromTable(upstreamTable, table, id, deletedRow = null) {
    const { Encounter } = this.sequelize.models;

    if (upstreamTable === Encounter.tableName) {
      return fromEncounters(this.sequelize.models, table, id, deletedRow);
    }
    return null;
  }

  asFhir() {
    const resource = super.asFhir();

    // Exclude unresolved upstream if it remains in the materialised data.
    if (resource.subject.type === 'upstream://patient') {
      delete resource.subject;
    }

    return resource;
  }

  static searchParameters() {
    return {
      ...super.searchParameters(),
      ...searchParameters,
    };
  }
}
