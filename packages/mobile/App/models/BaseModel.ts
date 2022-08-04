import { pick } from 'lodash';
import { Mutex } from 'async-mutex';
import {
  BaseEntity,
  PrimaryColumn,
  Generated,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  BeforeUpdate,
  Index,
  MoreThan,
  FindOptionsUtils,
  Repository,
} from 'typeorm/browser';

export type ModelPojo = {
  id: string;
};

export type FindMarkedForUploadOptions = {
  channel: string;
  limit?: number;
  after?: string;
};

// https://stackoverflow.com/questions/54281631/is-it-possible-to-get-instancetypet-to-work-on-an-abstract-class
type AbstractInstanceType<T> = T extends { prototype: infer U } ?
  U : never;

function sanitiseForImport<T>(repo: Repository<T>, data: { [key: string]: any }) {
  // TypeORM will complain when importing an object that has fields that don't
  // exist on the table in the database. We need to accommodate receiving records
  // from the sync server that don't match up 100% (to allow for changes over time)
  // so we just strip those extraneous fields out here.
  //
  // Note that fields that are necessary-but-not-in-the-sync-record need to be
  // accommodated too, but that's done by making those fields nullable or
  // giving them sane defaults)

  const columns = repo.metadata.columns.map(({ propertyName }) => propertyName);
  return Object.entries(data)
    .filter(([key]) => columns.includes(key))
    .reduce((state, [key, value]) => ({
      ...state,
      [key]: value,
    }), {});
}

// This is used instead of @RelationId provided by typeorm, because
// typeorm's @RelationId causes a O(n^2) operation for every query to that model.
export const IdRelation = (options = {}): any => Column({ nullable: true, ...options });

/*
  This function returns a new object (shallow copied values) and does two things:
    - Rename the keys from relation fields (countryId -> country)
    - Map the value from relation fields ( 'some-id' -> { id: 'some-id' })

  When adding relation fields, we need to point to the actual relation column
  (ManyToOne, OneToOne, etc.) and use a special syntax for TypeORM.

  Since our forms/fields/suggesters only use the ID and not the whole
  object, the field names won't match the record column names.
*/
const getMappedFormValues = (values: object): object => {
  const mappedValues = {};

  // Map keys and values accordingly
  Object.entries(values).forEach(([key, value]) => {
    // Check if field is a relation (evidenced by having 'Id' at the end)
    if (key.slice(-2) === 'Id') {
      // Remove 'Id' from the key to get the actual relation column name
      const columnKey = key.slice(0, -2);

      // Save the relation as an object to let TypeORM handle it
      mappedValues[columnKey] = { id: value };
    } else {
      // Regular field, copy as is
      mappedValues[key] = value;
    }
  });

  return mappedValues;
};

export abstract class BaseModel extends BaseEntity {
  // TAN-884: lock entire model class while updating markedForUpload or syncing
  static markedForUploadMutex = new Mutex();

  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @Column({ default: true })
  markedForUpload: boolean;

  @Column({ nullable: true })
  uploadedAt: Date;

  @BeforeUpdate()
  async markForUpload() {
    // TAN-884: make sure records always have markedForUpload set to true when sync is ongoing
    // This may sometimes cause records to be uploaded even when an update failed!
    // We take that risk, since it's better than not uploading a record.

    const thisModel = this.constructor as typeof BaseModel;

    // acquire an exclusive lock before running the update
    await thisModel.markedForUploadMutex.runExclusive(async () => {
      await thisModel.getRepository().update({ id: this.id }, { markedForUpload: true });
    });
  }

  async markParentForUpload<T extends typeof BaseModel>(
    parentModel: T,
    parentProperty: string,
  ) {
    const parent = await this.findParent(parentModel, parentProperty);
    if (!parent) {
      return;
    }
    await parent.markForUpload()
  }

