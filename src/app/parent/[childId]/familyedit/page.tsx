// app/children-settings/page.tsx

import ChildrenForm from './changeChildInfo';
import FamilyTree from './familyTree';
export default function ChildrenSettingsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <FamilyTree />
      <ChildrenForm />
    </div>
  );
}
