import { Sequelize } from 'sequelize';
import { INVOICE_LINE_ITEM_STATUSES } from 'shared/constants';
import { Model } from './Model';

export class InvoiceLineItem extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        percentageChange: Sequelize.DECIMAL,
        dateGenerated: Sequelize.DATE,
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: INVOICE_LINE_ITEM_STATUSES.ACTIVE,
        },
      },
      options,
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Invoice, {
      foreignKey: 'invoiceId',
      as: 'invoice',
    });

    this.belongsTo(models.InvoiceLineType, {
      foreignKey: 'invoiceLineTypeId',
      as: 'invoiceLineType',
    });

    this.belongsTo(models.User, {
      foreignKey: 'orderedById',
      as: 'orderedBy',
    });
  }

  static getListReferenceAssociations(models) {
    return [
      {
        model: models.InvoiceLineType,
        as: 'invoiceLineType',
        include: models.InvoiceLineType.getFullLinkedItemsInclude(models),
      },
      {
        model: models.User,
        as: 'orderedBy',
      },
    ];
  }
}