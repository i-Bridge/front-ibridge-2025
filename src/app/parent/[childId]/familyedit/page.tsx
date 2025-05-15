import ChildrenForm from '@/components/Familyedit/ChangeChildInfo';
import FamilyTree from '@/components/Familyedit/familyTree';
export default function ChildrenSettingsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <FamilyTree />
      <ChildrenForm />
    </div>
  );
}
