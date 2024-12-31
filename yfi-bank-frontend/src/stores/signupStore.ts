import { create } from 'zustand';
import { useAuth } from '../hooks/useAuth';
import { SignupFormData } from '../types/common';

interface SignupStore {
  formData: SignupFormData;
  activeStep: number;
  setFormData: (data: Partial<SignupFormData>) => void;
  setActiveStep: (step: number | ((prev: number) => number)) => void;
  resetStore: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  signup: (data: SignupFormData) => Promise<void>;
  sendPhoneCode: (phone: string) => Promise<void>;
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
  token: '',
};

export const useSignupStore = create<SignupStore>((set) => ({
  formData: initialState,
  activeStep: 0,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setActiveStep: (step) =>
    set((state) => ({
      activeStep: typeof step === 'function' ? step(state.activeStep) : step,
    })),
  resetStore: () =>
    set({
      formData: initialState,
      activeStep: 0,
    }),
  isSubmitting: false,
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  signup: async (data) => {
    console.log('signup', data);
    try {
      const { email, password, ...userData } = data;
      const user = await useAuth().signUp(email, password, userData);
      if (user) {
        set({ formData: initialState, activeStep: 0, isSubmitting: false });
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      set({ isSubmitting: false });
    }
  },
  sendPhoneCode: async (phone) => {
    console.log('sendPhoneCode', phone);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
}));