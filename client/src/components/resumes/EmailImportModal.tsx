import { Loader2, Mail, AlertCircle } from 'lucide-react';
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
      <div className="space-y-5">
        {loadingConfigs ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-slate-400" size={36} />
          </div>
        ) : emailConfigs.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-600 font-medium mb-2">暂无邮箱配置</p>
            <p className="text-sm text-slate-400">请先在设置中添加邮箱配置</p>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="email-import-select" className="block text-sm font-medium text-slate-700 mb-2">
                选择邮箱账号
              </label>
              <select
                id="email-import-select"
                value={selectedConfigId || ''}
                onChange={(e) => onConfigChange(Number(e.target.value) || null)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white"
              >
                <option value="">请选择邮箱</option>
                {emailConfigs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-700 leading-relaxed">
                系统将自动扫描该邮箱最近7天的邮件，查找包含 PDF 或 Word 格式简历附件的邮件并导入。
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
        >
          取消
        </button>
        <button
          onClick={onImport}
          disabled={!selectedConfigId || importing || emailConfigs.length === 0}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
        >
          {importing && <Loader2 className="animate-spin" size={18} />}
          {importing ? '导入中...' : '开始导入'}
        </button>
      </div>
    </Modal>
  );
}
