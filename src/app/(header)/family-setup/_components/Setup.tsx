'use client';
import { useSetupStore } from '@/store/useSetupStore';
import FamilySelectionForm from './FamilySelectionForm';
import CreateFamilyForm from './CreateFamilyForm';
import FindFamilyForm from './FindFamilyForm';
import AddChildrenForm from './AddChildrenForm';
const Setup = () => {
  const { step } = useSetupStore();
  return (
    <div>
      {step === 0 && <FamilySelectionForm />}
      {step === 1 && <CreateFamilyForm />}
      {step === 2 && <AddChildrenForm />}
      {step === 3 && <FindFamilyForm />}
    </div>
  );
};

export default Setup;
