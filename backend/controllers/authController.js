const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      language = 'en'
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      language
    });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        requiresTwoFactor: true,
        userId: user.id
      });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const setupTwoFactor = async (req, res) => {
  try {
    const user = req.user;
    
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Blueprint:${user.email}`
    });

    // Save secret to user
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyTwoFactor = async (req, res) => {
  try {
    const { userId, token } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid 2FA code' });
    }

    if (!user.twoFactorEnabled) {
      user.twoFactorEnabled = true;
      await user.save();
    }

    const authToken = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language
      },
      token: authToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In a real application, send password reset email
    // For demo, we'll just return success
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    
    if (!['en', 'fr'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    req.user.language = language;
    await req.user.save();

    res.json({ message: 'Language updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await req.user.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  setupTwoFactor,
  verifyTwoFactor,
  resetPassword,
  updateLanguage,
  deleteAccount
};
