import { v4 as uuidv4 } from 'uuid';

import { FHIR_BUNDLE_TYPES } from 'shared/constants';
import { formatFhirDate, OperationOutcome } from 'shared/utils/fhir';

import { getBaseUrl, getHL7Link } from '../utils';

export class Bundle {
  included = [];

  issues = [];

  /** Will be set to true if this is a search result bundle. */
  isSearchResult = false;

  constructor(type, resources, options = {}) {
    this.type = type;
    this.resources = resources;
    this.options = options;

    if (type === FHIR_BUNDLE_TYPES.SEARCHSET) {
      this.isSearchResult = true;
    }
  }

  addSelfUrl(req) {
    const baseUrl = getBaseUrl(req);
    this.options.selfurl = getHL7Link(baseUrl, req.query);
  }

  addIncluded(included) {
    this.included = this.included.concat(included);
  }

  addIssues(issues) {
    this.issues = this.issues.concat(issues);
  }

  get includes() {
    return new Set(this.included.map(r => r.fhirName));
  }

  asFhir() {
    const currentFhirDate = formatFhirDate(new Date());
    const fields = {
      resourceType: 'Bundle',
      id: uuidv4(),
      type: this.type,
      timestamp: currentFhirDate,
      meta: {
        lastUpdated: currentFhirDate,
      },
    };

    if (typeof this.options.total === 'number') {
      fields.total = this.options.total;
    }

    if (this.options.link) {
      fields.link = this.options.link;
    }

    if (this.options.selfurl) {
      fields.link ||= [];
      fields.link.push({
        relation: 'self',
        url: this.options.selfurl,
      });
    }

    fields.entry = this.resources
      .map(r => resourceToEntry(r, this.isSearchResult ? 'match' : null))
      .concat(this.included.map(r => resourceToEntry(r, this.isSearchResult ? 'include' : null)));

    if (this.issues.length > 0) {
      const oo = new OperationOutcome(this.issues);
      oo.downgradeErrorsToWarnings();
      fields.issues = oo.asFhir();
    }

    return fields;
  }
}

function resourceToEntry(resource, searchMode = null) {
  const entry = { resource: resource.asFhir() };

  if (searchMode) {
    entry.search = {
      mode: searchMode,
    };
  }

  return entry;
}
