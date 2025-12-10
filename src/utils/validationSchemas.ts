import * as yup from 'yup';

// Auth validation schemas
export const signUpSchema = yup.object().shape({
  displayName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required')
    .trim(),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required('Password is required'),
});

// Product validation schemas
export const productSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .required('Product name is required')
    .trim(),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .required('Description is required')
    .trim(),
  price: yup
    .number()
    .positive('Price must be a positive number')
    .required('Price is required')
    .typeError('Price must be a number'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(
      ['Electronics', 'Clothing', 'Home', 'Sports', 'Books', 'Other'],
      'Invalid category'
    ),
  stock: yup
    .number()
    .min(0, 'Stock cannot be negative')
    .required('Stock is required')
    .typeError('Stock must be a number')
    .integer('Stock must be a whole number'),
  imageUrl: yup
    .string()
    .url('Image URL must be a valid URL')
    .required('Image URL is required')
    .trim(),
});

// Payment validation schema
export const paymentSchema = yup.object().shape({
  cardholderName: yup
    .string()
    .min(3, 'Cardholder name must be at least 3 characters')
    .max(50, 'Cardholder name must not exceed 50 characters')
    .required('Cardholder name is required')
    .trim()
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  cardNumber: yup
    .string()
    .required('Card number is required')
    .matches(/^\d{13,19}$/, 'Card number must be between 13 and 19 digits'),
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .test('expiry-not-expired', 'Card has expired', function (value) {
      if (!value) return false;
      const [month, year] = value.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      const expiryYear = parseInt(year, 10);
      const expiryMonth = parseInt(month, 10);

      if (expiryYear < currentYear) return false;
      if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
      return true;
    }),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;
export type SignInFormValues = yup.InferType<typeof signInSchema>;
export type ProductFormValues = yup.InferType<typeof productSchema>;
export type PaymentFormValues = yup.InferType<typeof paymentSchema>;
