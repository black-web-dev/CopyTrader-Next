// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const SECRET_KEY =
  process.env.NEXT_RECAPTHA_SECRET_KEY ||
  '6Lfw-OwnAAAAAH5C2RglwlHLc6QVS46laJPiD_U2';

export default async function verifyToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token } = req.body;
    // replace APP_SECRET_KEY with your reCAPTCHA secret key
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
    );
    return res.status(200).json({
      success: true,
      message: 'Token successfully verified',
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying token',
    });
  }
}
