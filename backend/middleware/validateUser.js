const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate name
  if (typeof name !== 'string' || name.length < 3 || name.length > 15) {
    return res.status(400).json({ message: 'Name must be between 3 and 15 characters long' });
  }

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email must contain an "@" symbol' });
  }

  // Validate password
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,15}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      message: 'Password must be between 6 and 15 characters long, include at least one letter, one number, and one special character'
    });
  }

  // Proceed if all validations pass
  next();
};

export default validateUser;
