
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const togglePasswordShow = (e: any) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (!response.ok) {
        const message = result.message?.toLowerCase() || '';

        if (message.includes('email')) {
          form.setError('email', {
            type: 'manual',
            message: 'Email not found',
          });
        } else if (message.includes('password')) {
          form.setError('password', {
            type: 'manual',
            message: 'Incorrect password',
          });
        } else {
          form.setError('email', {
            type: 'manual',
            message: result.message || 'Login failed',
          });
        }

        return;
      }

      localStorage.setItem('authToken', result.token);
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      form.setError('email', {
        type: 'manual',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D4ED8] via-[#3B82F6] to-[#60A5FA] grid grid-cols-[3fr_2fr]">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 text-white text-center px-10 max-w-md">
          <div className="font-bold flex items-center gap-4">
            <span className="text-6xl rounded-2xl bg-blue-700 w-16 p-2">E</span>
            <h1 className="text-5xl font-extrabold">Echolite</h1>
          </div>
          <p className="text-white/80 text-lg">
            Where connections grow. Join conversations, share stories, and be
            part of the wave.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-6">Login to continue</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        disabled={isLoading}
                        className="w-full border text-black border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel className="!text-black">Password</FormLabel>
                      <NavLink
                        to="/forgot-password"
                        className="text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </NavLink>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="password"
                          {...field}
                          disabled={isLoading}
                          className="w-full border text-black border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Button
                          variant="ghost"
                          onClick={togglePasswordShow}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black hover:cursor-pointer"
                        >
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account?{' '}
            <NavLink to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
