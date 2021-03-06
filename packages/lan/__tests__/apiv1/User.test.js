import { getToken } from 'lan/app/middleware/auth';
import Chance from 'chance';
import { createTestContext } from '../utilities';

const chance = new Chance();
const createUser = overrides => ({
  email: chance.email(),
  displayName: chance.name(),
  password: chance.word(),
  ...overrides,
});

const { baseApp, models } = createTestContext();

describe('User', () => {
  let adminApp = null;

  beforeAll(async () => {
    adminApp = await baseApp.asRole('admin');
  });

  describe('auth', () => {
    let authUser = null;
    const rawPassword = 'PASSWORD';

    beforeAll(async () => {
      authUser = await models.User.create(
        createUser({
          password: rawPassword,
        }),
      );
    });

    it('should obtain a valid login token', async () => {
      const result = await baseApp.post('/v1/login').send({
        email: authUser.email,
        password: rawPassword,
      });
      expect(result).toHaveSucceeded();
      expect(result.body).toHaveProperty('token');
    });

    test.todo('should refresh a token');
    test.todo('should not refresh an expired token');

    it('should get the user based on the current token', async () => {
      const userAgent = await baseApp.asUser(authUser);
      const result = await userAgent.get('/v1/user/me');
      expect(result).toHaveSucceeded();
      expect(result.body).toHaveProperty('id', authUser.id);
    });

    it('should fail to get the user with a null token', async () => {
      const result = await baseApp.get('/v1/user/me');
      expect(result).toBeForbidden();
    });

    it('should fail to get the user with an expired token', async () => {
      const expiredToken = await getToken(authUser, '-1s');
      const result = await baseApp
        .get('/v1/user/me')
        .set('authorization', `Bearer ${expiredToken}`);
      expect(result).toHaveRequestError();
    });

    it('should fail to get the user with an invalid token', async () => {
      const result = await baseApp
        .get('/v1/user/me')
        .set('authorization', 'Bearer ABC_not_a_valid_token');
      expect(result).toHaveRequestError();
    });

    it('should fail to obtain a token for a wrong password', async () => {
      const result = await baseApp.post('/v1/login').send({
        email: authUser.email,
        password: 'PASSWARD',
      });
      expect(result).toHaveRequestError();
    });

    it('should fail to obtain a token for a wrong email', async () => {
      const result = await baseApp.post('/v1/login').send({
        email: 'test@toast.com',
        password: rawPassword,
      });
      expect(result).toHaveRequestError();
    });
  });

  it('should create a new user', async () => {
    const details = createUser();
    const result = await adminApp.post('/v1/user').send(details);
    expect(result).toHaveSucceeded();

    const { id, password } = result.body;
    expect(id).not.toBeNull();
    expect(password).toBeUndefined();

    const createdUser = await models.User.findByPk(id);
    expect(createdUser).toHaveProperty('displayName', details.displayName);
    expect(createdUser).not.toHaveProperty('password', details.password);
  });

  it('should not allow a non-admin to create a new user', async () => {
    const userApp = await baseApp.asRole('practitioner');
    const details = createUser();
    const result = await userApp.post('/v1/user').send(details);
    expect(result).toBeForbidden();

    const createdUser = await models.User.findOne({ where: { email: details.email } });
    expect(createdUser).toBeFalsy();
  });

  it('should change a name', async () => {
    const newUser = await models.User.create(
      createUser({
        displayName: 'Alan',
      }),
    );
    const id = newUser.id;

    const result = await adminApp.put(`/v1/user/${id}`).send({
      displayName: 'Brian',
    });
    expect(result).toHaveSucceeded();
    expect(result.body).toHaveProperty('displayName', 'Brian');
    const updatedUser = await models.User.findByPk(id);
    expect(updatedUser).toHaveProperty('displayName', 'Brian');
  });

  it('should allow an admin to change a password', async () => {
    const details = createUser();
    const newUser = await models.User.create(details);
    const id = newUser.id;

    const user = await models.User.scope('withPassword').findByPk(id);
    const oldHashedPW = user.password;
    expect(oldHashedPW).toBeTruthy();
    expect(oldHashedPW).not.toEqual(details.password);

    const newPassword = '000';
    const result = await adminApp.put(`/v1/user/${id}`).send({ password: newPassword });
    expect(result).toHaveSucceeded();
    expect(result.body).not.toHaveProperty('password');
    const updatedUser = await models.User.scope('withPassword').findByPk(id);
    expect(updatedUser).toHaveProperty('displayName', details.displayName);
    expect(updatedUser.password).toBeTruthy();
    expect(updatedUser.password).not.toEqual(details.newPassword);
    expect(updatedUser.password).not.toEqual(oldHashedPW);
  });

  it('should allow a non-admin user to change their own password', async () => {
    const details = createUser();
    const newUser = await models.User.create(details);
    const id = newUser.id;

    const user = await models.User.scope('withPassword').findByPk(id);
    const oldHashedPW = user.password;
    expect(oldHashedPW).toBeTruthy();
    expect(oldHashedPW).not.toEqual(details.password);

    const userAgent = await baseApp.asUser(newUser);
    const newPassword = '000';
    const result = await userAgent.put(`/v1/user/${id}`).send({ password: newPassword });
    expect(result).toHaveSucceeded();
    expect(result.body).not.toHaveProperty('password');

    const updatedUser = await models.User.scope('withPassword').findByPk(id);
    expect(updatedUser).toHaveProperty('displayName', details.displayName);
    expect(updatedUser.password).toBeTruthy();
    expect(updatedUser.password).not.toEqual(details.newPassword);
    expect(updatedUser.password).not.toEqual(oldHashedPW);
  });

  it("should not allow a non-admin user to change someone else's password", async () => {
    const details = createUser();
    const newUser = await models.User.create(details);

    const userAgent = await baseApp.asUser(newUser);

    const otherUser = await models.User.create(createUser());

    const result = await userAgent.put(`/v1/user/${otherUser.id}`).send({ password: '123' });
    expect(result).toBeForbidden();
  });

  it('should fail to create a user without an email', async () => {
    const result = await adminApp.post('/v1/user').send({});
    expect(result).toHaveRequestError();
  });

  it('should fail to create a user with a duplicate email', async () => {
    const baseUserResult = await adminApp.post('/v1/user').send({
      displayName: 'Test Dupe',
      email: 'duplicate@user.com',
      password: 'abc',
    });
    expect(baseUserResult.body.id).not.toBeNull();

    const result = await adminApp.post('/v1/user').send({
      displayName: 'Test Dupe II',
      email: 'duplicate@user.com',
      password: 'abc',
    });
    expect(result).toHaveRequestError();
  });
});
