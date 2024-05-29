import { get as lodashGet, pick } from 'lodash';
import { buildSettings } from '../index';
import { settingsCache } from '../cache';
import { Models } from './readers/SettingsDBReader';

const KEYS_EXPOSED_TO_FRONT_END = [
  'vaccinations',
  'templates',
  'features'
];

export class ReadSettings {
  models: Models;
  facilityId?: string;
  constructor(models: Models, facilityId?: string) {
    this.models = models;
    this.facilityId = facilityId;
  }

  async get(key: string) {
    const settings = await this.getAll();
    return lodashGet(settings, key);
  }

  // This is what is called on login. This gets only settings relevant to
  // the frontend so only what is needed is sent. No sensitive data is sent.
  async getFrontEndSettings() {
    let settings = settingsCache.getFrontEndSettings();
    if (!settings) {
      const allSettings = await this.getAll();
      settings = pick(allSettings, KEYS_EXPOSED_TO_FRONT_END);
      settingsCache.setFrontEndSettings(settings);
    }
    return settings;
  }

  async getAll() {
    let settings = settingsCache.getAllSettings();
    if (!settings) {
      settings = await buildSettings(this.models, this.facilityId);
      settingsCache.setAllSettings(settings);
    }
    return settings;
  }
}
