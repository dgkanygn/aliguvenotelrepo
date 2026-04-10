import React from 'react';
import { useLogin } from './hooks/useLogin';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const { 
    register,
    errors,
    error, 
    isLoading, 
    handleSubmit 
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A2B48] px-4">
      <div className="max-w-md w-full">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#C5A059] mb-2 tracking-tight">ALİ GÜVEN OTEL</h1>
          <p className="text-slate-300 text-sm tracking-widest uppercase">Yönetim Paneli Girişi</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Kullanıcı Adı</label>
              <input
                type="text"
                {...register('username')}
                placeholder="admin"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C5A059] transition-all"
              />
              {errors.username && (
                <p className="mt-1 text-red-400 text-xs">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Şifre</label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C5A059] transition-all"
              />
              {errors.password && (
                <p className="mt-1 text-red-400 text-xs">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C5A059] hover:bg-[#A68045] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-500 text-xs">
          © 2026 Ali Güven Otel. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
