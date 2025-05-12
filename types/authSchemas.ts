import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: yup.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .matches(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .matches(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .matches(/[0-9]/, 'Deve conter pelo menos um número')
    .required('Senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});


export const resetPasswordSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
