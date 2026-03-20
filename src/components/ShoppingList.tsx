'use client';

import { useState } from 'react';

interface ShoppingItem {
  name: string;
  quantity: string;
  category: string;
}

interface ShoppingListProps {
  items: ShoppingItem[];
}

export default function ShoppingList({ items }: ShoppingListProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const grouped = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const toggle = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const categories = Object.keys(grouped).sort();

  return (
    <div className="neu-flat p-5">
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        Shopping List
      </h3>

      {categories.length === 0 && (
        <p className="text-sm text-gray-400">No items to show.</p>
      )}

      <div className="space-y-5">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              {category}
            </h4>
            <ul className="space-y-2">
              {grouped[category].map((item) => {
                const isChecked = checked.has(item.name);
                return (
                  <li key={item.name}>
                    <label
                      className="flex items-center gap-3 cursor-pointer group rounded-xl p-2 transition-all"
                      style={{
                        background: '#e0e5ec',
                        boxShadow: isChecked
                          ? 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff'
                          : '2px 2px 5px #b8bec7, -2px -2px 5px #ffffff',
                      }}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                          isChecked ? 'neu-pressed' : ''
                        }`}
                        style={{
                          background: '#e0e5ec',
                          boxShadow: isChecked
                            ? 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff'
                            : '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff',
                          borderRadius: '0.375rem',
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          toggle(item.name);
                        }}
                      >
                        {isChecked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(item.name)}
                        className="hidden"
                      />
                      <span
                        className={`text-sm transition-all ${
                          isChecked
                            ? 'line-through text-gray-400'
                            : 'text-gray-700 group-hover:text-gray-500'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`ml-auto text-xs ${
                          isChecked ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
