import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Crown, Star, Zap, Building, Brain } from 'lucide-react';

interface PlanGateProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  onUpgrade: (plan: string) => void;
}

const featureDescriptions: Record<string, { title: string; description: string; icon: React.ComponentType<{ className?: string }> }> = {
  통합정산: {
    title: '통합 정산',
    description: '여러 공급업체의 주문을 하나의 시스템에서 통합 관리하고 정산할 수 있습니다.',
    icon: Building,
  },
  다점포: {
    title: '다점포 관리',
    description: '여러 매장의 재고와 주문을 통합 관리하여 효율성을 높일 수 있습니다.',
    icon: Building,
  },
  추천AI: {
    title: 'AI 추천',
    description: '인공지능이 레시피와 재고를 분석하여 최적의 상품을 추천해드립니다.',
    icon: Brain,
  },
  자동주문: {
    title: '자동 주문',
    description: '재고가 부족할 때 자동으로 주문을 생성하여 품절을 방지합니다.',
    icon: Zap,
  },
  고급분석: {
    title: '고급 분석',
    description: '상세한 매출 분석과 재고 최적화 리포트를 제공합니다.',
    icon: Star,
  },
};

export const PlanGate: React.FC<PlanGateProps> = ({ isOpen, onClose, feature, onUpgrade }) => {
  const featureInfo = featureDescriptions[feature];
  const FeatureIcon = featureInfo?.icon || Crown;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="프리미엄 기능"
      size="md"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <FeatureIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {featureInfo?.title || feature}
          </h3>
          <p className="text-gray-600">
            {featureInfo?.description || '이 기능은 프리미엄 요금제에서 사용할 수 있습니다.'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">이 기능을 사용하려면</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Standard 요금제 이상 필요</span>
            </div>
            {feature === '다점포' || feature === '자동주문' || feature === '고급분석' ? (
              <div className="flex items-center justify-center space-x-2">
                <Crown className="h-4 w-4 text-purple-500" />
                <span>Premium 요금제 필요</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            나중에
          </Button>
          <Button
            onClick={() => {
              onClose();
              onUpgrade(feature === '다점포' || feature === '자동주문' || feature === '고급분석' ? 'Premium' : 'Standard');
            }}
            className="flex-1"
          >
            <Crown className="h-4 w-4 mr-2" />
            업그레이드
          </Button>
        </div>
      </div>
    </Modal>
  );
};
