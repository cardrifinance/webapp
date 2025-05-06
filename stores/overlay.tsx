import { create } from "zustand";

interface addBVNManualState {
  open: boolean;
  setOpen: (value: boolean) => void;
}
interface sendMoneyModalState {
  open: boolean;
  setOpen: (value: boolean) => void;
}

interface beneficiaryState {
  beneficiaryDetalis: any;
  setBeneficiaryDetails: (value: boolean) => void;
}
interface bankModalState {
  open: boolean;
  setOpen: (value: boolean) => void;
  bankDetails: any;
  setBandDetails: (value: any) => void;
}

interface countryModalState {
  open: boolean;
  setOpen: (value: boolean) => void;
  countryDetails: any;
  setCountryDetails: (value: any) => void;
}
interface devicingBindingState {
  open: boolean;
  setOpen: (value: boolean) => void;
  id: string;
  setId: (value: string) => void;
}

interface transactionPinState {
  open: boolean;
  otp: string;
  setOtp: (value: string) => void;
  setOpen: (value: boolean) => void;
}

interface loadingSpinState {
  openLoader: boolean;

  setOpenLoader: (value: boolean) => void;
}
const useBVNmanualOverlay = create<addBVNManualState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useSendMoneyModalOverlay = create<sendMoneyModalState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));
const useWireBeneficiaryDetailsOverlay = create<beneficiaryState>((set) => ({
  beneficiaryDetalis: [],
  setBeneficiaryDetails: (value) => set({ beneficiaryDetalis: value }),
}));
const useBankModal = create<bankModalState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
  bankDetails: [],
  setBandDetails: (value) => set({ bankDetails: value }),
}));
const useCountryModal = create<countryModalState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
  countryDetails: [],
  setCountryDetails: (value) => set({ countryDetails: value }),
}));

const useDeviceBindingOverlay = create<devicingBindingState>((set) => ({
  open: false,
  id: "",
  setId: (value) => set({ id: value }),
  setOpen: (value) => set({ open: value }),
}));

const useTransactionPinOverlay = create<transactionPinState>((set) => ({
  open: false,
  otp: "",
  setOtp: (value) => set({ otp: value }),

  setOpen: (value) => set({ open: value }),
}));
const useLoadingSpinOverlay = create<loadingSpinState>((set) => ({
  openLoader: false,

  setOpenLoader: (value) => set({ openLoader: value }),
}));
export {
  useBVNmanualOverlay,
  useDeviceBindingOverlay,
  useSendMoneyModalOverlay,
  useBankModal,
  useTransactionPinOverlay,
  useCountryModal,
  useWireBeneficiaryDetailsOverlay,
  useLoadingSpinOverlay,
};
