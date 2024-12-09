import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { VStack } from './ui/vstack';
import {
  CircleUserRound,
  AtSignIcon,
  LockKeyhole,
  UserRoundPlus,
  UserRound,
} from 'lucide-react-native';
import { Input, InputField, InputIcon, InputSlot } from './ui/input';
import { EyeIcon, EyeOffIcon } from './ui/icon';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { HStack } from './ui/hstack';

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
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleSubmit = () => {
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      onSignUp({ email, password, options: { data: { username } } });
    }
  };

  const resetInputs = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack className="p-4 gap-4 flex-1 justify-center items-center">
            {mode === 'signUp' ? (
              <>
                <UserRoundPlus color="white" size={100} />
                <Text className="text-2xl font-bold mb-4 text-white">
                  Registro
                </Text>
              </>
            ) : (
              <>
                <UserRound color="white" size={100} />
                <Text className="text-2xl font-bold mb-4 text-white">
                  Inicio de sesión
                </Text>
              </>
            )}
            {mode === 'signUp' && (
              <Input>
                <InputSlot className="pl-3">
                  <InputIcon as={CircleUserRound} />
                </InputSlot>
                <InputField
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Nombre de usuario"
                />
              </Input>
            )}
            <Input>
              <InputSlot className="pl-3">
                <InputIcon as={AtSignIcon} />
              </InputSlot>
              <InputField
                value={email}
                onChangeText={setEmail}
                placeholder="Correo"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Input>

            <Input>
              <InputSlot className="pl-3">
                <InputIcon as={LockKeyhole} />
              </InputSlot>
              <InputField
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                autoCapitalize="none"
              />
              <InputSlot className="p-2" onPress={handlePasswordState}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>

            <Button
              onPress={handleSubmit}
              isDisabled={loading || !email || !password}
              className={`${loading || !email || !password ? 'w-full bg-gray-400 rounded-lg' : 'w-full bg-blue-500 rounded-lg'}`}
            >
              <Text className="text-white">
                {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </Text>
            </Button>

            <HStack className="mt-4 items-center">
              <Text className="text-white">
                {mode === 'login'
                  ? '¿No tiene una cuenta?'
                  : '¿Ya tiene una cuenta?'}
              </Text>
              <Button
                onPress={() => {
                  setMode(mode === 'login' ? 'signUp' : 'login');
                  resetInputs();
                }}
                className="bg-transparent"
              >
                <Text className="text-blue-500" underline>
                  {mode === 'login' ? 'Registrarse' : 'Iniciar sesión'}
                </Text>
              </Button>
            </HStack>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
