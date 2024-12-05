import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Button, Text, TextInput, View } from 'react-native';

import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';

interface AuthFormProps {
  onSignUp: (credentials: SignUpWithPasswordCredentials) => void;
  onLogin: (credentials: SignInWithPasswordCredentials) => void;
  loading: boolean;
}

export default function AuthForm({
  onSignUp,
  onLogin,
  loading,
}: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signUp'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      onSignUp({ email, password, options: { data: { username } } });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 p-4">
            <Text className="text-center text-2xl font-bold my-4">
              Coachito
            </Text>
            {mode === 'signUp' && (
              <View className="my-2">
                <TextInput
                  placeholder="Nombre de usuario"
                  value={username}
                  onChangeText={setUsername}
                  className="border border-gray-300 rounded px-4 py-2"
                />
              </View>
            )}
            <View className="my-2">
              <TextInput
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </View>
            <View className="my-2">
              <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </View>
            <View className="my-2">
              <Button
                title={mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                onPress={handleSubmit}
                disabled={loading || !email || !password}
                className={`rounded py-2 px-4 ${
                  loading ? 'bg-gray-400' : 'bg-blue-500'
                }`}
              />
            </View>
            <View className="mt-4 items-center">
              <Text className="mb-2">
                {mode === 'login'
                  ? '¿No tienes una cuenta?'
                  : '¿Ya tienes una cuenta?'}
              </Text>
              <Button
                title={mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                onPress={() => setMode(mode === 'login' ? 'signUp' : 'login')}
                className="text-blue-500"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
