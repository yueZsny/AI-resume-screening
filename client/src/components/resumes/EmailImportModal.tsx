import { Loader2, Mail } from 'lucide-react';
import { Modal } from '../Modal';
import type { EmailConfig } from '../../types/email';

interface EmailImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailConfigs: EmailConfig[];
  loadingConfigs: boolean;
  selectedConfigId: number | null;
  onConfigChange: (id: number | null) => void;
  onImport: () => void;
  importing: boolean;
}

export function EmailImportModal({
  isOpen,
  onClose,
  emailConfigs,
  loadingConfigs,
  selectedConfigId,
  onConfigChange,
  onImport,
  importing,
}: EmailImportModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="从邮箱导入简历"
      size="md"
    >
      <div className="space-y-4">
        {loadingConfigs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : emailConfigs.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="mx-auto text-gray-400 mb-3" size={40} />
            <p className="text-gray-500 mb-4">暂无邮箱配置</p>
            <p className="text-sm text-gray-400">请先在设置中添加邮箱配置</p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择邮箱账号
              </label>
              <select
                id="email-config-select"
                title="选择邮箱账号"
                value={selectedConfigId || ''}
                onChange={(e) => onConfigChange(Number(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">请选择邮箱</option>
                {emailConfigs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                系统将自动扫描该邮箱最近7天的邮件，查找包含 PDF 或 Word 格式简历附件的邮件并导入。
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          onClick={onImport}
          disabled={!selectedConfigId || importing || emailConfigs.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {importing && <Loader2 className="animate-spin" size={18} />}
          {importing ? '导入中...' : '开始导入'}
        </button>
      </div>
    </Modal>
  );
}
