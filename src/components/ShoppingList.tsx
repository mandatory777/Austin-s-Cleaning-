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
    <div className="rounded-xl border bg-white p-5">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Shopping List
      </h3>

      {categories.length === 0 && (
        <p className="text-sm text-slate-400">No items to show.</p>
      )}

      <div className="space-y-5">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              {category}
            </h4>
            <ul className="space-y-1.5">
              {grouped[category].map((item) => {
                const isChecked = checked.has(item.name);
                return (
                  <li key={item.name}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(item.name)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-400"
                      />
                      <span
                        className={`text-sm transition-all ${
                          isChecked
                            ? 'line-through text-slate-300'
                            : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`ml-auto text-xs ${
                          isChecked ? 'text-slate-200' : 'text-slate-400'
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
