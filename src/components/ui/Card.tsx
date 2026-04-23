import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  extra?: ReactNode;
}

export default function Card({ children, className, title, subtitle, extra }: CardProps) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow-md', className)}>
      {(title || extra) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            {title && <h3 className="text-[15px] font-semibold text-slate-800 leading-none mb-1">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
