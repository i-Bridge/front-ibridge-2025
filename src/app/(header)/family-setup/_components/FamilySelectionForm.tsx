import { Text } from '@/ui/Text';
import ModalCard from '@/ui/Modal/ModalCard';
import CustomCard from '@/ui/CustomCard';
import { useSetupStore } from '@/store/useSetupStore';

export default function FamilySelectionForm() {
  const { setStep } = useSetupStore();
  return (
    <ModalCard hasBorder={false} className="">

      <div className="flex flex-col gap-3">
        <Text as="div" variant="title01">
          아직 속한 집이 없어요.
        </Text>
        <Text as="div" variant="body03" className="text-grayscale-gray60">
          집을 생성하거나, 등록된 집에 참여할 수 있어요.
        </Text>
      </div>

      <div className="flex flex-col item-center gap-5 justify-center self-stretch">
        <CustomCard
          onClick={() => setStep(1)}
          className="bg-primary-primary self-stretch"
        >
          <div className="gap-3">
            <Text variant="title02" className="text-white">
              집 생성하기
            </Text>
            <Text variant="body03" className="text-white/60">
              아직 집이 없어요.
            </Text>
          </div>
        </CustomCard>
        <CustomCard
          onClick={() => setStep(3)}
          className="bg-primary-primaryLight "
        >
          <div className="gap-3">
            <Text variant="title02" className="text-primary-primary">
              집 찾기
            </Text>
            <Text variant="body03" className="text-primary-primary">
              이미 등록된 집이 있어요.
            </Text>
          </div>
        </CustomCard>
      </div>
      
    </ModalCard>
  );
}
