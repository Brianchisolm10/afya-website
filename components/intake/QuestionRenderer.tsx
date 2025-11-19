'use client';

import { Question, QuestionType } from '@/types/intake';
import { Input } from '@/components/ui';
import { useState } from 'react';

export interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  error
}: QuestionRendererProps) {
  const [isFocused, setIsFocused] = useState(false);

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return renderTextInput();
      case 'number':
        return renderNumberInput();
      case 'select':
        return renderSelect();
      case 'multiselect':
        return renderMultiSelect();
      case 'radio':
        return renderRadio();
      case 'checkbox':
        return renderCheckbox();
      case 'textarea':
        return renderTextarea();
      case 'date':
        return renderDatePicker();
      case 'range':
        return renderRange();
      default:
        return null;
    }
  };

  const renderTextInput = () => (
    <Input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      error={error}
      helperText={question.helpText}
      required={question.isRequired}
      fullWidth
    />
  );

  const renderNumberInput = () => (
    <div>
      <div className="relative">
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder={question.placeholder}
          min={question.min}
          max={question.max}
          step={question.step}
          error={error}
          required={question.isRequired}
          fullWidth
          className={question.unit ? 'pr-16' : ''}
        />
        {question.unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {question.unit}
          </span>
        )}
      </div>
      {question.helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{question.helpText}</p>
      )}
    </div>
  );

  const renderSelect = () => (
    <div>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white text-gray-900 ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-afya-primary focus:border-afya-primary'
        }`}
        required={question.isRequired}
      >
        <option value="">
          {question.placeholder || 'Select an option...'}
        </option>
        {question.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {question.helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{question.helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );

  const renderMultiSelect = () => {
    const selectedValues = Array.isArray(value) ? value : [];

    const toggleOption = (optionValue: string) => {
      if (selectedValues.includes(optionValue)) {
        onChange(selectedValues.filter((v) => v !== optionValue));
      } else {
        onChange([...selectedValues, optionValue]);
      }
    };

    return (
      <div>
        <div className="space-y-2">
          {question.options?.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-afya-primary bg-afya-light'
                    : 'border-gray-300 hover:border-gray-400'
                } ${error ? 'border-red-500' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOption(option.value)}
                  className="mt-1 h-4 w-4 text-afya-primary focus:ring-afya-primary border-gray-300 rounded"
                />
                <div className="ml-3 flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {question.helpText && !error && (
          <p className="mt-2 text-sm text-gray-500">{question.helpText}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderRadio = () => (
    <div>
      <div className="space-y-2">
        {question.options?.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-afya-primary bg-afya-light'
                  : 'border-gray-300 hover:border-gray-400'
              } ${error ? 'border-red-500' : ''}`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 h-4 w-4 text-afya-primary focus:ring-afya-primary border-gray-300"
              />
              <div className="ml-3 flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {question.helpText && !error && (
        <p className="mt-2 text-sm text-gray-500">{question.helpText}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );

  const renderCheckbox = () => {
    const selectedValues = Array.isArray(value) ? value : [];

    const toggleOption = (optionValue: string) => {
      if (selectedValues.includes(optionValue)) {
        onChange(selectedValues.filter((v) => v !== optionValue));
      } else {
        onChange([...selectedValues, optionValue]);
      }
    };

    return (
      <div>
        <div className="space-y-2">
          {question.options?.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-afya-primary bg-afya-light'
                    : 'border-gray-300 hover:border-gray-400'
                } ${error ? 'border-red-500' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOption(option.value)}
                  className="mt-1 h-4 w-4 text-afya-primary focus:ring-afya-primary border-gray-300 rounded"
                />
                <div className="ml-3 flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {question.helpText && !error && (
          <p className="mt-2 text-sm text-gray-500">{question.helpText}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderTextarea = () => (
    <div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        rows={4}
        className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white text-gray-900 resize-y ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-afya-primary focus:border-afya-primary'
        }`}
        required={question.isRequired}
      />
      {question.helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{question.helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );

  const renderDatePicker = () => (
    <div>
      <Input
        type="date"
        value={value ? new Date(value).toISOString().split('T')[0] : ''}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        error={error}
        helperText={question.helpText}
        required={question.isRequired}
        fullWidth
      />
    </div>
  );

  const renderRange = () => {
    const currentValue = value !== null && value !== undefined ? value : question.min || 0;

    return (
      <div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {question.min || 0}
              {question.unit && ` ${question.unit}`}
            </span>
            <span className="text-lg font-semibold text-afya-primary">
              {currentValue}
              {question.unit && ` ${question.unit}`}
            </span>
            <span className="text-sm text-gray-600">
              {question.max || 100}
              {question.unit && ` ${question.unit}`}
            </span>
          </div>
          <input
            type="range"
            min={question.min || 0}
            max={question.max || 100}
            step={question.step || 1}
            value={currentValue}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-afya-primary"
          />
        </div>
        {question.helpText && !error && (
          <p className="mt-2 text-sm text-gray-500">{question.helpText}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium text-gray-900">
          {question.label}
          {question.isRequired && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </span>
        <div className="mt-2">{renderInput()}</div>
      </label>
    </div>
  );
}
