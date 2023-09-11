const OLD_SYNC_TIME_KEY = 'currentSyncTime';
const NEW_SYNC_TICK_KEY = 'currentSyncTick';

// copied from migration 123 with updated key
export async function up(query) {
  await query.sequelize.query(`
    CREATE OR REPLACE FUNCTION set_updated_at_sync_tick()
      RETURNS trigger
      LANGUAGE plpgsql AS
      $func$
      BEGIN
        -- If setting to "-1" representing "not marked as updated on this client", we actually use
        -- a different number, "-999", to represent that in the db, so that we can identify the
        -- difference between explicitly setting it to not marked as updated (when NEW contains -1),
        -- and having other fields updated without the updated_at_sync_tick being altered (in which
        -- case NEW will contain -999, easily distinguished from -1)
        IF NEW.updated_at_sync_tick = -1 THEN
          NEW.updated_at_sync_tick := -999;
        ELSE
          SELECT value FROM local_system_facts WHERE key = '${NEW_SYNC_TICK_KEY}' INTO NEW.updated_at_sync_tick;
        END IF;
        RETURN NEW;
      END
      $func$;
  `);
}

export async function down(query) {
  await query.sequelize.query(`
    CREATE OR REPLACE FUNCTION set_updated_at_sync_tick()
      RETURNS trigger
      LANGUAGE plpgsql AS
      $func$
      BEGIN
        -- If setting to "-1" representing "not marked as updated on this client", we actually use
        -- a different number, "-999", to represent that in the db, so that we can identify the
        -- difference between explicitly setting it to not marked as updated (when NEW contains -1),
        -- and having other fields updated without the updated_at_sync_tick being altered (in which
        -- case NEW will contain -999, easily distinguished from -1)
        IF NEW.updated_at_sync_tick = -1 THEN
          NEW.updated_at_sync_tick := -999;
        ELSE
          SELECT value FROM local_system_facts WHERE key = '${OLD_SYNC_TIME_KEY}' INTO NEW.updated_at_sync_tick;
        END IF;
        RETURN NEW;
      END
      $func$;
  `);
}