  async findParent<T extends typeof BaseModel>(
    parentModel: T,
    parentProperty: string,
  ): Promise<AbstractInstanceType<T>> {
    let entity: AbstractInstanceType<T>;
    const parentValue = this[parentProperty];

    if (typeof parentValue === 'string') {
      entity = await parentModel.findOne({
        where: { id: parentValue }
      }) as AbstractInstanceType<T>;

    } else if (typeof parentValue === 'object') {
      entity = await parentModel.findOne({
        where: { id: parentValue.id },
      }) as AbstractInstanceType<T>;

    } else {
      const thisModel = this.constructor as typeof BaseModel;
      entity = await thisModel
        .getRepository()
        .createQueryBuilder()
        .relation(thisModel, parentProperty)
        .of(this)
        .loadOne();
    }
    return entity;
  }

  static async markUploaded(ids: string | string[], uploadedAt: Date): Promise<void> {
    await this.getRepository().update(ids, { uploadedAt, markedForUpload: false });
  }

  /*
    Convenient helper for creating a new record.

    NOTES:
    - When adding relations defined with the 'RelationId' decorator,
    the data object expects the column key name (fieldName: 'some-id').
    - Relations defined with the 'IdRelation' won't work unless you use
    the same column name (fieldNameId: 'some-id'). However, it will only
    work that way on creation and not edition.
  */
  static createAndSaveOne<T extends BaseModel>(data?: object): Promise<T> {
    const repo = this.getRepository<T>();
    return repo.create(sanitiseForImport<T>(repo, data)).save();
  }

  /*
    Helper function to properly update TypeORM relations. The .update()
    method doesn't provide a reliable way of confirming it succeeded and
    columns specified with 'IdRelation' and 'RelationId' need special handling.
  */
  static async updateValues<T extends BaseModel>(id: string, values: object): Promise<T | null> {
    const repo = this.getRepository<T>();

    // Find the actual instance we want to update
    const instance = await repo.findOne(id);

    // Bail early if no record was found
    if (!instance) {
      console.error(`${this.name} record with ID ${id} doesn't exist, therefore it can't be updated`);
      return null;
    }

    // Get appropiate key/value pairs to manage relations
    const mappedValues = getMappedFormValues(values);

    // Update each specified value
    Object.entries(mappedValues).forEach(([key, value]) => {
      instance[key] = value;
    });

    // Return the updated instance. NOTE: updated relations won't have
    // all fields until you reload the instance again, only their ID.
    return instance.save();
  }

  static async findMarkedForUpload(
    opts: FindMarkedForUploadOptions,
  ): Promise<BaseModel[]> {
    // query is built separately so it can be modified in child classes
    return this.findMarkedForUploadQuery(opts).getMany();
  }

  static findMarkedForUploadQuery(
    { limit, after }: FindMarkedForUploadOptions,
  ) {
    const whereAfter = (typeof after === 'string') ? { id: MoreThan(after) } : {};

    const qb = this.getRepository().createQueryBuilder();
    return FindOptionsUtils.applyOptionsToQueryBuilder(qb, {
      where: {
        markedForUpload: true,
        ...whereAfter,
      },
      order: {
        id: 'ASC',
      },
      take: limit,
      relations: this.includedSyncRelations,
    });
  }

  static async filterExportRecords(ids: string[]) {
    return ids;
  }

  static async postExportCleanUp() { }

  static shouldImport = true;

  static shouldExport = false;

  static uploadLimit = 100;

  // Exclude these properties from uploaded model
  // May be columns or relationIds
  static excludedSyncColumns: string[] = [
    'createdAt',
    'updatedAt',
    'markedForUpload',
    'markedForSync',
    'uploadedAt',
  ];

  // Include these relations on uploaded model
  // Does not currently handle lazy or embedded relations
  static includedSyncRelations: string[] = [];

  getPlainData(): ModelPojo {
    const thisModel = this.constructor as typeof BaseModel;
    const repo = thisModel.getRepository();
    const { metadata } = repo;
    const allColumns = [
      ...metadata.columns,
      ...metadata.relationIds, // typeorm thinks these aren't columns
    ].map(({ propertyName }) => propertyName);
    return pick(this, allColumns) as ModelPojo;
  }
}
