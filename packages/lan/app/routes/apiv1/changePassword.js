import express from 'express';
import asyncHandler from 'express-async-handler';
import { WebRemote } from '../../sync';

export const changePassword = express.Router();

changePassword.post(
  '/$',
  asyncHandler(async (req, res) => {
    // no permission needed
    req.flagPermissionChecked();

    const { models } = req;

    const remote = new WebRemote();
    const response = await remote.forwardRequest(req, 'changePassword');

    // If sync server successful, update password on lan server too
    await updatePasswordOnLanServer(models, req.body);

    res.send(response);
  }),
);

const updatePasswordOnLanServer = async (models, { email, newPassword }) => {
  await models.User.update(
    {
      password: newPassword,
    },
    { where: { email } },
  );
};
