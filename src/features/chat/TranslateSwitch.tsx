import { useState } from 'react';
import { LanguageCode, LanguageOption } from '../../types';

interface TranslateSwitchProps {
  enabled: boolean;
  selectedLanguage: LanguageCode;
  onToggle: (enabled: boolean) => void;
  onLanguageChange: (language: LanguageCode) => void;
  disabled?: boolean;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'zh_CN', name: '中文', flag: '🇨🇳' },
  { code: 'en_US', name: 'English', flag: '🇺🇸' },
  { code: 'ja_JP', name: '日本語', flag: '🇯🇵' },
];

export default function TranslateSwitch({
  enabled,
  selectedLanguage,
  onToggle,
  onLanguageChange,
  disabled = false
}: TranslateSwitchProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedOption = LANGUAGE_OPTIONS.find(option => option.code === selectedLanguage);

  const handleToggle = () => {
    if (!disabled) {
      onToggle(!enabled);
    }
  };

  const handleLanguageSelect = (language: LanguageCode) => {
    onLanguageChange(language);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      {/* 翻译开关 */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">自动翻译</span>
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            enabled 
              ? 'bg-blue-600' 
              : 'bg-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* 语言选择器 */}
      {enabled && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg">{selectedOption?.flag}</span>
            <span>{selectedOption?.name}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 下拉菜单 */}
          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => handleLanguageSelect(option.code)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-100 ${
                      selectedLanguage === option.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{option.flag}</span>
                    <span>{option.name}</span>
                    {selectedLanguage === option.code && (
                      <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
