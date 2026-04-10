import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı gerekli"),
  password: z.string().min(1, "Şifre gerekli")
});

export const useLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    const success = await login(data.username, data.password);

    if (success) {
      toast.success('Giriş başarılı');
      navigate('/dashboard');
    } else {
      setError('Geçersiz kullanıcı adı veya şifre.');
    }
    setIsLoading(false);
  };

  return {
    register,
    errors,
    error,
    isLoading,
    handleSubmit: handleSubmit(onSubmit)
  };
};
