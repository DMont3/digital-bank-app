import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SignupFormData } from '../types/common';

interface SignupStore {
  formData: SignupFormData;
  activeStep: number;
  setFormData: (data: Partial<SignupFormData>) => void;
  setActiveStep: (step: number | ((prev: number) => number)) => void;
  resetStore: () => void;
}

const initialState: SignupFormData = {
  email: '',
  emailCode: '',
  phone: '',
  phoneCode: '',
  name: '',
  cpf: '',
  birthDate: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  password: '',
  confirmPassword: '',
  token: '' // Adiciona o token ao estado inicial
};

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      formData: initialState,
      activeStep: 0,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      setActiveStep: (step) =>
        set((state) => ({
          activeStep: typeof step === 'function' ? step(state.activeStep) : step
        })),
      resetStore: () =>
        set({
          formData: initialState,
          activeStep: 0
        })
    }),
    {
      name: 'signup-storage',
      // Só persiste o formData e activeStep
      partialize: (state) => ({
        formData: state.formData,
        activeStep: state.activeStep
      })
    }
  )
);
