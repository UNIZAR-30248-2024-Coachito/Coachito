import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import {
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
} from '@supabase/supabase-js';
import { Alert } from 'react-native';
import { supabase } from '@/api/supabaseClient';

export default function LogIn() {
  const [loading, setLoading] = useState(false);

  // Función para registrar un usuario
  const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const { email, password, options } = credentials;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        console.error('Error al registrar:', error.message);
        Alert.alert('Error al registrar', error.message);
        return;
      }

      console.log('Usuario registrado:', data);
      Alert.alert(
        'Registro exitoso',
        'Revisa tu correo para confirmar tu cuenta.'
      );
    } catch (error) {
      console.error('Error inesperado al registrar:', error);
      Alert.alert('Ocurrió un error inesperado al registrar');
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const handleLogIn = async (credentials: SignInWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error al iniciar sesión:', error.message);
        Alert.alert('Error al iniciar sesión', error.message);
        return;
      }

      console.log('Inicio de sesión exitoso:', data);
      Alert.alert('Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error inesperado al iniciar sesión:', error);
      Alert.alert('Ocurrió un error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm loading={loading} onSignUp={handleSignUp} onLogin={handleLogIn} />
  );
}
