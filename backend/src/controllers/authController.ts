import type { Request, Response } from 'express';
import * as authService from '../services/authService';
import { t } from '../utils/i18n';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        error: t('errors.required', req.language),
      });
    }

    const user = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
    });

    res.status(201).json({
      success: true,
      message: t('auth.registerSuccess', req.language),
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || t('errors.serverError', req.language),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: t('errors.required', req.language),
      });
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: t('auth.loginSuccess', req.language),
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      error: error.message || t('errors.invalidCredentials', req.language),
    });
  }
};

